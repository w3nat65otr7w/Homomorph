# Protocol Overview (FHE Computation Market)

This document outlines the high-level flow for an encrypted job lifecycle.

1. Consumer encrypts input off-chain (via Zama SDK) and posts a job with an input commitment and escrow.
2. Providers register capability and pricing in `MarketRegistry`.
3. A provider accepts the job in `JobManager`.
4. Off-chain coprocessors perform FHE compute; provider submits `resultCommitment`.
5. Consumer verifies and settles, releasing escrow to provider.

## Components
- MarketRegistry: provider onboarding, pricing
- JobManager: job lifecycle and escrow
- FHEBridge: handling external encrypted inputs (future ACL and ops)
- Slashing: penalization (future policy)
- Vault: optional custody

