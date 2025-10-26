# Homomorph

> **Compute Without Revealing**

## Overview
Homomorph is a privacy-preserving computation marketplace powered by Fully Homomorphic Encryption (FHE). It enables secure data processing, algorithm execution, and result delivery without exposing raw data or proprietary algorithms.

## Standardized App Structure

```
<app>/
├── contracts/              # Hardhat project (Solidity 0.8.28 + @fhevm/solidity)
│   ├── src/
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.*
│   └── package.json
├── frontend/               # Vite + React + wagmi + Tailwind
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── config/
│   │   └── types/
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── docs/
├── tests/
├── README.md
└── DEPLOYMENT_GUIDE.md
```

## Technology Stack
- Smart Contracts: Solidity 0.8.28 + `@fhevm/solidity`
- Frontend: React 18, wagmi (Injected Connector, Sepolia), TailwindCSS, Framer Motion
- Web3: Ethers v6, viem
- Tooling: Hardhat, Vite, TypeScript

## Quick Start
```bash
# Contracts
cd contracts && npm install && npm run compile

# Frontend
cd ../frontend && npm install && npm run dev
```

## Documentation
- [Architecture Overview](./docs/architecture.md)
- [Development Plan](./docs/development-plan.md)
- [API Specification](./docs/api-specification.md)