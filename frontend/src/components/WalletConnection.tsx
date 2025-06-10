import React, { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const WalletConnection = () => {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [usdcDevBalance, setUsdcDevBalance] = useState<number | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [usdcDevLoading, setUsdcDevLoading] = useState(false);
  const [usdcLoading, setUsdcLoading] = useState(false);
  const { toast } = useToast();

  // USDC_DEV mint address on Devnet
  const USDC_DEV_MINT = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );

  // USDC_ mint address on Devnet
  const USDC_MINT = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  );

  const fetchSolBalance = async () => {
    if (!publicKey) return;

    setLoading(true);
    try {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error("Error fetching SOL balance:", error);
      toast({
        title: "Error",
        description: "Failed to fetch SOL balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsdcDevBalance = async () => {
    if (!publicKey) return;

    setUsdcDevLoading(true);
    try {
      // Get the associated token account address for USDC
      const associatedTokenAccount = await getAssociatedTokenAddress(
        USDC_DEV_MINT,
        publicKey
      );

      // Try to get the account info
      const accountInfo = await getAccount(connection, associatedTokenAccount);

      // USDC has 6 decimals, so divide by 1,000,000
      const balance = Number(accountInfo.amount) / Math.pow(10, 6);
      setUsdcDevBalance(balance);
    } catch (error) {
      console.error("Error fetching USDC_DEV balance:", error);
      // If account doesn't exist, balance is 0
      if (error.name === "TokenAccountNotFoundError") {
        setUsdcDevBalance(0);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch USDC_DEV balance",
          variant: "destructive",
        });
      }
    } finally {
      setUsdcDevLoading(false);
    }
  };

  const fetchUsdcBalance = async () => {
    if (!publicKey) return;

    setUsdcLoading(true);
    try {
      // Get the associated token account address for USDC
      const associatedTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      // Try to get the account info
      const accountInfo = await getAccount(connection, associatedTokenAccount);

      // USDC has 6 decimals, so divide by 1,000,000
      const balance = Number(accountInfo.amount) / Math.pow(10, 6);
      setUsdcBalance(balance);
    } catch (error) {
      console.error("Error fetching USDC balance:", error);
      // If account doesn't exist, balance is 0
      if (error.name === "TokenAccountNotFoundError") {
        setUsdcBalance(0);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch USDC balance",
          variant: "destructive",
        });
      }
    } finally {
      setUsdcLoading(false);
    }
  };

  const fetchAllBalances = async () => {
    await Promise.all([
      fetchSolBalance(),
      fetchUsdcDevBalance(),
      fetchUsdcBalance(),
    ]);
  };

  useEffect(() => {
    if (connected && publicKey) {
      fetchAllBalances();
    }
  }, [connection, publicKey, connected]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-400" />
            Wallet Connection
          </CardTitle>
          <CardDescription className="text-gray-300">
            Connect your Phantom wallet to get started with Solana
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-pink-600 hover:!from-purple-700 hover:!to-pink-700 !border-none !rounded-lg" />
          </div>

          {connected && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status:</span>
                <Badge className="bg-green-600 hover:bg-green-700">
                  Connected
                </Badge>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-400">Public Key:</span>
                <div className="bg-black/30 p-3 rounded-lg font-mono text-xs break-all">
                  {publicKey?.toString()}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
              SOL Balance
            </div>
            {connected && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSolBalance}
                disabled={loading}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your current SOL balance on Devnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="text-center py-8 text-gray-400">
              Connect your wallet to view balance
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading balance...
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
                {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "--"}
              </div>
              <div className="text-sm text-gray-400 mt-2">Network: Devnet</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              USDC Balance
            </div>
            {connected && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsdcBalance}
                disabled={usdcLoading}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
              >
                <RefreshCw
                  className={`w-4 h-4 ${usdcLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your current USDC balance on Devnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="text-center py-8 text-gray-400">
              Connect your wallet to view balance
            </div>
          ) : usdcLoading ? (
            <div className="text-center py-8 text-gray-400">
              Loading balance...
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
                {usdcBalance !== null ? `${usdcBalance.toFixed(2)} USDC` : "--"}
              </div>
              <div className="text-sm text-gray-400 mt-2">Network: Devnet</div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-400" />
              USD Coin Dev Balance
            </div>
            {connected && (
              <Button
                variant="outline"
                size="sm"
                onClick={fetchUsdcDevBalance}
                disabled={usdcDevLoading}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-600/20"
              >
                <RefreshCw
                  className={`w-4 h-4 ${usdcDevLoading ? "animate-spin" : ""}`}
                />
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your current USD Coin Dev balance on Devnet
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!connected ? (
            <div className="text-center py-8 text-gray-400">
              Connect your wallet to view balance
            </div>
          ) : usdcDevLoading ? (
            <div className="text-center py-8 text-gray-400">
              Loading balance...
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text">
                {usdcDevBalance !== null
                  ? `${usdcDevBalance.toFixed(2)} USD Coin Dev`
                  : "--"}
              </div>
              <div className="text-sm text-gray-400 mt-2">Network: Devnet</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnection;
