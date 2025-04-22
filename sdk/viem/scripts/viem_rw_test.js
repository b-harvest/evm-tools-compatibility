// scripts/viem_rw_test.js
const { createPublicClient, createWalletClient, http, parseEther } = require('viem');
// Replace localhost chain config manually
// Removed ESM import to maintain CJS
const hre = require("hardhat");
const tokenArtifact = require('../artifacts/contracts/TokenExample.sol/TokenExample.json');

async function main() {
  const publicClient = createPublicClient({
    transport: http(hre.network.config.url),
    chain: { id: hre.network.config.chainId ?? 262144 },
});

  const addresses = await publicClient.request({ method: 'eth_accounts' });
  const accounts = addresses.slice(0, 6); // 0번 ~ 5번 계정
  console.log("Accounts:", accounts);

  const dotenv = require('dotenv');
dotenv.config();
const { privateKeyToAccount } = require('viem/accounts');
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) throw new Error('PRIVATE_KEY not found in .env');
const walletAccount = privateKey.startsWith('0x') ? privateKeyToAccount(privateKey) : privateKeyToAccount('0x' + privateKey);

const walletClient = createWalletClient({
    account: walletAccount,
    transport: http(hre.network.config.url),
    chain: { id: hre.network.config.chainId ?? 262144 },
    
  });

  // Deploy TokenExample
  const deploymentTxHash = await walletClient.deployContract({
    abi: tokenArtifact.abi,
    bytecode: tokenArtifact.bytecode,
    args: [],
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash: deploymentTxHash });
  const contractAddress = receipt.contractAddress;

  console.log("Token deployed at:", contractAddress);

  // Read name (viem.readContract)
  const name = await publicClient.readContract({
    address: contractAddress,
    abi: tokenArtifact.abi,
    functionName: 'name',
  });
  console.log("Token name:", name);

  // Write mint (viem.writeContract)
  const {request:mintRequest} = await publicClient.simulateContract({
    account:walletAccount,
    address: contractAddress,
    abi: tokenArtifact.abi,
    functionName: 'mint',
    args: [walletAccount.address, 1000],
  });
  const txHash = await walletClient.writeContract(mintRequest);
  console.log("Mint tx hash:", txHash);

  const Txreceipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  // Confirm mint (read balance)
  const balance = await publicClient.readContract({
    address: contractAddress,
    abi: tokenArtifact.abi,
    functionName: 'balanceOf',
    args: [walletAccount.address],
  });
  console.log("Account balance:", balance.toString());


    const {request:transferRequest}  = await publicClient.simulateContract({
    account:walletAccount,
    address: contractAddress,
    abi: tokenArtifact.abi,
    functionName: 'transfer',
    args: [accounts[0], 1000],
  });

  const txHash1 = await walletClient.writeContract(transferRequest);
  console.log("transfer tx hash:", txHash1);

  const Txreceipt1 = await publicClient.waitForTransactionReceipt({ hash: txHash1 });
}

main().catch(console.error);
