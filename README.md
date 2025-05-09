# EVM Chain Compatibility & Tooling Validation

## 1. Overview

- **Goal**
  
    Verify that a custom EVM chain works seamlessly with commonly used developer tools (Foundry, Hardhat, etc.), wallets (Metamask, etc.), block explorers (Blockscout, etc.), and SDKs (ethers.js, viem, web3.js).

- **Timeframe**
  
    Approximately **1 week** of focused testing.

- **Approach**

  - This GitHub Issue contains all tasks in the form of checklists.
  - We will prioritize tasks by **P0 (highest priority), P1,** and **P2**.
  - Progress and findings will be updated here daily.

---

## 2. Task Breakdown

Below are the tasks grouped by **priority**. Each task has its own checklist.

- **P0** (highest priority): Core tooling (Foundry, Hardhat, block explorer integration, SDK)
- **P1** (important): Wallet usage and DApp integration
- **P2** (lower priority): Security tools, advanced debugging, and extended explorer features

### 2.1 P0: Critical Tests (Foundry, Hardhat, Explorer, SDK)

1. **Foundry Usage(https://github.com/b-harvest/evm-tools-compatibility/tree/main/foundry)**

    1. **Deploy Contracts**

        **ERC-20 Contract**

        1. [x] **Deploy** a minimal ERC-20 contract (e.g., using [OpenZeppelin’s ERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol) as a reference).
        2. [x] Ensure the deployment **targets the custom chain** via RPC (e.g., `forge create --rpc-url <CUSTOM_RPC> ...`).
        3. [x] **Confirm** the transaction hash, block number, and contract address.

        **Uniswap**

        - [x] Deploy Uniswap V3 contracts

    2. **Read State via Foundry**
        - [x] Use `test call` (or an equivalent command) to read a function such as `totalSupply()`, `balanceOf(<address>)`, or `symbol()` from the deployed ERC-20 contract.  
        - [x] Use `forge script` (or an equivalent command) to read a function such as `totalSupply()`, `balanceOf(<address>)`, or `symbol()` from the deployed ERC-20 contract.  
        - [x] Verify that correct data (balances, token name/symbol, etc.) is returned from the node.  
        - [x] Check chain ID or network metadata if available, to confirm you are indeed connected to the correct chain.  

    3. **Write State via Foundry**
        - [x]  Perform a **token transfer** using a Foundry command (e.g., using `forge script` or `cast send`) that calls `transfer(<to>, <amount>)`.
        - [x]  **Confirm** the transaction is successfully mined on the custom chain (check the transaction hash and block explorer).
        - [x]  **Re-check** balances (e.g., `balanceOf`) to ensure the transfer actually took place on-chain.

    4. **Error Handling & Edge Cases**
        - [x]  Attempt a transfer that exceeds the sender’s balance (to confirm error behavior).
        - [x]  Validate that the node returns a **revert** or appropriate error message.
        - [x]  Document any unexpected RPC or node errors (time-outs, mismatched chain ID, etc.).

    5. **Cast Run(= Runs a published transaction in a local environment and prints the trace.)**

        - [x] Perform and validate cast-run for a erc20 transfer transaction.
        - [x] Perform and validate cast-run for a erc20 deplpyment transaction.

2. **Hardhat Usage(https://github.com/b-harvest/evm-tools-compatibility/tree/main/hardhat/test)**

    1. **Deploy**

        **ERC-20 Contract**

        1. [x] Create a simple Hardhat **deployment script** (e.g., `scripts/deploy.js`), referencing an ERC-20 contract.
        2. [x] Configure `hardhat.config.js` with the **custom RPC** settings.
        3. [x] Run `npx hardhat run scripts/deploy.js --network <custom-network>` and confirm the contract is deployed (capture contract address & Tx hash).

        **Uniswap**

        - [x] Deploy Uniswap

    2. **Read State (contract calls)**

        - [x]  Using a Hardhat task or script, **call** the deployed ERC-20 contract’s read functions: `totalSupply()`, `symbol()`, `balanceOf(...)`.
        - [x]  Confirm you can fetch these values **directly from the chain**.
        - [x]  Log output to ensure the data matches expectations (e.g., if total supply is 1,000 tokens, check that the read is correct).

    3. **Write State (transactions)**

        - [x]  Execute a **token transfer** transaction, such as `await contract.transfer(recipient, amount)`.
        - [x]  Wait for the transaction to be mined, then **validate** new balances on-chain (re-check with `balanceOf`).
        - [x]  Optionally, confirm via a **console log** or a block explorer that the transaction succeeded.

    4. **Error Handling & Testing**
        - [x]  Write a basic Hardhat test or script that attempts to transfer more tokens than exist (e.g., over the sender’s balance).
        - [x]  Ensure Hardhat reports the **revert** properly.
        - [x]  Document any **RPC errors**, chain ID mismatches, or unusual gas cost issues.

3. **SDK Integration (ethers.js, viem, web3.js)**

    - **ethers.js(<https://github.com/b-harvest/evm-tools-compatibility/blob/main/hardhat/test/ethers_compatibility.test.js>)**

        - **Setup & Provider Configuration**
            - [x]  **Install** ethers (e.g., `npm install ethers`).
            - [x]  **Create** a provider:

                ```jsx
                const { ethers } = require("ethers");
                const provider = new ethers.JsonRpcProvider("<CUSTOM_RPC_URL>");
                ```

            - [x]  Check that `provider.getNetwork()` returns the **expected chain ID**.
        - **Read from Deployed ERC-20**
            - [x]  **Obtain** the contract address, ABI, and use `new ethers.Contract(...)` to instantiate it:

                ```jsx
                const erc20Contract = new ethers.Contract("<CONTRACT_ADDRESS>", ERC20_ABI, provider);
                ```

            - [x]  **Call** read-only functions:
                - `symbol()`
                - `totalSupply()`
                - `balanceOf("<YOUR_ADDRESS>")`
            - [x]  **Log** returned values and confirm they match expectations.
        - **Write (Transactions)**
            - [x]  **Create** a signer (wallet) to send transactions:

                ```jsx
                const wallet = new ethers.Wallet("<PRIVATE_KEY>", provider);
                const erc20WithSigner = erc20Contract.connect(wallet);
                ```

            - [x]  **Transfer** tokens:

                ```jsx
                const tx = await erc20WithSigner.transfer("<TO_ADDRESS>", ethers.parseUnits("10", 18));
                await tx.wait();
                ```

            - [x]  **Check** transaction hash, confirm it’s mined, and verify updated balances.
        - **Error Handling & Edge Cases**
            - [x]  Try to transfer more tokens than the wallet holds, confirm the transaction **reverts**.
            - [x]  Log any RPC or gas-related **errors**.
            - [x]  Confirm ethers properly surfaces revert messages (if any).
    - **viem Integration (https://github.com/b-harvest/evm-tools-compatibility/tree/main/sdk/viem)** 
        - **Setup & Client Configuration**
            - [x]  **Install** viem (e.g., `npm install viem`).
            - [x]  **Create** a viem client with your RPC URL:

                ```jsx
                import { createPublicClient, http } from 'viem';
                import { mainnet } from 'viem/chains';
                
                const client = createPublicClient({
                  chain: { ...mainnet, rpcUrls: { default: { http: ["<CUSTOM_RPC_URL>"] } } },
                  transport: http(),
                });
                ```

            - [ ]  Optionally, define a custom chain object if needed (different chain ID).
        - **Read from Deployed ERC-20**
            - [x]  **Set** the contract details (ABI + address).
            - [x]  **Call** read functions (e.g., `symbol`, `totalSupply`, `balanceOf`):

                ```jsx
                const symbol = await client.readContract({
                  address: '0x...',
                  abi: ERC20_ABI,
                  functionName: 'symbol',
                });
                ```
                
            - [x]  Verify the returned values match the actual on-chain data.

        - **Write (Transactions)**
            - [x]  **Create** a wallet or signer (e.g., using `createWalletClient`).
            - [x]  **Send** a token transfer transaction:

                ```jsx
                import { parseUnits } from 'viem';
                
                const txHash = await walletClient.writeContract({
                  address: '0x...',
                  abi: ERC20_ABI,
                  functionName: 'transfer',
                  args: ['<TO_ADDRESS>', parseUnits("10", 18)],
                });
                ```

            - [x]  **Wait** for the transaction to be confirmed, then verify new balances.
        - **Error Handling & Edge Cases**

            - [x]  Attempt an **over-balance** transfer to confirm revert behavior.
            - [x]  Check for any custom chain config issues (e.g., if the chain ID is not recognized by viem).
            - [x]  Document any RPC or transaction validation errors.
    - **web3.js Integration**
      
        1. **Setup & Web3 Provider**

            - [x]  **Install** web3 (e.g., `npm install web3`).
            - [x]  **Create** a Web3 instance:

                ```jsx
                const Web3 = require("web3");
                const web3 = new Web3("<CUSTOM_RPC_URL>");
                ```

            - [x]  Verify `web3.eth.net.getId()` or `web3.eth.getChainId()` matches your custom chain ID.
        2. **Read from Deployed ERC-20**
            - [x]  **Instantiate** contract object:

                ```jsx
                const contract = new web3.eth.Contract(ERC20_ABI, "<CONTRACT_ADDRESS>");
                ```

            - [x]  **Call** read functions:

                ```jsx
                const symbol = await contract.methods.symbol().call();
                const totalSupply = await contract.methods.totalSupply().call();
                const balance = await contract.methods.balanceOf("<ADDRESS>").call();
                ```

            - [x]  Verify the fetched data.
        3. **Write (Transactions)**
            - [x]  **Set** an account with private key:

                ```jsx
                web3.eth.accounts.wallet.add("<PRIVATE_KEY>");
                web3.eth.defaultAccount = "<WALLET_ADDRESS>";
                ```

            - [x]  **Send** a transfer transaction:

                ```jsx
                const receipt = await contract.methods
                  .transfer("<TO_ADDRESS>", "10000000000000000000") // 10 tokens with 18 decimals
                  .send({ from: "<WALLET_ADDRESS>", gas: 500000 });
                
                ```

            - [x]  Confirm the transaction receipt and updated balances.
        4. **Error Handling & Edge Cases**
            - [x]  Attempt a transfer that exceeds the account balance → confirm revert.
            - [x]  Check for network or RPC issues (e.g., if the node returns an error).
            - [x]  Log any unexpected or incorrectly formatted error messages.
    
4. **BlockExplorer Integration (Blockscout)**

    - [x] After starting the Blockscout instances, are there any abnormal logs output from evmd when started with the `--log-level debug` option?
    - [x] Search for a transaction hash and confirm correct details (From/To/Gas).
        - [x] Details
        - [x] Token transfers
        - [x] Internal txs
        - [x] Logs
        - [x] State
        - [x] Raw trace
    - [x] Look up the ERC-20 contract address to see token info and holders.
        - [x] Are the token metdata is displayed corectly?
            - [x] Name
            - [x] Symbol
            - [x] Decimals
    - [x] Are the token state is displayed correctly?
        - [x] Holders
        - [x] Transfers
    - [x] Verify contract source code via **Verify & Publish** process.
        - [x] Foundry
        - [x] Hardhat
    - [x] Charts and Stats

### 2.2 P1: Important Tests (Wallet & DApp Integration)

1. **Wallet Compatibility (Metamask, OKX, Rabby, Rainbow, Trust, Coinbase)(<https://github.com/b-harvest/evm-tools-compatibility/blob/main/wallets/README.md>)**
    - [x]  (A) Add the custom network (RPC URL, Chain ID, Symbol, Explorer URL).
    - [x]  (B) Transfer native coins between wallets and confirm on the explorer.
    - [x]  (C) Add and transfer a custom ERC-20 token. Confirm balance updates.
2. **WalletConnect(<https://github.com/b-harvest/evm-tools-compatibility/tree/main/wallets/metamask>)**
    - [x]  (A) Set up a test DApp locally that shows a WalletConnect QR code.
    - [x]  (B) Use a mobile wallet (e.g. Metamask) to scan and connect.
    - [x]  (C) Execute a test transaction (token transfer), sign it, and confirm success on-chain.

### 2.3 P2: Supplemental Tests (Security Scanning, Advanced Debug, Extended Explorer)

1. **Mythril (RPC-based Analysis) (https://github.com/b-harvest/evm-tools-compatibility/tree/main/mythril**)
    - [x]  **(A) Fetch On-Chain Contract**: Use `myth analyze --rpc <RPC_URL> -a <CONTRACT_ADDRESS>` to pull the deployed contract’s bytecode from the custom chain.
    - [x]  **(B) Inspect Report**: Confirm Mythril performs its symbolic analysis using the on-chain code, generating a report.
    - [x]  **(C) Check for RPC Errors**: Note any issues fetching data (e.g., chain ID mismatch, connection timeouts).
    - [x]  **(D) Validate Findings**: If Mythril flags potential vulnerabilities, verify these relate accurately to the on-chain code.
2. **Debug & Trace API** 
    - [x]  **(A) Ethereum Trace API**: Use a tracing tool (e.g., `debug_traceTransaction`) to examine internal calls, storage modifications, and deeper transaction details on the custom chain. (https://github.com/b-harvest/evm-tools-compatibility/tree/main/debug-apis)
    - [x]  **(B) Advanced Debugging Tools**:
        - **Tenderly**: Check if you can import transactions from the custom chain, replay or fork them.
        - **DethCode**: Confirm it can parse source code and possibly link to on-chain data for debugging.

### Note on Static Analysis Tools

We have **excluded Slither, Securify, and other purely static analysis tools** because they do **not** interact with the chain for real-time data or transactions. The primary purpose of this testing is to ensure that tools requiring **network connectivity** (RPC calls, transaction tracing, on-chain code fetching, etc.) are fully compatible with the custom EVM chain.
