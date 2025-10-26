const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting FHE Computation Market deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "ETH\n");

  if (balance < ethers.parseEther("0.1")) {
    console.warn("⚠️  Warning: Low balance. You may need more ETH for deployment.\n");
  }

  // Deploy contracts
  const deployments = {};

  // 1. Deploy FHEBridge
  console.log("📦 Deploying FHEBridge...");
  const FHEBridge = await ethers.getContractFactory("FHEBridge");
  const fheBridge = await FHEBridge.deploy();
  await fheBridge.waitForDeployment();
  const fheBridgeAddress = await fheBridge.getAddress();
  deployments.FHEBridge = fheBridgeAddress;
  console.log("✅ FHEBridge deployed to:", fheBridgeAddress);

  // 2. Deploy Vault
  console.log("\n📦 Deploying Vault...");
  const Vault = await ethers.getContractFactory("Vault");
  const vault = await Vault.deploy();
  await vault.waitForDeployment();
  const vaultAddress = await vault.getAddress();
  deployments.Vault = vaultAddress;
  console.log("✅ Vault deployed to:", vaultAddress);

  // 3. Deploy MarketRegistry (needed for JobManager)
  console.log("\n📦 Deploying MarketRegistry...");
  const MarketRegistry = await ethers.getContractFactory("MarketRegistry");
  const marketRegistry = await MarketRegistry.deploy();
  await marketRegistry.waitForDeployment();
  const marketRegistryAddress = await marketRegistry.getAddress();
  deployments.MarketRegistry = marketRegistryAddress;
  console.log("✅ MarketRegistry deployed to:", marketRegistryAddress);

  // 4. Deploy JobManager (with MarketRegistry address)
  console.log("\n📦 Deploying JobManager...");
  const JobManager = await ethers.getContractFactory("JobManager");
  const jobManager = await JobManager.deploy(marketRegistryAddress);
  await jobManager.waitForDeployment();
  const jobManagerAddress = await jobManager.getAddress();
  deployments.JobManager = jobManagerAddress;
  console.log("✅ JobManager deployed to:", jobManagerAddress);

  // 5. Deploy Slashing
  console.log("\n📦 Deploying Slashing...");
  const Slashing = await ethers.getContractFactory("Slashing");
  const slashing = await Slashing.deploy();
  await slashing.waitForDeployment();
  const slashingAddress = await slashing.getAddress();
  deployments.Slashing = slashingAddress;
  console.log("✅ Slashing deployed to:", slashingAddress);

  // Save deployment addresses
  const deploymentsPath = path.join(__dirname, "../deployments.json");
  const deploymentData = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: deployments
  };

  fs.writeFileSync(deploymentsPath, JSON.stringify(deploymentData, null, 2));
  console.log("\n📄 Deployment addresses saved to:", deploymentsPath);

  // Save to frontend
  const frontendConfigPath = path.join(__dirname, "../../frontend/src/lib/contracts.json");
  try {
    fs.writeFileSync(frontendConfigPath, JSON.stringify(deployments, null, 2));
    console.log("📄 Frontend config updated:", frontendConfigPath);
  } catch (error) {
    console.warn("⚠️  Could not update frontend config:", error.message);
  }

  console.log("\n✨ Deployment completed successfully!\n");
  console.log("📋 Summary:");
  console.log("═══════════════════════════════════════");
  Object.entries(deployments).forEach(([name, address]) => {
    console.log(`${name.padEnd(20)} ${address}`);
  });
  console.log("═══════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
