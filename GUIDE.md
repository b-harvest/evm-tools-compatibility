# EVM Chain Testing Setup Guide
This guide walks you through the steps to run the custom EVM chain locally and use a pre-funded account for testing.
It ensures all developers/testers are using a consistent environment and can immediately begin testing with a rich account.


## :white_check_mark: Run evmd
```bash
git clone https://github.com/cosmos/evm
cd evm
./local_node.sh
```
This will start a local custom EVM chain node with several pre-funded accounts. It should only be used when you **want a clean slate** (i.e., reset all chain state and start fresh).

> :warning: **Note**: Running `./local_node.sh` multiple times will **reset all chain data**.
>  If you've already run the script once and just want to restart the node after a `Ctrl + C` or temporary shutdown, use the command below instead:

```bash
evmd start \
  --log_level info \
  --minimum-gas-prices=0.0001atest \
  --json-rpc.api eth,txpool,personal,net,debug,web3 \
  --chain-id "cosmos_262144-1"
```

This command will restart the node **without reinitializing the chain data**, assuming the data directory (`~/.evmd`) is still present.



## :moon: Rich Accounts

The following accounts are automatically funded when the local node is launched.
You can use them with tools like Foundry, Hardhat, or ethers.js to sign and send transactions.

| Account | Address | Private Key | Mnemonic |
|--------|---------|-------------|----------|
| #1 | `0x498B5AeC5D439b733dC2F58AB489783A23FB26dA` | `0x8a36c69d940a92fcea94b36d0f2928c7a0ee19a90073eda769693298dfa9603b` | `"doll midnight silk carpet brush boring pluck office gown inquiry duck chief aim exit gain never tennis crime fragile ship cloud surface exotic patch"` |
| #2 | `0x40a0cb1C63e026A81B55EE1308586E21eec1eFa9` | `0x3b7955d25189c99a7468192fcbc6429205c158834053ebe3f78f4512ab432db9` | `"will wear settle write dance topic tape sea glory hotel oppose rebel client problem era video gossip glide during yard balance cancel file rose"` |
| #3 | `0x963EBDf2e1f8DB8707D05FC75bfeFFBa1B5BaC17` | `0x741de4f8988ea941d3ff0287911ca4074e62b7d45c991a51186455366f10b544` | `"maximum display century economy unlock van census kite error heart snow filter midnight usage egg venture cash kick motor survey drastic edge muffin visual"` |
| #4 | `0xC6Fe5D33615a1C52c08018c47E8Bc53646A0E101` | `0x88cbead91aee890d27bf06e003ade3d4e952427e88f88d31d61d3ef5e5d54305` | `"copper push brief egg scan entry inform record adjust fossil boss egg comic alien upon aspect dry avoid interest fury window hint race symptom"` |

> :warning: **Note**: These accounts are for local development only. Never use them in production environments.

