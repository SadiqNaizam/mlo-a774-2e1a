import React from 'react';
import { Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const AppFooter: React.FC = () => {
  console.log('AppFooter loaded');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground px-4 md:px-6">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Cloud className="h-5 w-5 text-blue-600" />
          <span className="font-semibold">AzureLite</span>
          <p className="ml-2">&copy; {currentYear} AzureLite. All rights reserved.</p>
        </div>
        <nav className="flex gap-4 sm:gap-6">
          <Link to="/terms" className="hover:text-primary transition-colors"> {/* Placeholder route */}
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-primary transition-colors"> {/* Placeholder route */}
            Privacy Policy
          </Link>
          <Link to="/support" className="hover:text-primary transition-colors"> {/* Placeholder route */}
            Support
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default AppFooter;