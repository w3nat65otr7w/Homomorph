import { Card } from '@/components/ui/card';
import { Upload, Cpu, Coins, Shield, Zap, Lock } from 'lucide-react';

const features = [
  {
    icon: Upload,
    title: 'Data Consumers',
    description: 'Upload encrypted data and request computations without exposing sensitive information.',
    highlights: ['End-to-end encryption', 'Pay-per-compute', 'Result verification'],
    color: 'primary',
  },
  {
    icon: Cpu,
    title: 'Compute Providers',
    description: 'Monetize your computing resources by processing encrypted data and earning rewards.',
    highlights: ['Decentralized network', 'Automated payments', 'Reputation system'],
    color: 'accent',
  },
  {
    icon: Coins,
    title: 'Marketplace',
    description: 'Transparent, trustless marketplace connecting data owners with compute providers.',
    highlights: ['Smart contracts', 'Instant settlement', 'Low fees'],
    color: 'primary',
  },
];

const securityFeatures = [
  {
    icon: Shield,
    title: 'FHE Technology',
    description: 'Fully Homomorphic Encryption allows computation on encrypted data',
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Optimized protocols for fast encrypted computation',
  },
  {
    icon: Lock,
    title: 'Zero Knowledge',
    description: 'Providers never see your data, only encrypted ciphertext',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Diagonal Background Split */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Features */}
        <div className="mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Three-Role Ecosystem</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            <span className="text-foreground">Complete Privacy</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Computing Stack</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl">
            A trustless ecosystem connecting data owners with computing power
          </p>
        </div>

        {/* Asymmetric Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`relative p-8 bg-card/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 group overflow-hidden ${
                index === 1 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                    <feature.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-6xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                    0{index + 1}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{feature.description}</p>
                  <div className="space-y-3">
                    {feature.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3 group/item">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5 group-hover/item:bg-primary/30 transition-colors">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                        <span className="text-sm font-medium">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Security Features - Horizontal Layout */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-3xl" />
          <div className="relative grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <div 
                key={index}
                className="group p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-bold text-lg">{feature.title}</h4>
                </div>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
