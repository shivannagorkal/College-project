import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebook as Facebook, FaInstagram as Instagram, FaYoutube as Youtube } from 'react-icons/fa';
import {
  COLLEGE_NAME,
  COLLEGE_LOCATION,
  COLLEGE_PHONE,
  COLLEGE_EMAIL,
  COLLEGE_FOUNDED,
  NAV_LINKS,
} from '@/utils/constants';
import { siteSettingsService } from '@/services/siteSettingsService';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState({
    collegeName: COLLEGE_NAME,
    address: COLLEGE_LOCATION,
    phone: COLLEGE_PHONE,
    email: COLLEGE_EMAIL,
    foundedYear: COLLEGE_FOUNDED,
    facebook: '',
    instagram: '',
    youtube: '',
    tagline: '',
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await siteSettingsService.getSettings();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="bg-secondary-foreground text-secondary mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* College Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{settings.collegeName}</h3>
            <p className="text-sm text-gray-600 mb-4">
              {settings.tagline || 'One of the top PU colleges in Koppala district, offering quality education in Science and Commerce streams.'}
            </p>
            <p className="text-xs text-gray-500">Established in {settings.foundedYear}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.slice(0, 6).map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="hover:text-primary transition">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold mb-4 text-primary">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 text-primary shrink-0" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary transition">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary transition">
                  {settings.email}
                </a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-4 mt-4">
              {settings.facebook && (
                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings.instagram && (
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings.youtube && (
                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6 text-center text-sm text-gray-600">
          <p>
            Copyright © {settings.foundedYear} - {currentYear} {settings.collegeName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
