import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { COLLEGE_SHORT_NAME, NAV_LINKS } from '@/utils/constants';
import { useAuth } from '@/hooks/useAuth';
import { siteSettingsService } from '@/services/siteSettingsService';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collegeName, setCollegeName] = useState(COLLEGE_SHORT_NAME);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await siteSettingsService.getSettings();
        if (data.collegeName) {
          setCollegeName(data.collegeName);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const isActive = (href) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg shadow-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and College Name */}
          <Link to="/" className="flex items-center gap-3 font-bold text-lg hover:opacity-90 transition">
            <div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center text-primary font-bold">
              AK
            </div>
            <span className="hidden sm:inline truncate"> AKRD </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded transition ${
                  isActive(link.href)
                    ? 'bg-primary-foreground text-primary'
                    : 'hover:bg-opacity-80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Admin Button & Mobile Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/admin/dashboard">
                <Button variant="secondary" size="sm" className="text-primary">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <Button variant="secondary" size="sm" className="text-primary">
                  Admin
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-primary-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75">
                <div className="flex flex-col gap-4 mt-8">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-2 rounded font-medium transition ${
                        isActive(link.href)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-secondary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
