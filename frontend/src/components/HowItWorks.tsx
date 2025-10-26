import { ArrowRight, Shield, Lock, Cpu, CheckCircle, Upload, Code, Microscope, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    number: '01',
    title: 'Upload Encrypted Data',
    description: 'Your sensitive data is encrypted using Fully Homomorphic Encryption (FHE) before leaving your device. Neither the platform nor compute providers can access your raw data.',
    role: 'Consumer',
    color: 'primary',
    icon: Upload,
  },
  {
    number: '02',
    title: 'Smart Contract Matching',
    description: 'Blockchain smart contracts automatically match your computation task with available hardware providers based on requirements and pricing.',
    role: 'Platform',
    color: 'accent',
    icon: Cpu,
  },
  {
    number: '03',
    title: 'Private Computation',
    description: 'Compute providers process your encrypted data directly without decryption. All calculations happen on ciphertext, ensuring complete privacy.',
    role: 'Provider',
    color: 'primary',
    icon: Lock,
  },
  {
    number: '04',
    title: 'Encrypted Results & Payment',
    description: 'You receive encrypted computation results that only you can decrypt. Smart contracts automatically handle secure payment to providers.',
    role: 'Platform',
    color: 'accent',
    icon: CheckCircle,
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-gradient-secondary">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Privacy-First Computing</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A decentralized marketplace for privacy-preserving computation. Your data stays encrypted throughout the entire process - the platform and compute providers never see your raw data.
          </p>
        </div>

        {/* Demo Video Section */}
        <div className="max-w-5xl mx-auto mb-20">
          <Card className="p-2 bg-card/50 backdrop-blur-sm border-primary/20">
            <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg overflow-hidden">
              {/* Placeholder for video - will be replaced */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                    <Rocket className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-lg font-semibold text-muted-foreground">
                    Demo Video Coming Soon
                  </div>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Watch how Homomorph enables secure computation on encrypted data
                  </p>
                </div>
              </div>
              {/* Video will be inserted here */}
              {/* <video src="path-to-demo-video.mp4" controls className="w-full h-full object-cover" /> */}
            </div>
          </Card>
        </div>

        {/* Workflow Steps */}
        <div className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Privacy-Preserving Workflow
          </h3>
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
                  {/* Number Circle with Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-24 h-24 rounded-full border-2 border-primary bg-primary/10 flex flex-col items-center justify-center">
                      <Icon className="w-8 h-8 text-primary mb-1" />
                      <span className="text-sm font-bold text-primary">{step.number}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent" />
                    )}
                  </div>

                  {/* Content */}
                  <Card className="flex-1 p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                      {step.role}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Overview */}
        <div className="max-w-6xl mx-auto mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/20">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">
                What is <span className="text-primary">Homomorph</span>?
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A decentralized marketplace for renting privacy-preserving computational power
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 bg-card/50 border-primary/20">
                <Shield className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-lg font-bold mb-2">Complete Privacy</h4>
                <p className="text-sm text-muted-foreground">
                  Using Fully Homomorphic Encryption (FHE), your data remains encrypted during computation. Neither the platform nor compute providers can access your raw data.
                </p>
              </Card>

              <Card className="p-6 bg-card/50 border-accent/20">
                <Cpu className="w-12 h-12 text-accent mb-4" />
                <h4 className="text-lg font-bold mb-2">Decentralized Compute</h4>
                <p className="text-sm text-muted-foreground">
                  Access high-performance GPUs, CPUs, and specialized hardware from a global network of providers at competitive prices.
                </p>
              </Card>

              <Card className="p-6 bg-card/50 border-primary/20">
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h4 className="text-lg font-bold mb-2">Blockchain Security</h4>
                <p className="text-sm text-muted-foreground">
                  Smart contracts on Ethereum ensure trustless matching, automatic payments, and verifiable computation.
                </p>
              </Card>
            </div>
          </Card>
        </div>

        {/* Current & Future Capabilities */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Current Services */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold">Currently Available</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Encrypted Numeric Computation</div>
                    <div className="text-sm text-muted-foreground">Process encrypted numerical data with FHE technology</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">GPU & CPU Marketplace</div>
                    <div className="text-sm text-muted-foreground">Access RTX 5090, server clusters, and EPYC processors</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Smart Contract Escrow</div>
                    <div className="text-sm text-muted-foreground">Trustless payment and result verification</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Sepolia Testnet Deployment</div>
                    <div className="text-sm text-muted-foreground">Live testing environment for developers</div>
                  </div>
                </li>
              </ul>
            </Card>

            {/* Coming Soon */}
            <Card className="p-8 bg-card/50 backdrop-blur-sm border-accent/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Coming Soon</h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Code className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Code & File Upload</div>
                    <div className="text-sm text-muted-foreground">Upload and execute encrypted Python, R, Julia scripts on private data</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Microscope className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Scientific Computing</div>
                    <div className="text-sm text-muted-foreground">Physics simulations, astronomical data processing, molecular dynamics</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Specialized Hardware</div>
                    <div className="text-sm text-muted-foreground">Access to TPUs, FPGAs, and quantum computing resources</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold mb-1">Domain-Specific Platforms</div>
                    <div className="text-sm text-muted-foreground">Bioinformatics, genomics, climate modeling, and financial analytics</div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
