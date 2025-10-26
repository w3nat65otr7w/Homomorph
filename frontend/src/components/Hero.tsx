import { Button } from '@/components/ui/button';
import { ArrowRight, Lock, Shield, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/hero-bg.jpg';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Large Background Image - Positioned on Right */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 z-0 hidden lg:block">
        <img 
          src={heroImage} 
          alt="FHE Computing Network" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/50 to-background" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Content - Left Aligned */}
      <div className="container mx-auto px-4 z-10">
        <div className="max-w-3xl lg:max-w-2xl space-y-10 animate-fade-in">
          {/* Badge with Glow */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-primary/40 bg-primary/10 backdrop-blur-sm glow-border">
            <div className="relative">
              <Lock className="w-5 h-5 text-primary relative z-10" />
              <div className="absolute inset-0 blur-md bg-primary animate-glow-pulse" />
            </div>
            <span className="text-sm font-semibold text-primary">Fully Homomorphic Encryption</span>
          </div>

          {/* Main Heading - Asymmetric Layout */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              <span className="block text-foreground">Encrypted</span>
              <span className="block bg-gradient-primary bg-clip-text text-transparent glow-text">
                Computing
              </span>
              <span className="block text-foreground/80 text-5xl md:text-7xl">Power Market</span>
            </h1>
          </div>

          {/* Description - Wider */}
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            Decentralized marketplace connecting data owners with computing power. 
            <span className="text-foreground font-semibold"> Run algorithms on encrypted data</span> without 
            ever exposing sensitive information.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Zero Trust</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Decentralized</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border/50">
              <Lock className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">End-to-End Encrypted</span>
            </div>
          </div>

          {/* CTA Buttons - Stacked on Mobile */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/marketplace')}
              className="group relative overflow-hidden bg-primary hover:bg-primary-glow transition-all duration-300 glow-border text-lg px-8 py-6 h-auto"
            >
              <span className="relative z-10 flex items-center gap-3">
                <span className="font-bold">Launch App</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/marketplace')}
              className="border-primary/40 hover:border-primary hover:bg-primary/10 transition-all duration-300 text-lg px-8 py-6 h-auto font-semibold"
            >
              Explore Market
            </Button>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all">
              <div className="text-3xl md:text-4xl font-black bg-gradient-primary bg-clip-text text-transparent mb-1">$2.5M</div>
              <div className="text-xs text-muted-foreground font-medium">TVL</div>
            </div>
            <div className="p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-accent/50 transition-all">
              <div className="text-3xl md:text-4xl font-black text-accent mb-1">10K+</div>
              <div className="text-xs text-muted-foreground font-medium">Tasks</div>
            </div>
            <div className="p-4 rounded-xl bg-card/30 backdrop-blur-sm border border-border/30 hover:border-primary/50 transition-all">
              <div className="text-3xl md:text-4xl font-black text-primary-glow mb-1">500+</div>
              <div className="text-xs text-muted-foreground font-medium">Providers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-0" />
    </section>
  );
};

export default Hero;
