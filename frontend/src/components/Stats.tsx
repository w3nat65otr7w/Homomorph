import { Card } from '@/components/ui/card';
import { TrendingUp, Activity, Users, DollarSign } from 'lucide-react';

const stats = [
  {
    icon: DollarSign,
    label: 'Total Value Locked',
    value: '$2,547,890',
    change: '+12.5%',
    trend: 'up',
  },
  {
    icon: Activity,
    label: 'Compute Tasks Completed',
    value: '10,284',
    change: '+8.2%',
    trend: 'up',
  },
  {
    icon: Users,
    label: 'Active Providers',
    value: '523',
    change: '+15.3%',
    trend: 'up',
  },
  {
    icon: TrendingUp,
    label: 'Average Task Fee',
    value: '0.05 ETH',
    change: '-3.1%',
    trend: 'down',
  },
];

const Stats = () => {
  return (
    <section id="stats" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Network <span className="bg-gradient-primary bg-clip-text text-transparent">Statistics</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time metrics from our decentralized computing network
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card 
              key={index}
              className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Live Activity Feed */}
        <Card className="p-8 bg-card/30 backdrop-blur-sm border-border/50">
          <h3 className="text-2xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: 'Task completed', detail: 'ML model training on encrypted dataset', time: '2 min ago' },
              { action: 'New provider joined', detail: '100 TFLOPS compute capacity added', time: '5 min ago' },
              { action: 'Payment settled', detail: '0.5 ETH distributed to providers', time: '8 min ago' },
              { action: 'Data uploaded', detail: '2.5 GB encrypted healthcare data', time: '12 min ago' },
            ].map((activity, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <div className="font-medium">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.detail}</div>
                </div>
                <div className="text-sm text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Stats;
