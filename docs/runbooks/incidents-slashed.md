# Runbook: Incidents & Slashing

## Scenario
A provider behaves maliciously or violates SLA.

## Actions
1. Collect evidence (logs, commitments, timestamps)
2. Propose penalty via governance/off-chain process
3. Execute `Slashing.slash(provider, amount, reason)` if authorized
4. Communicate outcome to stakeholders

## Notes
- Slashing policy is TBD. This runbook will evolve with governance.

