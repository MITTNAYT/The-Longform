import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const SubscriptionWidget = () => {
  const [email, setEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState('free');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  const subscriptionTiers = [
    {
      id: 'free',
      name: 'Free Reader',
      price: '$0',
      period: 'forever',
      features: [
        'Weekly email digest',
        'Access to all public posts',
        'Comment on posts',
        'Mobile-friendly reading'
      ],
      icon: 'BookOpen',
      popular: false
    },
    {
      id: 'supporter',
      name: 'Midnight Supporter',
      price: '$5',
      period: 'month',
      features: [
        'Everything in Free',
        'Exclusive supporter-only posts',
        'Early access to new content',
        'Monthly author Q&A sessions',
        'Ad-free reading experience'
      ],
      icon: 'Crown',
      popular: true
    }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');
    
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4">
            <Icon name="Check" size={24} className="text-success" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
            Welcome to the Circle!
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Thank you for subscribing to {selectedTier === 'free' ? 'Free Reader' : 'Midnight Supporter'}. 
            You'll receive a confirmation email shortly.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSubscribed(false)}
            className="text-xs"
          >
            Subscribe Another Email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4 flex items-center gap-2">
        <Icon name="Mail" size={20} />
        Join the Literary Circle
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Receive intimate stories and thoughtful reflections delivered to your inbox.
      </p>
      {/* Subscription Tiers */}
      <div className="space-y-3 mb-6">
        {subscriptionTiers?.map((tier) => (
          <div
            key={tier?.id}
            className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedTier === tier?.id
                ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
            }`}
            onClick={() => setSelectedTier(tier?.id)}
          >
            {tier?.popular && (
              <div className="absolute -top-2 left-4">
                <span className="bg-accent text-accent-foreground text-xs px-2 py-1 rounded-full font-medium">
                  Popular
                </span>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 ${
                selectedTier === tier?.id
                  ? 'border-accent bg-accent' :'border-muted-foreground'
              }`}>
                {selectedTier === tier?.id && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name={tier?.icon} size={16} className="text-accent" />
                  <h4 className="font-semibold text-card-foreground">{tier?.name}</h4>
                  <span className="text-sm text-muted-foreground">
                    {tier?.price}/{tier?.period}
                  </span>
                </div>
                
                <ul className="text-xs text-muted-foreground space-y-1">
                  {tier?.features?.slice(0, 2)?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Icon name="Check" size={12} className="text-accent flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {tier?.features?.length > 2 && (
                    <li className="text-accent">
                      +{tier?.features?.length - 2} more features
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Subscription Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e?.target?.value)}
          error={error}
          disabled={isLoading}
        />
        
        <Button
          type="submit"
          variant="default"
          loading={isLoading}
          disabled={isLoading || !email}
          className="w-full"
          iconName="ArrowRight"
          iconPosition="right"
        >
          {isLoading 
            ? 'Subscribing...' 
            : selectedTier === 'free' ?'Subscribe Free' :'Subscribe for $5/month'
          }
        </Button>
      </form>
      <p className="text-xs text-muted-foreground text-center mt-4">
        No spam, ever. Unsubscribe at any time. 
        {selectedTier === 'supporter' && ' Cancel subscription anytime.'}
      </p>
      <div className="mt-4 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          Join 2,847 readers who find solace in midnight musings
        </p>
      </div>
    </div>
  );
};

export default SubscriptionWidget;