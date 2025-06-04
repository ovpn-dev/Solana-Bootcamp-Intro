
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  SystemProgram, 
  Transaction, 
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, Coins, ArrowDownToLine } from 'lucide-react';

const TransactionPanel = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [airdropping, setAirdropping] = useState(false);
  const { toast } = useToast();

  const handleAirdrop = async () => {
    if (!publicKey) return;
    
    setAirdropping(true);
    try {
      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature);
      
      toast({
        title: "Airdrop Successful!",
        description: "2 SOL has been added to your wallet",
      });
    } catch (error) {
      console.error('Airdrop failed:', error);
      toast({
        title: "Airdrop Failed",
        description: "Failed to airdrop SOL to your wallet",
        variant: "destructive"
      });
    } finally {
      setAirdropping(false);
    }
  };

  const handleSendTransaction = async () => {
    if (!publicKey || !recipient || !amount) return;
    
    setLoading(true);
    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubkey,
          lamports,
        })
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      toast({
        title: "Transaction Successful!",
        description: `Sent ${amount} SOL to ${recipient.slice(0, 8)}...`,
      });
      
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      toast({
        title: "Transaction Failed",
        description: "Failed to send transaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <ArrowDownToLine className={`w-4 h-4 mr-2 ${airdropping ? 'animate-spin' : ''}`} />
              {airdropping ? 'Requesting...' : 'Request Airdrop'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/20 backdrop-blur-sm border-purple-500/20 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5 text-green-400" />
            Send SOL
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send SOL to another wallet address
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-gray-300">Recipient Address</Label>
            <Input
              id="recipient"
              placeholder="Enter recipient's public key"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/30 border-purple-500/30 text-white placeholder-gray-500"
            />
          </div>
          
          <Button
            onClick={handleSendTransaction}
            disabled={loading || !recipient || !amount}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Send className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Sending...' : 'Send Transaction'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPanel;