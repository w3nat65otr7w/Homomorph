import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cpu, HardDrive, Zap, TrendingUp } from 'lucide-react';
import { RentHardwareDialog } from '@/components/RentHardwareDialog';
import gpuImage from '@/assets/gpu-card.jpg';
import serverImage from '@/assets/server-rack.jpg';
import cpuImage from '@/assets/cpu-chip.jpg';

const hardwareProviders = [
  {
    image: gpuImage,
    name: 'NVIDIA RTX 5090',
    type: 'GPU Computing',
    power: '32GB VRAM',
    price: '0.0005 ETH/hr',
    performance: '125 TFLOPS',
    available: 45,
    icon: Cpu,
  },
  {
    image: serverImage,
    name: 'Enterprise Server Cluster',
    type: 'Multi-Node Computing',
    power: '512 Core CPU',
    price: '0.004 ETH/hr',
    performance: '5 PB Storage',
    available: 12,
    icon: HardDrive,
  },
  {
    image: cpuImage,
    name: 'AMD EPYC 9654',
    type: 'CPU Computing',
    power: '96 Cores',
    price: '0.0002 ETH/hr',
    performance: '3.7 GHz Boost',
    available: 28,
    icon: Zap,
  },
];

const ComputeMarket = () => {
  const [selectedHardware, setSelectedHardware] = useState<typeof hardwareProviders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRentClick = (hardware: typeof hardwareProviders[0]) => {
    setSelectedHardware(hardware);
    setDialogOpen(true);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur-sm mb-6">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Live Marketplace</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-foreground">Hardware Computing</span>
            <br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Power Market</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Rent high-performance computing resources on-demand. From GPUs to enterprise servers, 
            all with encrypted computation guarantees.
          </p>
        </div>

        {/* Hardware Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {hardwareProviders.map((hardware, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hardware Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hardware.image} 
                  alt={hardware.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Floating Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm">
                  <span className="text-xs font-bold text-white">{hardware.available} Available</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <hardware.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm text-accent font-medium">{hardware.type}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{hardware.name}</h3>
                  </div>
                </div>

                {/* Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Power</div>
                    <div className="font-semibold text-sm">{hardware.power}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Performance</div>
                    <div className="font-semibold text-sm">{hardware.performance}</div>
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Price per hour</div>
                      <div className="text-2xl font-bold text-primary">{hardware.price}</div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleRentClick(hardware)}
                    className="w-full bg-primary hover:bg-primary-glow transition-all duration-300 glow-border"
                  >
                    Rent Now
                  </Button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            </Card>
          ))}
        </div>

        {/* Market Stats */}
        <Card className="p-8 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-primary/20">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Total Providers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">15.2K</div>
              <div className="text-sm text-muted-foreground">TFLOPS Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-sm text-muted-foreground">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">$2.5M</div>
              <div className="text-sm text-muted-foreground">Volume (30d)</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Rent Hardware Dialog */}
      {selectedHardware && (
        <RentHardwareDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          hardware={selectedHardware}
        />
      )}
    </section>
  );
};

export default ComputeMarket;
