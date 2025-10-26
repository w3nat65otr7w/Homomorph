# Homomorph - Frontend

> **Compute Without Revealing**

A privacy-preserving computation marketplace powered by Fully Homomorphic Encryption (FHE).

## Overview

This frontend application provides a user interface for:
- **Providers**: Register and offer computation resources
- **Consumers**: Submit encrypted computation jobs
- **Marketplace**: Browse providers and monitor network activity

## Tech Stack

- **React 18** + **TypeScript** - Modern UI framework
- **Vite** - Fast build tool with HMR
- **Shadcn/ui** + **Radix UI** - Accessible component library
- **Tailwind CSS** - Utility-first styling
- **Wagmi v2** + **RainbowKit** - Web3 wallet integration
- **Zama FHE SDK** - Fully Homomorphic Encryption

## Getting Started

### Prerequisites

- Node.js >= 18.x
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env.local` file:

```env
VITE_MARKET_REGISTRY_ADDRESS=0x...
VITE_JOB_MANAGER_ADDRESS=0x...
VITE_FHE_BRIDGE_ADDRESS=0x...
VITE_VAULT_ADDRESS=0x...
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn/ui components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
├── pages/              # Page components
│   ├── provider/       # Provider pages
│   ├── consumer/       # Consumer pages
│   └── market/         # Public marketplace
├── lib/                # Utilities
│   ├── fhe.ts         # FHE encryption utilities
│   └── contracts/     # Contract ABIs and addresses
├── hooks/              # Custom React hooks
└── config/             # Configuration files
```

## Features

### For Providers
- Register with stake and metadata
- Browse and accept available jobs
- Submit encrypted computation results
- Track reputation and earnings

### For Consumers
- Post computation jobs with encrypted data
- Monitor job status in real-time
- Retrieve and decrypt results
- Manage payment and escrow

### Marketplace
- View network statistics
- Browse provider directory
- Monitor real-time activity
- Filter by reputation and price

## FHE Integration

This application uses Zama's FHE technology to enable:
- Encrypted data submission
- Confidential computation
- Privacy-preserving results
- Zero-knowledge verification

All sensitive data remains encrypted throughout the computation lifecycle.

## Smart Contracts

The frontend interacts with four main contracts:
- **MarketRegistry**: Provider registration and discovery
- **JobManager**: Job lifecycle management
- **FHEBridge**: Encrypted data handling
- **Vault**: Payment escrow and settlement

## Development

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind utility classes
- Implement proper error handling

### Testing
```bash
npm run lint
```

## Deployment

Build and deploy the application:

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

Compatible with:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Project Repository]
- Documentation: See `/docs` folder
