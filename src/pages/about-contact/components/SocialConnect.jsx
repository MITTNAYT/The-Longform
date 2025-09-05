import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import NewsletterSignup from '../../../components/ui/NewsletterSignup';

const SocialConnect = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      icon: 'Twitter',
      url: 'https://twitter.com/midnightthoughts',
      description: 'Daily musings and writing updates',
      followers: '2.3K'
    },
    {
      name: 'Instagram',
      icon: 'Instagram',
      url: 'https://instagram.com/midnightthoughts',
      description: 'Behind-the-scenes writing moments',
      followers: '1.8K'
    },
    {
      name: 'LinkedIn',
      icon: 'Linkedin',
      url: 'https://linkedin.com/in/elena-rodriguez-writer',
      description: 'Professional writing journey',
      followers: '950'
    },
    {
      name: 'Goodreads',
      icon: 'BookOpen',
      url: 'https://goodreads.com/elena-rodriguez',
      description: 'Reading recommendations and reviews',
      followers: '1.2K'
    }
  ];

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Stay Connected
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Join me across different platforms where I share daily thoughts, writing insights, and connect with fellow midnight philosophers.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {socialLinks?.map((social, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-warm transition-all duration-300 group cursor-pointer"
                onClick={() => handleSocialClick(social?.url)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center group-hover:bg-accent/20 transition-colors duration-200">
                      <Icon name={social?.icon} size={24} className="text-accent" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-heading font-semibold text-card-foreground group-hover:text-accent transition-colors duration-200">
                        {social?.name}
                      </h3>
                      <span className="text-xs font-caption text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {social?.followers} followers
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {social?.description}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Icon 
                      name="ExternalLink" 
                      size={16} 
                      className="text-muted-foreground group-hover:text-accent transition-colors duration-200" 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="max-w-xl mx-auto">
            <NewsletterSignup />
          </div>

          {/* Alternative Contact Methods */}
          <div className="mt-16 pt-12 border-t border-border">
            <div className="text-center mb-8">
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
                Other Ways to Connect
              </h3>
              <p className="text-muted-foreground">
                Prefer a different approach? Here are more ways to reach out.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <Icon name="Mail" size={24} className="text-accent mx-auto mb-3" />
                <h4 className="font-medium text-card-foreground mb-2">Email</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  For longer conversations and collaborations
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = 'mailto:elena@midnightthoughts.com'}
                >
                  elena@midnightthoughts.com
                </Button>
              </div>

              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <Icon name="Calendar" size={24} className="text-accent mx-auto mb-3" />
                <h4 className="font-medium text-card-foreground mb-2">Virtual Coffee</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Schedule a 30-minute chat about writing
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://calendly.com/elena-rodriguez', '_blank')}
                >
                  Book a Call
                </Button>
              </div>

              <div className="text-center p-6 bg-card border border-border rounded-lg">
                <Icon name="MessageSquare" size={24} className="text-accent mx-auto mb-3" />
                <h4 className="font-medium text-card-foreground mb-2">Community</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Join our Discord for real-time discussions
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://discord.gg/midnightthoughts', '_blank')}
                >
                  Join Discord
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialConnect;