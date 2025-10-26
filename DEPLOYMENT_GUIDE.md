# FHE Computation Market - Deployment Guide

## 📋 Prerequisites

- Node.js 18+
- MetaMask or OKX Wallet
- Sepolia testnet ETH (at least 0.5 ETH for deployment)
- Git

## 🔧 Step 1: Configure Environment Variables

### Contracts (.env)

Create `contracts/.env` file:

```bash
cd contracts
cp .env.example .env
```

Edit `.env` with your values:

```env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
DEPLOYER_PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

**⚠️ Important**: Never commit your `.env` file!

### Get Sepolia ETH

1. Visit https://sepoliafaucet.com/
2. Enter your wallet address
3. Request testnet ETH

## 🚀 Step 2: Compile Contracts

```bash
cd contracts
npm install
npm run compile
```

Expected output:
```
Compiled 5 Solidity files successfully
```

## 📦 Step 3: Deploy Contracts

```bash
cd contracts
SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com" \
npx hardhat run scripts/deploy.js --network sepolia
```

This will deploy all 5 contracts:
- FHEBridge
- Vault
- JobManager
- MarketRegistry
- Slashing

Deployment will create two files:
- `contracts/deployments.json` - Full deployment info
- `frontend/src/lib/contracts.json` - Contract addresses for frontend

## 🎨 Step 4: Configure Frontend

The deployment script automatically updates `frontend/src/lib/contracts.json`.

Create `frontend/.env.local`:

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Contract addresses (auto-filled from deployment)
VITE_FHE_BRIDGE_ADDRESS=<from_deployment>
VITE_VAULT_ADDRESS=<from_deployment>
VITE_JOB_MANAGER_ADDRESS=<from_deployment>
VITE_MARKET_REGISTRY_ADDRESS=<from_deployment>
VITE_SLASHING_ADDRESS=<from_deployment>

# Network
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com

# Gateway
VITE_GATEWAY_URL=https://gateway.sepolia.zama.ai
```

## 🏃 Step 5: Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit: http://localhost:5173

## ✅ Verification Checklist

- [ ] All 5 contracts deployed successfully
- [ ] deployments.json created with all addresses
- [ ] Frontend contracts.json updated
- [ ] Frontend .env.local configured
- [ ] Frontend running on localhost:5173
- [ ] Wallet connects to Sepolia network
- [ ] Can interact with marketplace

## 🔍 Verify Contracts on Etherscan (Optional)

After deployment, verify contracts:

```bash
cd contracts

# FHEBridge
npx hardhat verify --network sepolia <FHEBridge_ADDRESS>

# Vault
npx hardhat verify --network sepolia <Vault_ADDRESS>

# JobManager
npx hardhat verify --network sepolia <JobManager_ADDRESS>

# MarketRegistry
npx hardhat verify --network sepolia <MarketRegistry_ADDRESS>

# Slashing
npx hardhat verify --network sepolia <Slashing_ADDRESS>
```

## 🐛 Troubleshooting

### Issue: "Insufficient funds for gas"

**Solution**: Get more Sepolia ETH from faucet

### Issue: "Nonce too high"

**Solution**: Reset account in MetaMask: Settings > Advanced > Reset Account

### Issue: "Contract already deployed"

**Solution**: Change deployer address or redeploy to different network

### Issue: "FHE SDK not loaded"

**Solution**: Check index.html includes relayerSDK script:
```html
<script src="https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs"></script>
```

### Issue: "Provider not found"

**Solution**: Ensure wallet extension installed and connected to Sepolia

## 📊 Deployment Costs (Approximate)

| Contract | Gas Used | Cost (50 gwei) |
|----------|----------|----------------|
| FHEBridge | ~2,500,000 | 0.125 ETH |
| Vault | ~1,000,000 | 0.05 ETH |
| JobManager | ~1,500,000 | 0.075 ETH |
| MarketRegistry | ~1,200,000 | 0.06 ETH |
| Slashing | ~800,000 | 0.04 ETH |
| **Total** | ~7,000,000 | **~0.35 ETH** |

## 🔗 Useful Links

- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Sepolia Explorer](https://sepolia.etherscan.io/)
- [Zama Documentation](https://docs.zama.ai/)
- [Hardhat Documentation](https://hardhat.org/docs)

## 📝 Next Steps

After successful deployment:

1. Test contract interactions on frontend
2. Create test jobs and providers
3. Test encrypted computation flow
4. Monitor gas costs and optimize
5. Consider mainnet deployment

## 🛡️ Security Notes

- Never share your private key
- Use hardware wallet for mainnet
- Audit contracts before production
- Monitor for unusual activity
- Keep dependencies updated

---

**Need help?** Check the project README or open an issue on GitHub.
