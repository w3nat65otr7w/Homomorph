const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("JobManager Contract Tests", function () {
  let JobManager;
  let jobManager;
  let MarketRegistry;
  let marketRegistry;
  let owner;
  let consumer;
  let provider;
  let addrs;

  beforeEach(async function () {
    [owner, consumer, provider, ...addrs] = await ethers.getSigners();

    // Deploy MarketRegistry first
    MarketRegistry = await ethers.getContractFactory("MarketRegistry");
    marketRegistry = await MarketRegistry.deploy();
    await marketRegistry.waitForDeployment();

    // Deploy JobManager with registry address
    JobManager = await ethers.getContractFactory("JobManager");
    jobManager = await JobManager.deploy(await marketRegistry.getAddress());
    await jobManager.waitForDeployment();
  });

  describe("Provider Staking", function () {
    it("Should allow provider to stake ETH", async function () {
      const stakeAmount = ethers.parseEther("0.1");

      await expect(
        jobManager.connect(provider).stakeAsProvider({ value: stakeAmount })
      )
        .to.emit(jobManager, "ProviderStaked")
        .withArgs(provider.address, stakeAmount);

      const stake = await jobManager.providerStake(provider.address);
      expect(stake).to.equal(stakeAmount);

      const reputation = await jobManager.providerReputation(provider.address);
      expect(reputation).to.equal(50); // Initial reputation
    });

    it("Should reject stake less than minimum", async function () {
      const insufficientStake = ethers.parseEther("0.01");

      await expect(
        jobManager.connect(provider).stakeAsProvider({ value: insufficientStake })
      ).to.be.revertedWith("Insufficient stake");
    });

    it("Should allow provider to unstake", async function () {
      const stakeAmount = ethers.parseEther("0.2");
      await jobManager.connect(provider).stakeAsProvider({ value: stakeAmount });

      const unstakeAmount = ethers.parseEther("0.1");
      await expect(
        jobManager.connect(provider).unstakeProvider(unstakeAmount)
      )
        .to.emit(jobManager, "ProviderUnstaked")
        .withArgs(provider.address, unstakeAmount);

      const remainingStake = await jobManager.providerStake(provider.address);
      expect(remainingStake).to.equal(ethers.parseEther("0.1"));
    });
  });

  describe("Job Posting", function () {
    it("Should allow consumer to post a job", async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("test input"));
      const jobPrice = ethers.parseEther("0.5");
      const deadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      await expect(
        jobManager.connect(consumer).postJob(inputCommitment, deadline, { value: jobPrice })
      )
        .to.emit(jobManager, "JobPosted")
        .withArgs(0, consumer.address, ethers.ZeroAddress, inputCommitment, jobPrice, deadline);

      const job = await jobManager.getJob(0);
      expect(job.consumer).to.equal(consumer.address);
      expect(job.priceWei).to.equal(jobPrice);
      expect(job.status).to.equal(0); // JobStatus.Posted
    });

    it("Should reject job with no escrow", async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        jobManager.connect(consumer).postJob(inputCommitment, deadline, { value: 0 })
      ).to.be.revertedWith("Escrow required");
    });

    it("Should reject job with past deadline", async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("test"));
      const pastDeadline = Math.floor(Date.now() / 1000) - 3600;

      await expect(
        jobManager.connect(consumer).postJob(inputCommitment, pastDeadline, {
          value: ethers.parseEther("0.1")
        })
      ).to.be.revertedWith("Invalid deadline");
    });
  });

  describe("Job Acceptance", function () {
    let jobId;
    const jobPrice = ethers.parseEther("1.0");
    const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("test input"));

    beforeEach(async function () {
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const tx = await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      const receipt = await tx.wait();
      jobId = 0; // First job

      // Provider stakes enough
      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.2")
      });
    });

    it("Should allow staked provider to accept job", async function () {
      await expect(jobManager.connect(provider).acceptJob(jobId))
        .to.emit(jobManager, "JobAccepted")
        .withArgs(jobId, provider.address);

      const job = await jobManager.getJob(jobId);
      expect(job.provider).to.equal(provider.address);
      expect(job.status).to.equal(1); // JobStatus.Accepted
    });

    it("Should reject provider with insufficient stake", async function () {
      const lowStakeProvider = addrs[0];
      await jobManager.connect(lowStakeProvider).stakeAsProvider({
        value: ethers.parseEther("0.01")
      });

      await expect(
        jobManager.connect(lowStakeProvider).acceptJob(jobId)
      ).to.be.revertedWith("Insufficient stake");
    });
  });

  describe("Result Submission", function () {
    let jobId;
    const jobPrice = ethers.parseEther("0.5");

    beforeEach(async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("input"));
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      jobId = 0;

      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.1")
      });
      await jobManager.connect(provider).acceptJob(jobId);
    });

    it("Should allow provider to submit result", async function () {
      const resultCommitment = ethers.keccak256(ethers.toUtf8Bytes("result"));

      await expect(jobManager.connect(provider).submitResult(jobId, resultCommitment))
        .to.emit(jobManager, "ResultSubmitted")
        .withArgs(jobId, resultCommitment, await ethers.provider.getBlock("latest").then(b => b.timestamp + 1));

      const job = await jobManager.getJob(jobId);
      expect(job.resultCommitment).to.equal(resultCommitment);
      expect(job.status).to.equal(2); // JobStatus.ResultSubmitted
    });

    it("Should reject non-provider submission", async function () {
      const resultCommitment = ethers.keccak256(ethers.toUtf8Bytes("result"));

      await expect(
        jobManager.connect(consumer).submitResult(jobId, resultCommitment)
      ).to.be.revertedWith("Not provider");
    });
  });

  describe("Job Settlement", function () {
    let jobId;
    const jobPrice = ethers.parseEther("0.5");

    beforeEach(async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("input"));
      const deadline = Math.floor(Date.now() / 1000) + 86400;

      await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      jobId = 0;

      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.1")
      });
      await jobManager.connect(provider).acceptJob(jobId);

      const resultCommitment = ethers.keccak256(ethers.toUtf8Bytes("result"));
      await jobManager.connect(provider).submitResult(jobId, resultCommitment);
    });

    it("Should settle job after dispute period", async function () {
      // Increase time by 3 days (dispute period)
      await ethers.provider.send("evm_increaseTime", [3 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine");

      const providerBalanceBefore = await ethers.provider.getBalance(provider.address);

      await expect(jobManager.connect(consumer).settle(jobId))
        .to.emit(jobManager, "JobSettled")
        .withArgs(jobId, provider.address, jobPrice);

      const job = await jobManager.getJob(jobId);
      expect(job.status).to.equal(3); // JobStatus.Settled

      const escrowBalance = await jobManager.escrow(jobId);
      expect(escrowBalance).to.equal(0);

      const completedJobs = await jobManager.completedJobs(provider.address);
      expect(completedJobs).to.equal(1);
    });

    it("Should allow owner to settle immediately", async function () {
      await expect(jobManager.connect(owner).settle(jobId))
        .to.emit(jobManager, "JobSettled")
        .withArgs(jobId, provider.address, jobPrice);
    });

    it("Should reject settlement before dispute period", async function () {
      await expect(
        jobManager.connect(consumer).settle(jobId)
      ).to.be.revertedWith("Dispute period not ended");
    });
  });

  describe("Job Cancellation", function () {
    it("Should allow consumer to cancel unaccepted job", async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("input"));
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const jobPrice = ethers.parseEther("0.5");

      await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      const jobId = 0;

      await expect(jobManager.connect(consumer).cancel(jobId))
        .to.emit(jobManager, "JobCancelled")
        .withArgs(jobId, "Cancelled by consumer");

      const job = await jobManager.getJob(jobId);
      expect(job.status).to.equal(4); // JobStatus.Cancelled
    });
  });

  describe("Expired Job Refund", function () {
    it("Should refund consumer if job expires without result", async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("input"));
      const deadline = Math.floor(Date.now() / 1000) + 3600; // 1 hour
      const jobPrice = ethers.parseEther("0.5");

      await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      const jobId = 0;

      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.1")
      });
      await jobManager.connect(provider).acceptJob(jobId);

      // Fast forward past deadline
      await ethers.provider.send("evm_increaseTime", [3700]);
      await ethers.provider.send("evm_mine");

      await expect(jobManager.connect(consumer).refundExpiredJob(jobId))
        .to.emit(jobManager, "JobCancelled")
        .withArgs(jobId, "Expired");

      const job = await jobManager.getJob(jobId);
      expect(job.status).to.equal(4); // JobStatus.Cancelled
    });
  });

  describe("Job Dispute", function () {
    let jobId;

    beforeEach(async function () {
      const inputCommitment = ethers.keccak256(ethers.toUtf8Bytes("input"));
      const deadline = Math.floor(Date.now() / 1000) + 86400;
      const jobPrice = ethers.parseEther("0.5");

      await jobManager.connect(consumer).postJob(inputCommitment, deadline, {
        value: jobPrice
      });
      jobId = 0;

      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.1")
      });
      await jobManager.connect(provider).acceptJob(jobId);

      const resultCommitment = ethers.keccak256(ethers.toUtf8Bytes("result"));
      await jobManager.connect(provider).submitResult(jobId, resultCommitment);
    });

    it("Should allow consumer to dispute within period", async function () {
      await expect(jobManager.connect(consumer).disputeJob(jobId))
        .to.emit(jobManager, "JobDisputed")
        .withArgs(jobId, consumer.address);

      const job = await jobManager.getJob(jobId);
      expect(job.status).to.equal(5); // JobStatus.Disputed
    });

    it("Should reject dispute after period expires", async function () {
      await ethers.provider.send("evm_increaseTime", [4 * 24 * 60 * 60]); // 4 days
      await ethers.provider.send("evm_mine");

      await expect(
        jobManager.connect(consumer).disputeJob(jobId)
      ).to.be.revertedWith("Dispute period ended");
    });
  });

  describe("Provider Info", function () {
    it("Should return correct provider information", async function () {
      await jobManager.connect(provider).stakeAsProvider({
        value: ethers.parseEther("0.5")
      });

      const [stake, reputation, completed] = await jobManager.getProviderInfo(provider.address);

      expect(stake).to.equal(ethers.parseEther("0.5"));
      expect(reputation).to.equal(50);
      expect(completed).to.equal(0);
    });
  });
});
