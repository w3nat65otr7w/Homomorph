import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useJobManager } from '@/hooks/useJobManager';
import { useFHEBridge } from '@/hooks/useFHEBridge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Calendar, DollarSign, FileText, Lock } from 'lucide-react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { JOB_MANAGER_ADDRESS } from '@/lib/contracts/addresses';
import { encryptComputationData } from '@/lib/fhe';

interface RentHardwareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hardware: {
    name: string;
    type: string;
    price: string;
    power: string;
    performance: string;
  };
}

export function RentHardwareDialog({ open, onOpenChange, hardware }: RentHardwareDialogProps) {
  const [computationData, setComputationData] = useState('');
  const [hours, setHours] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { postJob } = useJobManager();
  const { submitEncryptedInput } = useFHEBridge();
  const { toast } = useToast();
  const { isConnected, address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const pricePerHour = parseFloat(hardware.price.replace(' ETH/hr', ''));
  const totalPrice = (pricePerHour * parseFloat(hours || '0')).toFixed(4);
  const deadlineTimestamp = Math.floor(Date.now() / 1000) + (parseInt(hours || '1') * 3600);

  const handleRent = async () => {
    if (!isConnected) {
      toast({
        title: 'Wallet not connected',
        description: 'Please connect your wallet to rent hardware',
        variant: 'destructive',
      });
      return;
    }

    if (!computationData.trim()) {
      toast({
        title: 'Missing data',
        description: 'Please enter your computation data',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: FHE encrypt the computation data FIRST! 🔐
      toast({
        title: '🔐 Step 1/4: FHE Encrypting computation data...',
        description: 'Using Zama FHE SDK to encrypt your private data',
      });

      if (!userAddress) {
        throw new Error('User address not available');
      }

      // Get wallet provider for FHE encryption
      const walletProvider = walletClient?.transport || window.ethereum || (window as any).okxwallet;
      console.log('🔐 Wallet provider for FHE:', {
        hasWalletClient: !!walletClient,
        hasEthereum: !!window.ethereum,
        hasOKX: !!(window as any).okxwallet,
        provider: walletProvider
      });

      // Use FHE SDK to encrypt the computation data
      const encrypted = await encryptComputationData(
        computationData,
        JOB_MANAGER_ADDRESS,
        userAddress,
        walletProvider
      );

      console.log('✅ FHE Encryption complete:', {
        originalData: computationData,
        encryptedHandle: encrypted.handle,
        numericValue: encrypted.numericValue,
        proof: encrypted.proof.slice(0, 20) + '...'
      });

      // Step 2: Post job to JobManager with FHE encrypted handle as commitment
      toast({
        title: '📝 Step 2/4: Posting job with FHE commitment...',
        description: 'Submitting FHE encrypted handle to blockchain',
      });

      // Use the FHE encrypted handle as the commitment!
      const txHash = await postJob(encrypted.handle, deadlineTimestamp, totalPrice);

      // Step 3: Wait for transaction and get jobId from event
      toast({
        title: '⏳ Step 3/4: Confirming transaction...',
        description: 'Getting job ID from blockchain event',
      });

      if (!publicClient) {
        throw new Error('Public client not available');
      }

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: txHash as `0x${string}`
      });

      console.log('📋 Transaction receipt:', receipt);
      console.log('📋 All logs:', receipt.logs);

      // Parse JobPosted event to get jobId
      // Event signature: JobPosted(uint256 indexed jobId, address indexed consumer, address indexed provider, bytes32 inputCommitment, uint256 priceWei, uint256 deadline)
      const jobPostedEvent = receipt.logs.find((log: any) => {
        const isCorrectContract = log.address.toLowerCase() === JOB_MANAGER_ADDRESS.toLowerCase();
        console.log('🔍 Checking log:', {
          address: log.address,
          topics: log.topics,
          isCorrectContract
        });
        return isCorrectContract;
      });

      if (!jobPostedEvent) {
        console.error('❌ No event found from JobManager contract');
        console.error('Expected address:', JOB_MANAGER_ADDRESS);
        console.error('All log addresses:', receipt.logs.map((l: any) => l.address));
        throw new Error('Could not find JobPosted event in transaction');
      }

      console.log('✅ Found JobPosted event:', jobPostedEvent);

      // topics[0] = event signature hash
      // topics[1] = jobId (first indexed param)
      // topics[2] = consumer address (second indexed param)
      // topics[3] = provider address (third indexed param)
      if (!jobPostedEvent.topics || jobPostedEvent.topics.length < 2) {
        console.error('❌ Invalid topics:', jobPostedEvent.topics);
        throw new Error('JobPosted event has invalid topics');
      }

      const jobId = parseInt(jobPostedEvent.topics[1], 16);
      console.log('🎯 Parsed jobId:', jobId);

      // Step 4: Submit the full FHE encrypted input to FHEBridge
      toast({
        title: '💾 Step 4/4: Storing encrypted data in FHE Bridge...',
        description: `Submitting full encrypted computation for job #${jobId}`,
      });

      // Submit the encrypted numeric value to FHEBridge
      await submitEncryptedInput(jobId, encrypted.numericValue);

      toast({
        title: '✅ Hardware rental successful!',
        description: `Job #${jobId} created with FHE encrypted computation data`,
      });

      onOpenChange(false);
      setComputationData('');
      setHours('1');
    } catch (error: any) {
      console.error('Rent error:', error);
      toast({
        title: 'Rental failed',
        description: error?.shortMessage || error?.message || 'Failed to rent hardware. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Rent {hardware.name}
          </DialogTitle>
          <DialogDescription>
            Configure your computation job with encrypted data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Hardware Info */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/50">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <div className="font-semibold text-sm">{hardware.type}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Power</div>
              <div className="font-semibold text-sm">{hardware.power}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Performance</div>
              <div className="font-semibold text-sm">{hardware.performance}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Price/Hour</div>
              <div className="font-semibold text-sm text-primary">{hardware.price}</div>
            </div>
          </div>

          {/* Rental Duration */}
          <div className="space-y-2">
            <Label htmlFor="hours" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Rental Duration (hours)
            </Label>
            <Input
              id="hours"
              type="number"
              min="1"
              max="168"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Enter hours"
            />
          </div>

          {/* Computation Data */}
          <div className="space-y-2">
            <Label htmlFor="data" className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Computation Data (will be encrypted)
            </Label>
            <Textarea
              id="data"
              value={computationData}
              onChange={(e) => setComputationData(e.target.value)}
              placeholder="Enter your computation data... (e.g., numeric values, parameters)"
              rows={4}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Your data will be encrypted using FHE before submission
            </p>
          </div>

          {/* Total Cost */}
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-semibold">Total Cost</span>
              </div>
              <div className="text-2xl font-bold text-primary">{totalPrice} ETH</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {hours} hour(s) × {hardware.price}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRent}
            disabled={isSubmitting || !isConnected}
            className="bg-primary hover:bg-primary-glow"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Rent Hardware
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
