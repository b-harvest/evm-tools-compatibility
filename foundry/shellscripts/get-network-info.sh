#!/usr/bin/env bash
set -euo pipefail

# Usage: ./query_network_info.sh [RPC_URL]
# If RPC_URL is not provided as the first argument, falls back to $CUSTOM_RPC or http://127.0.0.1:8545

source .env
RPC_URL=${1:-${CUSTOM_RPC:-http://127.0.0.1:8545}}

echo "🔗 RPC URL: $RPC_URL"
echo

# 1) Chain ID (decimal)
echo "⛓ Chain ID (decimal):"
cast chain-id --rpc-url "$RPC_URL"
echo

# 2) Chain ID (hex)"
echo "⛓ Chain ID (hex):"
cast rpc --rpc-url "$RPC_URL" eth_chainId
echo

# 3) Network ID (net_version)
echo "🌐 Network ID:"
cast rpc --rpc-url "$RPC_URL" net_version
echo

# 4) Client Version (web3_clientVersion)
echo "🖥 Client Version:"
cast rpc --rpc-url "$RPC_URL" web3_clientVersion
echo

# 5) Protocol Version (eth_protocolVersion)
echo "⚙️ Protocol Version:"
cast rpc --rpc-url "$RPC_URL" eth_protocolVersion
echo