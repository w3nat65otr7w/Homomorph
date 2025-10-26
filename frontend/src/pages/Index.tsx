import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ComputeMarket from '@/components/ComputeMarket';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Stats from '@/components/Stats';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ComputeMarket />
        <Features />
        <HowItWorks />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
