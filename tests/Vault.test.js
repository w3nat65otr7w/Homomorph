const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Vault Contract Tests", function () {
  let Vault;
  let vault;
  let owner;
  let user1;
  let user2;
  let addrs;

  beforeEach(async function () {
    [owner, user1, user2, ...addrs] = await ethers.getSigners();

    Vault = await ethers.getContractFactory("Vault");
    vault = await Vault.deploy();
    await vault.waitForDeployment();
  });

  describe("Deposit", function () {
    it("Should accept deposits", async function () {
      const depositAmount = ethers.parseEther("1.0");

      await vault.connect(user1).deposit({ value: depositAmount });

      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(depositAmount);
    });

    it("Should reject zero value deposits", async function () {
      await expect(
        vault.connect(user1).deposit({ value: 0 })
      ).to.be.revertedWith("No value");
    });

    it("Should accumulate multiple deposits", async function () {
      const deposit1 = ethers.parseEther("0.5");
      const deposit2 = ethers.parseEther("0.3");

      await vault.connect(user1).deposit({ value: deposit1 });
      await vault.connect(user1).deposit({ value: deposit2 });

      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(deposit1 + deposit2);
    });

    it("Should maintain separate balances for different users", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.0");

      await vault.connect(user1).deposit({ value: amount1 });
      await vault.connect(user2).deposit({ value: amount2 });

      const balance1 = await vault.balances(user1.address);
      const balance2 = await vault.balances(user2.address);

      expect(balance1).to.equal(amount1);
      expect(balance2).to.equal(amount2);
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      const depositAmount = ethers.parseEther("2.0");
      await vault.connect(user1).deposit({ value: depositAmount });
    });

    it("Should allow withdrawal of deposited funds", async function () {
      const withdrawAmount = ethers.parseEther("1.0");
      const balanceBefore = await ethers.provider.getBalance(user1.address);

      const tx = await vault.connect(user1).withdraw(withdrawAmount);
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const balanceAfter = await ethers.provider.getBalance(user1.address);
      const vaultBalance = await vault.balances(user1.address);

      expect(vaultBalance).to.equal(ethers.parseEther("1.0"));
      expect(balanceAfter).to.equal(balanceBefore - gasUsed + withdrawAmount);
    });

    it("Should reject withdrawal exceeding balance", async function () {
      const excessiveAmount = ethers.parseEther("5.0");

      await expect(
        vault.connect(user1).withdraw(excessiveAmount)
      ).to.be.revertedWith("Insufficient");
    });

    it("Should allow full withdrawal", async function () {
      const fullAmount = ethers.parseEther("2.0");

      await vault.connect(user1).withdraw(fullAmount);

      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(0);
    });

    it("Should reject withdrawal from zero balance", async function () {
      await expect(
        vault.connect(user2).withdraw(ethers.parseEther("0.1"))
      ).to.be.revertedWith("Insufficient");
    });

    it("Should handle multiple partial withdrawals", async function () {
      const withdraw1 = ethers.parseEther("0.5");
      const withdraw2 = ethers.parseEther("0.8");

      await vault.connect(user1).withdraw(withdraw1);
      await vault.connect(user1).withdraw(withdraw2);

      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(ethers.parseEther("0.7"));
    });
  });

  describe("Balance Tracking", function () {
    it("Should correctly track balance through deposits and withdrawals", async function () {
      const deposit1 = ethers.parseEther("1.0");
      const deposit2 = ethers.parseEther("0.5");
      const withdraw1 = ethers.parseEther("0.3");

      await vault.connect(user1).deposit({ value: deposit1 });
      await vault.connect(user1).deposit({ value: deposit2 });
      await vault.connect(user1).withdraw(withdraw1);

      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(ethers.parseEther("1.2"));
    });

    it("Should return zero for address with no deposits", async function () {
      const balance = await vault.balances(addrs[0].address);
      expect(balance).to.equal(0);
    });
  });

  describe("Contract Balance", function () {
    it("Should hold all deposited funds", async function () {
      const amount1 = ethers.parseEther("1.0");
      const amount2 = ethers.parseEther("2.0");

      await vault.connect(user1).deposit({ value: amount1 });
      await vault.connect(user2).deposit({ value: amount2 });

      const contractBalance = await ethers.provider.getBalance(await vault.getAddress());
      expect(contractBalance).to.equal(amount1 + amount2);
    });

    it("Should reduce contract balance after withdrawal", async function () {
      const depositAmount = ethers.parseEther("3.0");
      const withdrawAmount = ethers.parseEther("1.0");

      await vault.connect(user1).deposit({ value: depositAmount });
      await vault.connect(user1).withdraw(withdrawAmount);

      const contractBalance = await ethers.provider.getBalance(await vault.getAddress());
      expect(contractBalance).to.equal(ethers.parseEther("2.0"));
    });
  });

  describe("Ownership", function () {
    it("Should set correct owner on deployment", async function () {
      const vaultOwner = await vault.owner();
      expect(vaultOwner).to.equal(owner.address);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle very small amounts", async function () {
      const tinyAmount = 1; // 1 wei

      await vault.connect(user1).deposit({ value: tinyAmount });
      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(tinyAmount);

      await vault.connect(user1).withdraw(tinyAmount);
      const balanceAfter = await vault.balances(user1.address);
      expect(balanceAfter).to.equal(0);
    });

    it("Should handle large amounts", async function () {
      const largeAmount = ethers.parseEther("1000");

      await vault.connect(user1).deposit({ value: largeAmount });
      const balance = await vault.balances(user1.address);
      expect(balance).to.equal(largeAmount);
    });
  });
});
