const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MarketRegistry Contract Tests", function () {
  let MarketRegistry;
  let marketRegistry;
  let owner;
  let provider1;
  let provider2;
  let addrs;

  beforeEach(async function () {
    [owner, provider1, provider2, ...addrs] = await ethers.getSigners();

    MarketRegistry = await ethers.getContractFactory("MarketRegistry");
    marketRegistry = await MarketRegistry.deploy();
    await marketRegistry.waitForDeployment();
  });

  describe("Provider Registration", function () {
    it("Should allow new provider registration", async function () {
      const metadataURI = "ipfs://QmTest123";
      const basePrice = ethers.parseEther("0.1");

      await expect(
        marketRegistry.connect(provider1).registerProvider(metadataURI, basePrice)
      )
        .to.emit(marketRegistry, "ProviderRegistered")
        .withArgs(provider1.address, metadataURI, basePrice);

      const provider = await marketRegistry.providers(provider1.address);
      expect(provider.account).to.equal(provider1.address);
      expect(provider.metadataURI).to.equal(metadataURI);
      expect(provider.basePriceWei).to.equal(basePrice);
      expect(provider.active).to.equal(true);
    });

    it("Should reject duplicate registration", async function () {
      const metadataURI = "ipfs://QmTest123";
      const basePrice = ethers.parseEther("0.1");

      await marketRegistry.connect(provider1).registerProvider(metadataURI, basePrice);

      await expect(
        marketRegistry.connect(provider1).registerProvider(metadataURI, basePrice)
      ).to.be.revertedWith("Already registered");
    });

    it("Should add provider to provider list", async function () {
      const metadataURI1 = "ipfs://QmProvider1";
      const metadataURI2 = "ipfs://QmProvider2";
      const basePrice = ethers.parseEther("0.1");

      await marketRegistry.connect(provider1).registerProvider(metadataURI1, basePrice);
      await marketRegistry.connect(provider2).registerProvider(metadataURI2, basePrice);

      const provider1Address = await marketRegistry.providerList(0);
      const provider2Address = await marketRegistry.providerList(1);

      expect(provider1Address).to.equal(provider1.address);
      expect(provider2Address).to.equal(provider2.address);
    });
  });

  describe("Provider Update", function () {
    beforeEach(async function () {
      const metadataURI = "ipfs://QmInitial";
      const basePrice = ethers.parseEther("0.1");
      await marketRegistry.connect(provider1).registerProvider(metadataURI, basePrice);
    });

    it("Should allow provider to update their information", async function () {
      const newMetadataURI = "ipfs://QmUpdated";
      const newBasePrice = ethers.parseEther("0.2");
      const active = true;

      await expect(
        marketRegistry.connect(provider1).updateProvider(newMetadataURI, newBasePrice, active)
      )
        .to.emit(marketRegistry, "ProviderUpdated")
        .withArgs(provider1.address, newMetadataURI, newBasePrice, active);

      const provider = await marketRegistry.providers(provider1.address);
      expect(provider.metadataURI).to.equal(newMetadataURI);
      expect(provider.basePriceWei).to.equal(newBasePrice);
      expect(provider.active).to.equal(active);
    });

    it("Should allow provider to deactivate", async function () {
      const metadataURI = "ipfs://QmSame";
      const basePrice = ethers.parseEther("0.1");
      const active = false;

      await marketRegistry.connect(provider1).updateProvider(metadataURI, basePrice, active);

      const provider = await marketRegistry.providers(provider1.address);
      expect(provider.active).to.equal(false);
    });

    it("Should reject update from unregistered provider", async function () {
      const metadataURI = "ipfs://QmTest";
      const basePrice = ethers.parseEther("0.1");

      await expect(
        marketRegistry.connect(provider2).updateProvider(metadataURI, basePrice, true)
      ).to.be.revertedWith("Not registered");
    });
  });

  describe("Get Providers", function () {
    it("Should return empty list initially", async function () {
      const providers = await marketRegistry.getProviders();
      expect(providers.length).to.equal(0);
    });

    it("Should return all registered providers", async function () {
      const metadata1 = "ipfs://QmProvider1";
      const metadata2 = "ipfs://QmProvider2";
      const basePrice = ethers.parseEther("0.1");

      await marketRegistry.connect(provider1).registerProvider(metadata1, basePrice);
      await marketRegistry.connect(provider2).registerProvider(metadata2, basePrice);

      const providers = await marketRegistry.getProviders();
      expect(providers.length).to.equal(2);

      expect(providers[0].account).to.equal(provider1.address);
      expect(providers[0].metadataURI).to.equal(metadata1);
      expect(providers[0].active).to.equal(true);

      expect(providers[1].account).to.equal(provider2.address);
      expect(providers[1].metadataURI).to.equal(metadata2);
      expect(providers[1].active).to.equal(true);
    });

    it("Should include deactivated providers in list", async function () {
      const metadata = "ipfs://QmProvider";
      const basePrice = ethers.parseEther("0.1");

      await marketRegistry.connect(provider1).registerProvider(metadata, basePrice);
      await marketRegistry.connect(provider1).updateProvider(metadata, basePrice, false);

      const providers = await marketRegistry.getProviders();
      expect(providers.length).to.equal(1);
      expect(providers[0].active).to.equal(false);
    });
  });

  describe("Provider Query", function () {
    it("Should retrieve specific provider details", async function () {
      const metadataURI = "ipfs://QmProviderDetails";
      const basePrice = ethers.parseEther("0.15");

      await marketRegistry.connect(provider1).registerProvider(metadataURI, basePrice);

      const provider = await marketRegistry.providers(provider1.address);
      expect(provider.account).to.equal(provider1.address);
      expect(provider.metadataURI).to.equal(metadataURI);
      expect(provider.basePriceWei).to.equal(basePrice);
      expect(provider.active).to.equal(true);
    });

    it("Should return zero address for unregistered provider", async function () {
      const provider = await marketRegistry.providers(addrs[0].address);
      expect(provider.account).to.equal(ethers.ZeroAddress);
    });
  });

  describe("Multiple Provider Operations", function () {
    it("Should handle multiple providers with different prices", async function () {
      const providers = [
        { signer: provider1, metadata: "ipfs://Qm1", price: ethers.parseEther("0.05") },
        { signer: provider2, metadata: "ipfs://Qm2", price: ethers.parseEther("0.10") },
        { signer: addrs[0], metadata: "ipfs://Qm3", price: ethers.parseEther("0.15") },
      ];

      for (const p of providers) {
        await marketRegistry.connect(p.signer).registerProvider(p.metadata, p.price);
      }

      const allProviders = await marketRegistry.getProviders();
      expect(allProviders.length).to.equal(3);

      expect(allProviders[0].basePriceWei).to.equal(ethers.parseEther("0.05"));
      expect(allProviders[1].basePriceWei).to.equal(ethers.parseEther("0.10"));
      expect(allProviders[2].basePriceWei).to.equal(ethers.parseEther("0.15"));
    });
  });

  describe("Ownership", function () {
    it("Should set correct owner on deployment", async function () {
      const contractOwner = await marketRegistry.owner();
      expect(contractOwner).to.equal(owner.address);
    });
  });
});
