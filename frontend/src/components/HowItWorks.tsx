import { ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Upload Encrypted Data',
    description: 'Consumers encrypt their sensitive data using FHE and upload it to the network',
    role: 'Consumer',
    color: 'primary',
  },
  {
    number: '02',
    title: 'Task Distribution',
    description: 'Smart contracts match computational tasks with available providers',
    role: 'Platform',
    color: 'accent',
  },
  {
    number: '03',
    title: 'Encrypted Computation',
    description: 'Providers process encrypted data without ever decrypting it',
    role: 'Provider',
    color: 'primary',
  },
  {
    number: '04',
    title: 'Result & Payment',
    description: 'Encrypted results are returned and payments are automatically settled',
    role: 'Platform',
    color: 'accent',
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative bg-gradient-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="bg-gradient-primary bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamless workflow from data submission to encrypted computation
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
                {/* Number Circle */}
                <div className="relative flex-shrink-0">
                  <div className={`w-24 h-24 rounded-full border-2 border-${step.color} bg-${step.color}/10 flex items-center justify-center`}>
                    <span className="text-3xl font-bold text-primary">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-primary/50 to-transparent" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                    {step.role}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <ArrowRight className="hidden md:block w-6 h-6 text-primary/50" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Flow Diagram */}
        <div className="mt-16 p-8 rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <div className="flex-1">
              <div className="text-2xl font-bold text-primary mb-2">Consumer</div>
              <div className="text-sm text-muted-foreground">Uploads Encrypted Data + Pays</div>
            </div>
            <ArrowRight className="w-8 h-8 text-accent rotate-90 md:rotate-0" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-accent mb-2">Platform</div>
              <div className="text-sm text-muted-foreground">Smart Contract Matching</div>
            </div>
            <ArrowRight className="w-8 h-8 text-accent rotate-90 md:rotate-0" />
            <div className="flex-1">
              <div className="text-2xl font-bold text-primary mb-2">Provider</div>
              <div className="text-sm text-muted-foreground">Computes on Ciphertext + Earns</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
