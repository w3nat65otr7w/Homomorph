# Runbook: Payout Operations

## Purpose
Ensure providers are paid correctly after result submission and consumer verification.

## Steps
1. Monitor `ResultSubmitted(jobId, resultCommitment)` events
2. Confirm off-chain verification by consumer
3. Call `settle(jobId)` from consumer or privileged ops tool
4. Validate provider received funds

## Failure Modes
- Insufficient escrow: check `escrow[jobId]`
- Wrong status: ensure `ResultSubmitted` before `settle`

