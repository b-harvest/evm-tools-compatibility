# Issue Report

## Issues

### 1. The number of ERC20 token holders and transfers is not correctly displayed

![erc20_holders](./assets/erc20_holders.png)

![erc20_transfers](./assets/erc20_transfers.png)

## Test Cases

### Checked

- [x] After starting the Blockscout instances, are there any abnormal logs output from evmd when started with the `--log-level debug` option?
- [x] Search for a transaction hash and confirm correct details (From/To/Gas).
  - [x] ✅ Details
  - [x] ✅ Token transfers
  - [x] ✅ Internal txs
  - [x] ✅ Logs
  - [x] ✅ State
  - [x] ✅ Raw trace
- [x] Look up the ERC-20 contract address to see token info and holders.
  - [x] ✅ Are the token metdata is displayed corectly?
    - [x] ✅ Name
    - [x] ✅ Symbol
    - [x] Decimals
  - [x] Are the token state is displayed correctly?
    - [x] ⚠️ Holders
    - [x] ⚠️ Transfers
- [x] Verify contract source code via **Verify & Publish** process.
  - [x] Foundry
  - [x] Hardhat
- [x] Charts and Stats

## Proof of Test

### Transaction Details

![tx_details](./assets/tx_details.png)

### Contract Verification

Verified contrdacts

![verified_contracts](./assets/verified_contracts.png)

Verify contract with foundry

![verify_foundry](./assets/verify_foundry.png)

Verify contract with hardhat

![verify_hardhat](./assets/verify_hardhat.png)

### Charts and Stats

![charts_and_stats](./assets/charts_and_stats.png)