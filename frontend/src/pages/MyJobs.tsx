import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAccount } from 'wagmi';
import { useJob, useJobManager } from '@/hooks/useJobManager';
import { useFHEBridge, useEncryptedResult } from '@/hooks/useFHEBridge';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  Unlock,
  Eye,
  FileText,
  Zap,
} from 'lucide-react';

// Job status enum matching contract
enum JobStatus {
  Posted = 0,
  Accepted = 1,
  ResultSubmitted = 2,
  Settled = 3,
  Cancelled = 4,
  Disputed = 5,
}

const statusConfig = {
  [JobStatus.Posted]: {
    label: 'Posted',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    icon: Clock,
  },
  [JobStatus.Accepted]: {
    label: 'In Progress',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    icon: Zap,
  },
  [JobStatus.ResultSubmitted]: {
    label: 'Result Submitted',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
    icon: FileText,
  },
  [JobStatus.Settled]: {
    label: 'Completed',
    color: 'bg-green-500/20 text-green-400 border-green-500/50',
    icon: CheckCircle,
  },
  [JobStatus.Cancelled]: {
    label: 'Cancelled',
    color: 'bg-red-500/20 text-red-400 border-red-500/50',
    icon: XCircle,
  },
  [JobStatus.Disputed]: {
    label: 'Disputed',
    color: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    icon: XCircle,
  },
};

function JobCard({ jobId }: { jobId: number }) {
  const { address } = useAccount();
  const { job, isLoading, refetch } = useJob(jobId);
  const { result } = useEncryptedResult(jobId);
  const { grantAccessToInput, requestResultDecryption } = useFHEBridge();
  const { acceptJob, settle } = useJobManager();
  const { toast } = useToast();

  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [providerAddress, setProviderAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (job?.provider && job.provider !== '0x0000000000000000000000000000000000000000') {
      setProviderAddress(job.provider);
    }
  }, [job]);

  if (isLoading) {
    return (
      <Card className="p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!job) return null;

  const status = job.status as JobStatus;
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isConsumer = address?.toLowerCase() === job.consumer.toLowerCase();
  const isProvider = address?.toLowerCase() === job.provider.toLowerCase();

  const handleGrantAccess = async () => {
    if (!providerAddress) {
      toast({
        title: 'Missing provider address',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      await grantAccessToInput(jobId, providerAddress);
      toast({
        title: '✅ Access granted',
        description: `Provider ${providerAddress.slice(0, 10)}... can now access encrypted data`,
      });
      setShowGrantDialog(false);
      refetch();
    } catch (error: any) {
      toast({
        title: 'Failed to grant access',
        description: error?.shortMessage || error?.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRequestDecryption = async () => {
    setIsProcessing(true);
    try {
      await requestResultDecryption(jobId);
      toast({
        title: '✅ Decryption requested',
        description: 'Gateway will decrypt the result shortly',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Failed to request decryption',
        description: error?.shortMessage || error?.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAcceptJob = async () => {
    setIsProcessing(true);
    try {
      await acceptJob(jobId);
      toast({
        title: '✅ Job accepted',
        description: 'You are now assigned as the provider',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Failed to accept job',
        description: error?.shortMessage || error?.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSettle = async () => {
    setIsProcessing(true);
    try {
      await settle(jobId);
      toast({
        title: '✅ Job settled',
        description: 'Payment sent to provider',
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Failed to settle job',
        description: error?.shortMessage || error?.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold">Job #{jobId}</h3>
                <Badge className={`${config.color} border`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {isConsumer ? 'You are the Consumer' : isProvider ? 'You are the Provider' : 'Observer'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {(Number(job.priceWei) / 1e18).toFixed(4)} ETH
              </div>
              <div className="text-xs text-muted-foreground">Payment</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Consumer</div>
              <div className="font-mono text-sm">{job.consumer.slice(0, 10)}...</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Provider</div>
              <div className="font-mono text-sm">
                {job.provider !== '0x0000000000000000000000000000000000000000'
                  ? `${job.provider.slice(0, 10)}...`
                  : 'Not assigned'}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Input Commitment</div>
              <div className="font-mono text-xs truncate">{job.inputCommitment}</div>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="text-xs text-muted-foreground mb-1">Deadline</div>
              <div className="text-sm">
                {new Date(Number(job.deadline) * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Encrypted Result */}
          {result && (
            <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-primary" />
                <span className="font-semibold">Encrypted Result</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Decrypted:</span>{' '}
                  {result.decrypted ? (
                    <span className="text-green-400">✓ Yes</span>
                  ) : (
                    <span className="text-yellow-400">⏳ Pending</span>
                  )}
                </div>
                {result.decrypted && (
                  <div>
                    <span className="text-muted-foreground">Value:</span>{' '}
                    <span className="font-bold text-primary">{result.decryptedValue.toString()}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2 flex-wrap">
            {/* Anyone: Accept Job (when job is Posted) */}
            {status === JobStatus.Posted && !isConsumer && (
              <Button
                onClick={handleAcceptJob}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Accept Job (Become Provider)
              </Button>
            )}

            {/* Consumer: Grant Access (when job is Accepted) */}
            {isConsumer && status === JobStatus.Accepted && (
              <Button
                onClick={() => setShowGrantDialog(true)}
                disabled={isProcessing}
                className="flex-1 bg-primary hover:bg-primary-glow"
              >
                <Unlock className="w-4 h-4 mr-2" />
                Grant Provider Access
              </Button>
            )}

            {/* Consumer: Request Decryption (when result is submitted) */}
            {isConsumer && status === JobStatus.ResultSubmitted && result && !result.decrypted && (
              <Button
                onClick={handleRequestDecryption}
                disabled={isProcessing}
                className="flex-1 bg-accent hover:bg-accent/80"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Request Decryption
              </Button>
            )}

            {/* Consumer: Settle Payment (when result is decrypted) */}
            {isConsumer && status === JobStatus.ResultSubmitted && result?.decrypted && (
              <Button
                onClick={handleSettle}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Settle & Pay Provider
              </Button>
            )}

            {/* Everyone: View Details */}
            <Button variant="outline" className="border-primary/40 hover:border-primary">
              <FileText className="w-4 h-4 mr-2" />
              Details
            </Button>
          </div>
        </div>
      </Card>

      {/* Grant Access Dialog */}
      <Dialog open={showGrantDialog} onOpenChange={setShowGrantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grant Provider Access to Encrypted Data</DialogTitle>
            <DialogDescription>
              Allow the provider to access your FHE encrypted computation data
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Provider Address</Label>
              <Input
                value={providerAddress}
                onChange={(e) => setProviderAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>

            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <div className="flex items-start gap-2">
                <Lock className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="text-sm text-yellow-200">
                  This will grant the provider permission to access your encrypted input data via FHE ACL.
                  The data remains encrypted at all times.
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGrantDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleGrantAccess}
              disabled={isProcessing || !providerAddress}
              className="bg-primary hover:bg-primary-glow"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Unlock className="w-4 h-4 mr-2" />
              )}
              Grant Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default function MyJobs() {
  const { address } = useAccount();
  const [jobIds, setJobIds] = useState<number[]>([1, 2, 3]); // TODO: Get from events

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="text-foreground">My Computation</span>
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">Jobs</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Track your FHE computation jobs, manage encrypted data access, and decrypt results
            </p>
          </div>

          {/* Wallet Check */}
          {!address ? (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
              <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground">
                Please connect your wallet to view your jobs
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {jobIds.map((jobId) => (
                <JobCard key={jobId} jobId={jobId} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
