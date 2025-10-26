# Economics

## Pricing
- Providers set `basePriceWei` in `MarketRegistry`
- Jobs escrow `priceWei` on `postJob`

## Settlement
- On `settle(jobId)`, escrow is released to provider
- Disputes/appeals are out of scope for MVP (future: arbitration, slashing hooks)

## Fees
- Protocol fee (future): percentage of job price
- Slashing (future): penalize misbehavior and redirect to treasury

