# Blockscout Compatibility Test

This project demonstrates the compatibility of Blockscout for Cosmos-SDK chain that integrates cosmos/evm.

## Setting Up BlockScout

### 1. Clone the BlockScout repository:

```bash
git clone https://github.com/blockscout/blockscout -b v8.0.1
```

### 2. Config Settings

- set genesis.json for the precompiled contracts

    ```bash
    cp /path/to/basechain/precompiled_genesis.json /path/to/blockscout/docker-compose/services/genesis.json
    ```

    > If the bytecode required for verification is not visible in Blockscout, you need to send a transaction to the contract to register it before verifying the smart contract.

- mount services/genesis.json to backend container

    ```bash
    cd /path/to/blockscout 
    vi services/backend.yml
    
    # add the following line to volumes
    volumes:
        (...)
        - ./genesis.json:/genesis.json
    ```

- set `CHAIN_ID` and `CHAIN_SPEC_PATH` at `docker-compose/envs/common-blockscout.env` before running docker-compose

    ```bash
    CHAIN_ID=262144
    CHAIN_SPEC_PATH=/genesis.json
    ```

- set the following values at `docker-compose/envs/common-frontend.env`

    ```bash
    NEXT_PUBLIC_NETWORK_ID=262144
    NEXT_PUBLIC_NETWORK_CURRENCY_NAME=Atom
    NEXT_PUBLIC_NETWORK_CURRENCY_SYMBOL=ATOM
    ```

- set `MICROSERVICE_SC_VERIFIER_URL` and `MICROSERVICE_SC_VERIFIER_TYPE` at `docker-compose/envs/common-blockscout.env`

    ```bash
    MICROSERVICE_SC_VERIFIER_URL=http://smart-contract-verifier:8050/
    MICROSERVICE_SC_VERIFIER_TYPE=sc_verifier
    # MICROSERVICE_SC_VERIFIER_TYPE=eth_bytecode_db `
    ```

- add the following code to the `geth.yml` file for running the smart-contract-verifier microservice

    ```yml
    sc-verifier:
        extends:
        file: ./services/smart-contract-verifier.yml
        service: smart-contract-verifier
        ports:
        - 8082:8050      
    ```

- add following environment variables to the [blockscout/docker-compose/services/stats.yml](https://github.com/blockscout/blockscout/blob/c219727585a6054f3792e31747e2d7aba738c345/docker-compose/services/stats.yml#L37-L51) to enable `/stats` page.

    ```yml
    stats:
        environment:
            - STATS__IGNORE_BLOCKSCOUT_API_ABSENCE=${STATS__IGNORE_BLOCKSCOUT_API_ABSENCE:-true}
    ```

- To mitigate the issue where Blockscout sends excessive and repeated eth_getBlockByNumber requests for block height 0, add the following environment variable to the [common-blockscout.env](https://github.com/blockscout/blockscout/blob/c219727585a6054f3792e31747e2d7aba738c345/docker-compose/envs/common-blockscout.env#L185-L187) file.
This behavior stems from a discrepancy in genesis block heights: Ethereum defines the genesis block at height 0, whereas blockchains based on CometBFT start from height 1. As a result, Blockscout continuously queries for a non-existent block 0.
The issue is further exacerbated because Blockscout shortens its retry interval by half after each failed query, leading to increasingly frequent requests. To address this, the request interval should be fixed to prevent aggressive backoff behavior.

    ```yml
    INDEXER_CATCHUP_BLOCKS_BATCH_SIZE=
    INDEXER_CATCHUP_BLOCKS_CONCURRENCY=
    INDEXER_CATCHUP_BLOCK_INTERVAL=
    ```

    - INDEXER_CATCHUP_BLOCKS_BATCH_SIZE: The number of blocks queried in a single request.
    - INDEXER_CATCHUP_BLOCKS_CONCURRENCY: The number of requests sent concurrently.
    - INDEXER_CATCHUP_BLOCK_INTERVAL: The time interval between consecutive requests.

    > We attempted to resolve the issue by modifying initial_height to 0 in the genesis.json file and by configuring Blockscout to start querying from block 1. However, neither approach fully addressed the problem.
    For now, setting the environment variables mentioned above serves as a temporary workaround. This configuration may be revised in the future once a more robust solution is identified.

### 3. Start BlockScout

```bash
cd docker-compose
docker-compose -f geth.yml up -d
```

### 4. Access BlockScout

- Please wait about 5 minutes for the BlockScout to be ready. Blockscout should read genesis.json for knowing the precompiled contracts.
- Access the BlockScout interface at `http://127.0.0.1` in your browser.
- You can now explore the blocks, transactions, and other details of your local testnet.

### 5. Contract Verification

#### Foundry

```bash
forge verify-contract \
  --rpc-url http://localhost/api/eth-rpc \                                
  --verifier blockscout \
  --verifier-url 'http://localhost/api/' \
  <CONTRACT_ADDRESS> \
  ./src/SimpleERC20.sol:SimpleERC20
```

#### Hardhat

```bash
npx hardhat verify \
  --network localhost \
  <CONTRACT_ADDRESS>
```
