import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleNewsletterSubmit = async (e) => {
    e?.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribing(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setSubscriptionSuccess(true);
    setNewsletterEmail('');
    setIsSubscribing(false);
    setTimeout(() => setSubscriptionSuccess(false), 4000);
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { label: 'Latest Posts', href: '/' },
      { label: 'Discover', href: '/discover' },
      { label: 'Feed', href: '/feed' },
      { label: 'Write', href: '/write' },
    ],
    connect: [
      { label: 'About', href: '/about-contact' },
      { label: 'Contact', href: '/about-contact' },
      { label: 'Subscribe', href: '/subscription-management' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'Twitter', href: '#' },
    { name: 'Instagram', icon: 'Instagram', href: '#' },
    { name: 'LinkedIn', icon: 'Linkedin', href: '#' },
  ];

  return (
    <footer className="border-t border-border/50 bg-card">
      <div className="max-w-6xl mx-auto px-5 lg:px-8">
        {/* Newsletter Bar */}
        <div className="py-12 border-b border-border/40">
          <div className="max-w-xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 mb-5">
              <Icon name="Mail" size={18} className="text-accent" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">
              Never Miss a Story
            </h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              Weekly reflections, poetry, and essays delivered straight to your inbox.
            </p>

            {subscriptionSuccess ? (
              <div className="inline-flex items-center gap-2 text-success font-medium text-sm bg-success/10 px-4 py-2.5 rounded-full">
                <Icon name="Check" size={16} />
                <span>You're on the list — welcome!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={isSubscribing}
                  className="input-pro flex-1 !rounded-full !py-2.5"
                />
                <button
                  type="submit"
                  disabled={isSubscribing || !newsletterEmail}
                  className="btn-primary flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribing ? (
                    <Icon name="RefreshCw" size={14} className="animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main footer grid */}
        <div className="py-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Moon" size={14} className="text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                The Longform<span className="text-accent">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              A sanctuary for intimate reflections and essays that emerge in the quiet hours when the world sleeps.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/40 hover:bg-muted/50 transition-all duration-150"
                >
                  <Icon name={social.icon} size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">Explore</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">Connect</h4>
            <ul className="space-y-3">
              {footerLinks.connect.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="mt-6 p-3 rounded-xl bg-muted/40 border border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Icon name="Users" size={12} />
                <span><strong className="text-foreground font-semibold">2,847</strong> subscribers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-5 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {currentYear} The Longform. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Made with
            <span className="text-rose-400 mx-0.5">♥</span>
            for thoughtful readers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;