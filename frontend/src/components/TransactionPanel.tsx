import React, { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAccount,
} from "@solana/spl-token";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Coins, ArrowDownToLine, Banknote } from "lucide-react";

const TransactionPanel = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [solRecipient, setSolRecipient] = useState("");
  const [solAmount, setSolAmount] = useState("");
  const [usdcRecipient, setUsdcRecipient] = useState("");
  const [usdcAmount, setUsdcAmount] = useState("");
  const [usdcDevRecipient, setUsdcDevRecipient] = useState("");
  const [usdcDevAmount, setUsdcDevAmount] = useState("");
  const [solLoading, setSolLoading] = useState(false);
  const [usdcLoading, setUsdcLoading] = useState(false);
  const [usdcDevLoading, setUsdcDevLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const { toast } = useToast();

  // USDC mint address on Devnet
  const USDC_MINT = new PublicKey(
    "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
  );

  // USDC_DEV mint address on Devnet
  const USDC_DEV_MINT = new PublicKey(
    "Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"
  );

  const handleAirdrop = async () => {
    if (!publicKey) return;

    setAirdropping(true);
    try {
      const signature = await connection.requestAirdrop(
        publicKey,
        2 * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(signature);

      toast({
        title: "Airdrop Successful!",
        description: "2 SOL has been added to your wallet",
      });
    } catch (error) {
      console.error("Airdrop failed:", error);
      toast({
        title: "Airdrop Failed",
        description: "Failed to airdrop SOL to your wallet",
        variant: "destructive",
      });
    } finally {
      setAirdropping(false);
    }
  };

  const handleSendSol = async () => {
    if (!publicKey || !solRecipient || !solAmount) return;

    setSolLoading(true);
    try {
      const recipientPubkey = new PublicKey(solRecipient);
      const lamports = parseFloat(solAmount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      toast({
        title: "SOL Transaction Successful!",
        description: `Sent ${solAmount} SOL to ${solRecipient.slice(0, 8)}...`,
      });

      setSolRecipient("");
      setSolAmount("");
    } catch (error) {
      console.error("SOL transaction failed:", error);
      toast({
        title: "SOL Transaction Failed",
        description: error.message || "Failed to send SOL transaction",
        variant: "destructive",
      });
    } finally {
      setSolLoading(false);
    }
  };

  const handleSendUsdc = async () => {
    if (!publicKey || !usdcRecipient || !usdcAmount) return;

    setUsdcLoading(true);
    try {
      const recipientPubkey = new PublicKey(usdcRecipient);
      const amount = parseFloat(usdcAmount);

      // Convert to token units (USDC has 6 decimals)
      const tokenAmount = Math.round(amount * Math.pow(10, 6));

      const transaction = new Transaction();

      // Get sender's associated token account
      const senderTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        publicKey
      );

      // Get recipient's associated token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        USDC_MINT,
        recipientPubkey
      );

      // Check if recipient's token account exists
      let recipientAccountExists = true;
      try {
        await getAccount(connection, recipientTokenAccount);
      } catch (error) {
        if (error.name === "TokenAccountNotFoundError") {
          recipientAccountExists = false;
        } else {
          throw error;
        }
      }

      // If recipient's token account doesn't exist, create it
      if (!recipientAccountExists) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientTokenAccount, // associated token account
            recipientPubkey, // owner
            USDC_MINT // mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAccount, // source
          recipientTokenAccount, // destination
          publicKey, // owner
          tokenAmount // amount
        )
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      toast({
        title: "USDC Transaction Successful!",
        description: `Sent ${usdcAmount} USDC to ${usdcRecipient.slice(
          0,
          8
        )}...`,
      });

      setUsdcRecipient("");
      setUsdcAmount("");
    } catch (error) {
      console.error("USDC transaction failed:", error);
      toast({
        title: "USDC Transaction Failed",
        description: error.message || "Failed to send USDC transaction",
        variant: "destructive",
      });
    } finally {
      setUsdcLoading(false);
    }
  };

  const handleSendUsdcDev = async () => {
    if (!publicKey || !usdcDevRecipient || !usdcDevAmount) return;

    setUsdcDevLoading(true);
    try {
      const recipientPubkey = new PublicKey(usdcDevRecipient);
      const amount = parseFloat(usdcDevAmount);

      // Convert to token units (USDC has 6 decimals)
      const tokenAmount = Math.round(amount * Math.pow(10, 6));

      const transaction = new Transaction();

      // Get sender's associated token account
      const senderTokenAccount = await getAssociatedTokenAddress(
        USDC_DEV_MINT,
        publicKey
      );

      // Get recipient's associated token account
      const recipientTokenAccount = await getAssociatedTokenAddress(
        USDC_DEV_MINT,
        recipientPubkey
      );

      // Check if recipient's token account exists
      let recipientAccountExists = true;
      try {
        await getAccount(connection, recipientTokenAccount);
      } catch (error) {
        if (error.name === "TokenAccountNotFoundError") {
          recipientAccountExists = false;
        } else {
          throw error;
        }
      }

      // If recipient's token account doesn't exist, create it
      if (!recipientAccountExists) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey, // payer
            recipientTokenAccount, // associated token account
            recipientPubkey, // owner
            USDC_DEV_MINT // mint
          )
        );
      }

      // Add transfer instruction
      transaction.add(
        createTransferInstruction(
          senderTokenAccount, // source
          recipientTokenAccount, // destination
          publicKey, // owner
          tokenAmount // amount
        )
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      toast({
        title: "USD Coin Transaction Successful!",
        description: `Sent ${usdcDevAmount} USD Coin to ${usdcDevRecipient.slice(
          0,
          8
        )}...`,
      });

      setUsdcDevRecipient("");
      setUsdcDevAmount("");
    } catch (error) {
      console.error("USD Coin transaction failed:", error);
      toast({
        title: "USD Coin Transaction Failed",
        description: error.message || "Failed to send USD Coin transaction",
        variant: "destructive",
      });
    } finally {
      setUsdcDevLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardContent className="text-center py-12">
          <div className="text-gray-400">
            Please connect your wallet to use transaction features
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Airdrop Card */}
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-yellow-400" />
            Request Airdrop
          </CardTitle>
          <CardDescription className="text-gray-300">
            Get free SOL on Devnet for testing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-lg text-gray-300 mb-4">
              Request 2 SOL for testing purposes
            </div>
            <Button
              onClick={handleAirdrop}
              disabled={airdropping}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
            >
              <ArrowDownToLine
                className={`w-4 h-4 mr-2 ${airdropping ? "animate-spin" : ""}`}
              />
              {airdropping ? "Requesting..." : "Request Airdrop"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Send SOL Card */}
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-400" />
            Send SOL
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send SOL to another wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sol-recipient" className="text-gray-300">
              Recipient Address
            </Label>
            <Input
              id="sol-recipient"
              placeholder="Enter recipient's public key"
              value={solRecipient}
              onChange={(e) => setSolRecipient(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sol-amount" className="text-gray-300">
              Amount (SOL)
            </Label>
            <Input
              id="sol-amount"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              value={solAmount}
              onChange={(e) => setSolAmount(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <Button
            onClick={handleSendSol}
            disabled={solLoading || !solRecipient || !solAmount}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send
              className={`w-4 h-4 mr-2 ${solLoading ? "animate-spin" : ""}`}
            />
            {solLoading ? "Sending..." : "Send SOL"}
          </Button>
        </CardContent>
      </Card>

      {/* Send USDC Card */}
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-400" />
            Send USDC
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send USDC tokens to another wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usdc-recipient" className="text-gray-300">
              Recipient Address
            </Label>
            <Input
              id="usdc-recipient"
              placeholder="Enter recipient's public key"
              value={usdcRecipient}
              onChange={(e) => setUsdcRecipient(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usdc-amount" className="text-gray-300">
              Amount (USDC)
            </Label>
            <Input
              id="usdc-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={usdcAmount}
              onChange={(e) => setUsdcAmount(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <Button
            onClick={handleSendUsdc}
            disabled={usdcLoading || !usdcRecipient || !usdcAmount}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Banknote
              className={`w-4 h-4 mr-2 ${usdcLoading ? "animate-spin" : ""}`}
            />
            {usdcLoading ? "Sending..." : "Send USDC"}
          </Button>
        </CardContent>
      </Card>

      {/* Send USD Coin Card */}
      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-green-400" />
            Send USD Coin Dev
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send USD Coin Dev tokens to another wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usdcDev-recipient" className="text-gray-300">
              Recipient Address
            </Label>
            <Input
              id="usdcDev-recipient"
              placeholder="Enter recipient's public key"
              value={usdcDevRecipient}
              onChange={(e) => setUsdcDevRecipient(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="usdcDev-amount" className="text-gray-300">
              Amount (USD Coin)
            </Label>
            <Input
              id="usdcDev-amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={usdcDevAmount}
              onChange={(e) => setUsdcDevAmount(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>

          <Button
            onClick={handleSendUsdcDev}
            disabled={usdcDevLoading || !usdcDevRecipient || !usdcDevAmount}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Banknote
              className={`w-4 h-4 mr-2 ${usdcDevLoading ? "animate-spin" : ""}`}
            />
            {usdcDevLoading ? "Sending..." : "Send USD Coin Dev"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPanel;
