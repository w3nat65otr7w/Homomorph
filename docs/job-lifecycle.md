# Job Lifecycle

1. Post Job
- Consumer encrypts input and computes `inputCommitment`
- Calls `JobManager.postJob(inputCommitment)` with escrow `msg.value`

2. Accept Job
- Provider calls `JobManager.acceptJob(jobId)`

3. Compute Off-chain
- Provider runs FHE compute off-chain, using encrypted inputs and producing encrypted outputs

4. Submit Result
- Provider calls `JobManager.submitResult(jobId, resultCommitment)`

5. Settle
- Consumer verifies off-chain. If valid, calls `JobManager.settle(jobId)` to release escrow

6. Cancel
- If unaccepted, consumer may call `cancel(jobId)` to reclaim escrow

