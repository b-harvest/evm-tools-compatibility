# Issue Report

## Issues

### 1. `cast call` command use geth version >= 1.13.x

When querying the state values of an ERC20 contract using `cast call`, an error is displayed stating that opcode `0x5e` is undefined when calling the `name()` or `symbol()` methods that use data locacion specifier is `memory`.

It seems that `cast call` command uses `MCOPY` opcode ([`0x5e`](https://www.ethervm.io/#5E)).

![fail](./assets/read-state_cast-call.png)

When use `.s.sol` script with `forge script`, it works well.

![pass](./assets/read-state_forge-script.png)

## Test Cases

### Checked

- Deploy an ERC-20 Contract  
  - [x] ✅ Deploy a minimal ERC-20 contract (e.g., using OpenZeppelin’s ERC20 as a reference).  
  - [x] ✅ Ensure the deployment targets the custom chain via RPC (e.g., `forge create --rpc-url <CUSTOM_RPC> ...`).  
  - [x] ✅ Confirm the transaction hash, block number, and contract address.  

- Read State via Foundry  
  - [x] ❌ Use `test call` (or an equivalent command) to read a function such as `totalSupply()`, `balanceOf(<address>)`, or `symbol()` from the deployed ERC-20 contract.  
  - [x] ✅ Use `forge script` (or an equivalent command) to read a function such as `totalSupply()`, `balanceOf(<address>)`, or `symbol()` from the deployed ERC-20 contract.  
  - [x] ✅ Verify that correct data (balances, token name/symbol, etc.) is returned from the node.  
  - [x] ✅ Check chain ID or network metadata if available, to confirm you are indeed connected to the correct chain.  

- Write State via Foundry  
  - [x] ✅ Perform a token transfer using a Foundry command (e.g., using `forge script` or `cast send`) that calls `transfer(<to>, <amount>)`.  
  - [x] ✅ Confirm the transaction is successfully mined on the custom chain (check the transaction hash and block explorer).  
  - [x] ✅ Re-check balances (e.g., `balanceOf`) to ensure the transfer actually took place on-chain.  

- Error Handling & Edge Cases  
  - [x] ✅ Attempt a transfer that exceeds the sender’s balance (to confirm error behavior).  
  - [x] ✅ Validate that the node returns a revert or appropriate error message.  
  - [x] ✅ Document any unexpected RPC or node errors (time-outs, mismatched chain ID, etc.).

### Unchecked

- Gas Estimation Verification  
  - [ ] Use `forge estimate-gas` to fetch the estimated gas for each transaction and compare it against the actual gas used.  

- Block Number Zero Handling  
  - [ ] Call `eth_getBlockByNumber("0x0", true)` and verify whether the node returns an error, `null`, or a valid block.  

- Nonce Management & Collision Test  
  - [ ] Send multiple transactions in quick succession (without `--slow`) to ensure nonces are handled correctly and no collisions occur.  

- EIP-1559 vs. Legacy Transaction Type Compatibility  
  - [ ] Test both legacy and dynamic-fee (`type=0x2`) transactions to confirm the chain and Foundry support both formats.  

- Revert Reason & Trace Accuracy  
  - [ ] Trigger a revert inside a contract call and verify that Foundry surfaces the correct revert reason and call trace.  

- Event Log Filtering & Verification  
  - [ ] After running a script, use `forge logs` or `eth_getLogs` to ensure that events are correctly emitted and retrievable.  

- RPC Timeout & Retry Behavior  
  - [ ] Configure a short `--rpc-timeout` and observe how Foundry handles time-outs and whether it retries or fails gracefully.  

- Chain ID Auto-Detection  
  - [ ] Omit any manual `chain-id` configuration and verify that Foundry correctly detects and uses the chain ID from the node.  

- Contract Block Data Usage  
  - [ ] Deploy and call a contract that reads `block.number` and `block.timestamp`, ensuring values are populated accurately (given CometBFT’s genesis at block 1).  

- Static Call vs. Transaction Consistency  
  - [ ] Compare results between `cast call` (static) and `cast send` (transaction) for the same read-only function to confirm consistency.

## Proof of Test

### Network Info

`cast call`

![network info](./assets/network-info_cast.png)

`forge script`

![network info](./assets/network-info_forge.png)

### Deploy an ERC-20 Contract  

`forge script`

![deploy](./assets/deploy-erc20_forge.png)

### Read State

`cast call`

![read state](./assets/read-state_cast-call.png)

`forge script`

![read state](./assets/read-state_forge-script.png)

### Write State

`cast send`

![write state](./assets/transfer_cast.png)

`forge script`

![write state](./assets/transfer_forge.png)

### Transfer Revert

`cast send`

![transfer-revert](./assets/transfer-revert_cast-send.png)

`forge script`

![transfer-revert](./assets/transfer-revert_forge-script.png)
