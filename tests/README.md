# Homomorph Test Suite

Comprehensive unit tests for the Homomorph privacy-preserving computation marketplace smart contracts.

## Test Coverage

### JobManager Tests (`JobManager.test.js`)
Tests for the core job lifecycle management contract:

- **Provider Staking**
  - Stake ETH to become eligible provider
  - Minimum stake requirements
  - Unstaking with balance checks
  - Initial reputation assignment

- **Job Posting**
  - Consumer posts encrypted computation jobs
  - Escrow requirement validation
  - Deadline validation
  - Job commitment tracking

- **Job Acceptance**
  - Staked providers accept jobs
  - Stake threshold verification
  - Reputation checks for experienced providers

- **Result Submission**
  - Provider submits encrypted results
  - Authorization checks
  - Deadline enforcement

- **Job Settlement**
  - Consumer settles after dispute period
  - Owner immediate settlement capability
  - Payment distribution
  - Reputation updates

- **Job Cancellation**
  - Consumer cancels unaccepted jobs
  - Refund mechanisms

- **Expired Job Handling**
  - Automatic refunds for expired jobs
  - Provider stake slashing for non-delivery
  - Reputation penalties

- **Dispute Mechanisms**
  - Consumer dispute initiation
  - Dispute period enforcement
  - Status transitions

- **Provider Information**
  - Query provider stake, reputation, and completed jobs

### MarketRegistry Tests (`MarketRegistry.test.js`)
Tests for the provider registry and discovery system:

- **Provider Registration**
  - New provider registration
  - Metadata URI storage
  - Base pricing configuration
  - Duplicate registration prevention

- **Provider Updates**
  - Update metadata and pricing
  - Activation/deactivation controls
  - Authorization checks

- **Provider Discovery**
  - Query all registered providers
  - Individual provider lookup
  - Active/inactive filtering

- **Multi-Provider Operations**
  - Multiple providers with varying prices
  - Provider list management

### Vault Tests (`Vault.test.js`)
Tests for the escrow vault contract:

- **Deposits**
  - Accept ETH deposits
  - Zero-value rejection
  - Multiple deposit accumulation
  - Separate user balances

- **Withdrawals**
  - Partial withdrawals
  - Full withdrawals
  - Insufficient balance checks
  - Multiple withdrawal sequences

- **Balance Tracking**
  - Accurate balance updates
  - Per-user accounting

- **Contract Balance**
  - Total funds custody
  - Balance consistency checks

- **Edge Cases**
  - Tiny amount handling (1 wei)
  - Large amount handling (1000 ETH)

## Running Tests

### Prerequisites
```bash
cd contracts
npm install
```

### Run All Tests
```bash
npx hardhat test ../tests/*.test.js
```

### Run Specific Test Suite
```bash
# JobManager tests only
npx hardhat test ../tests/JobManager.test.js

# MarketRegistry tests only
npx hardhat test ../tests/MarketRegistry.test.js

# Vault tests only
npx hardhat test ../tests/Vault.test.js
```

### Run with Gas Reporting
```bash
REPORT_GAS=true npx hardhat test ../tests/*.test.js
```

### Run with Coverage
```bash
npx hardhat coverage --testfiles "../tests/*.test.js"
```

## Test Structure

Each test suite follows this structure:

1. **Setup (`beforeEach`)**: Deploy fresh contract instances
2. **Test Cases**: Organized by functional area
3. **Assertions**: Comprehensive event and state checks
4. **Edge Cases**: Boundary conditions and error scenarios

## Key Testing Patterns

### Event Verification
```javascript
await expect(contract.method())
  .to.emit(contract, "EventName")
  .withArgs(arg1, arg2);
```

### State Checks
```javascript
const state = await contract.getState();
expect(state).to.equal(expectedValue);
```

### Revert Testing
```javascript
await expect(
  contract.invalidMethod()
).to.be.revertedWith("Error message");
```

### Time Manipulation
```javascript
await ethers.provider.send("evm_increaseTime", [86400]); // 1 day
await ethers.provider.send("evm_mine");
```

## Security Testing Focus

- ✅ Reentrancy protection validation
- ✅ Access control enforcement
- ✅ Stake requirement verification
- ✅ Deadline and timeout handling
- ✅ Balance integrity checks
- ✅ Event emission verification
- ✅ Edge case coverage

## Test Network Configuration

Tests run on Hardhat's local Ethereum network with:
- Automatic mining
- Deterministic addresses
- Fast execution
- Full EVM debugging

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
- name: Run Smart Contract Tests
  run: |
    cd contracts
    npm install
    npx hardhat test ../tests/*.test.js
```

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure all existing tests pass
3. Add edge case coverage
4. Document new test scenarios in this README

## Test Results

All tests should pass with 100% success rate:
```
  JobManager Contract Tests
    ✓ Provider Staking (15 test cases)
    ✓ Job Lifecycle (12 test cases)
    ✓ Security Features (8 test cases)

  MarketRegistry Contract Tests
    ✓ Registration & Updates (10 test cases)
    ✓ Provider Discovery (5 test cases)

  Vault Contract Tests
    ✓ Deposit & Withdrawal (12 test cases)
    ✓ Edge Cases (4 test cases)

  66 passing
```

## License

MIT License - See LICENSE file for details
