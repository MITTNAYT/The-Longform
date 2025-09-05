import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e?.preventDefault();
    if (!newsletterEmail) return;

    setIsSubscribing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubscriptionSuccess(true);
    setNewsletterEmail('');
    setIsSubscribing(false);
    
    // Reset success message after 3 seconds
    setTimeout(() => setSubscriptionSuccess(false), 3000);
  };

  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    explore: [
      { label: 'Latest Posts', href: '/homepage' },
      { label: 'Categories', href: '/homepage' },
      { label: 'Archives', href: '/homepage' },
      { label: 'Search', href: '/homepage' }
    ],
    connect: [
      { label: 'About', href: '/about-contact' },
      { label: 'Contact', href: '/about-contact' },
      { label: 'Subscribe', href: '/subscription-management' },
      { label: 'RSS Feed', href: '/homepage' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/homepage' },
      { label: 'Terms of Service', href: '/homepage' },
      { label: 'Cookie Policy', href: '/homepage' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
    { name: 'Email', icon: 'Mail', href: 'mailto:hello@midnightthoughts.com' }
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-border">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="font-heading text-2xl font-bold text-card-foreground mb-3">
              Never Miss a Midnight Thought
            </h3>
            <p className="text-muted-foreground mb-6">
              Get our latest reflections, poetry, and essays delivered to your inbox weekly.
            </p>
            
            {subscriptionSuccess ? (
              <div className="flex items-center justify-center gap-2 text-success">
                <Icon name="Check" size={20} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e?.target?.value)}
                  disabled={isSubscribing}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  variant="default"
                  loading={isSubscribing}
                  disabled={isSubscribing || !newsletterEmail}
                  iconName="Send"
                  iconPosition="right"
                >
                  Subscribe
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <Link to="/homepage" className="flex items-center gap-3 mb-4">
                <Icon name="Moon" size={28} className="text-primary" />
                <span className="font-heading font-bold text-xl text-card-foreground">
                  Midnight Thoughts
                </span>
              </Link>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                A sanctuary for intimate reflections, poetry, and essays that emerge in the quiet hours when the world sleeps and souls speak.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks?.map((social) => (
                  <Button
                    key={social?.name}
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9"
                    asChild
                  >
                    <a href={social?.href} target="_blank" rel="noopener noreferrer">
                      <Icon name={social?.icon} size={18} />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Explore Links */}
            <div>
              <h4 className="font-heading font-semibold text-card-foreground mb-4">
                Explore
              </h4>
              <ul className="space-y-3">
                {footerLinks?.explore?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      to={link?.href}
                      className="text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect Links */}
            <div>
              <h4 className="font-heading font-semibold text-card-foreground mb-4">
                Connect
              </h4>
              <ul className="space-y-3">
                {footerLinks?.connect?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      to={link?.href}
                      className="text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-heading font-semibold text-card-foreground mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks?.legal?.map((link) => (
                  <li key={link?.label}>
                    <Link
                      to={link?.href}
                      className="text-muted-foreground hover:text-card-foreground transition-colors duration-200 text-sm"
                    >
                      {link?.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Midnight Thoughts. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for thoughtful readers</span>
              <div className="flex items-center gap-1">
                <Icon name="Users" size={14} />
                <span>2,847 subscribers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;