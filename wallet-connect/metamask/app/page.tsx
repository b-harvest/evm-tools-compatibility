"use client";

import { useAccount, useSignMessage, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect } from "react";
import { type Hash } from "viem";
import { localChain } from "./provider";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [message, setMessage] = useState("Hello, Web3!");
  const [txHash, setTxHash] = useState<Hash | null>(null);

  useEffect(() => {
    if (isConnected && window.ethereum) {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: localChain.id }],
      }).catch((error: any) => {
        if (error.code === 4902) {
          // 체인이 메타마스크에 추가되어 있지 않은 경우
          window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: localChain.id,
              chainName: localChain.name,
              nativeCurrency: localChain.nativeCurrency,
              rpcUrls: localChain.rpcUrls.default.http,
              blockExplorerUrls: localChain.blockExplorers?.default?.url ? [localChain.blockExplorers.default.url] : []
            }]
          });
        }
      });
    }
  }, [isConnected]);

  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess: (data: Hash) => {
        console.log("Signature:", data);
        alert("Message signed successfully!");
      },
      onError: (error: Error) => {
        console.error("Error signing message:", error);
        alert("Failed to sign message");
      },
    },
  });

    
  
  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: (data: Hash) => {
        console.log("Transaction hash:", data);
        setTxHash(data);
        alert("Transaction sent successfully!");
      },
      onError: (error: Error) => {
        console.error("Error sending transaction:", error);
        alert("Failed to send transaction");
      },
    },
  });
  // ⛏️ 트랜잭션 채굴 여부 확인
  const { data: receipt, isLoading: isMining, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
  })

  // ⛏️ 트랜잭션 처리 완료 후 알림
  useEffect(() => {
    if (isSuccess && receipt?.status === 'success') {
      console.log('✅ Transaction mined in block:', receipt.blockNumber)
      alert('✅ Transaction successfully mined!')
    } else if (isSuccess && receipt?.status === 'reverted') {
      alert('⚠️ Transaction reverted!')
    }
  }, [isSuccess, receipt])

  const handleSignMessage = () => {
    signMessage({ message });
  };

  const handleSendTransaction = () => {
    sendTransaction({
      to: "0x0000000000000000000000000000000000000000", // Replace with actual recipient address
      value: BigInt(0.1 * 10 ** 18), // 0.1 ETH in wei
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Web3 Actions
            </h1>
            <p className="text-gray-400">Connect your wallet to get started</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-700/50">
            <div className="flex justify-center mb-8">
              <ConnectButton />
            </div>

            {isConnected && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Message to sign
                  </label>
                  <input
                    id="message"
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Enter your message"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleSignMessage}
                    className="px-6 py-3 bg-gradient-to-r rounded-full from-purple-500 to-pink-500 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                    <span>Sign Message</span>
                  </button>

                  <button
                    onClick={handleSendTransaction}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                    <span>Send 0.1 ETH</span>
                  </button>
                </div>

                {address && (
                  <div className="text-center text-sm text-gray-400 mt-4">
                    Connected:{" "}
                    <span className="text-purple-400">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
