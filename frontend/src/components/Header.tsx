import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <nav className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield className="w-8 h-8 text-primary group-hover:text-primary-glow transition-colors" />
            <div className="absolute inset-0 blur-xl bg-primary opacity-0 group-hover:opacity-50 transition-opacity" />
          </div>
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Homomorph
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/marketplace" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link to="/my-jobs" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            My Jobs
          </Link>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
        </div>

        <ConnectButton 
          chainStatus="icon"
          showBalance={false}
        />
      </nav>
    </header>
  );
};

export default Header;
