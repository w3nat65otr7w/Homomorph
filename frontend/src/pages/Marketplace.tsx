import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComputeMarket from '@/components/ComputeMarket';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Marketplace = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="text-foreground">Computing Power</span>
                <br />
                <span className="bg-gradient-primary bg-clip-text text-transparent">Marketplace</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Browse and rent computing resources with full encryption guarantees
              </p>
            </div>

            {/* Search & Filters */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by hardware type, provider, or specs..."
                    className="pl-10 h-12 bg-background/50"
                  />
                </div>

                {/* Sort */}
                <Select defaultValue="price-low">
                  <SelectTrigger className="w-full md:w-48 h-12 bg-background/50">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>

                {/* Filter Button */}
                <Button
                  variant="outline"
                  className="h-12 px-6 border-primary/40 hover:border-primary hover:bg-primary/10"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-primary/20 hover:bg-primary/30 text-primary border-primary/40"
                >
                  GPU Computing
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="hover:bg-secondary"
                >
                  CPU Clusters
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="hover:bg-secondary"
                >
                  Storage Nodes
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="hover:bg-secondary"
                >
                  Enterprise Grade
                </Button>
              </div>
            </Card>
          </div>
        </section>

        {/* Market Listings */}
        <ComputeMarket />
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;
