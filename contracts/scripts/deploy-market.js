const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const MarketRegistry = await ethers.getContractFactory("MarketRegistry");
  const registry = await MarketRegistry.deploy();
  await registry.waitForDeployment();
  console.log("MarketRegistry:", await registry.getAddress());

  const JobManager = await ethers.getContractFactory("JobManager");
  const jobs = await JobManager.deploy();
  await jobs.waitForDeployment();
  console.log("JobManager:", await jobs.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


