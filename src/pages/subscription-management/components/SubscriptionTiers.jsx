import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubscriptionTiers = ({ onSubscribe }) => {
  const tiers = [
    {
      id: 'free',
      name: 'Free Reader',
      price: '$0',
      period: 'forever',
      description: 'Perfect for discovering thoughtful content',
      features: [
        'Weekly email digest with latest posts',
        'New post notifications',
        'Access to public archive',
        'Comment on posts',
        'Mobile-optimized reading experience'
      ],
      buttonText: 'Start Reading',
      buttonVariant: 'outline',
      popular: false
    },
    {
      id: 'supporter',
      name: 'Supporter',
      price: '$5',
      period: 'per month',
      description: 'Support independent writing and get exclusive access',
      features: [
        'Everything in Free Reader',
        'Exclusive subscriber-only posts',
        'Early access to new content (48 hours)',
        'Direct email communication with author',
        'Monthly behind-the-scenes updates',
        'Ad-free reading experience',
        'Priority support'
      ],
      buttonText: 'Become a Supporter',
      buttonVariant: 'default',
      popular: true
    }
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {tiers?.map((tier) => (
        <div
          key={tier?.id}
          className={`relative bg-card border rounded-lg p-6 transition-all duration-300 hover:shadow-warm ${
            tier?.popular 
              ? 'border-accent shadow-warm scale-105' 
              : 'border-border hover:border-accent/50'
          }`}
        >
          {tier?.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="font-heading font-semibold text-xl text-card-foreground mb-2">
              {tier?.name}
            </h3>
            <div className="mb-3">
              <span className="text-3xl font-bold text-primary">{tier?.price}</span>
              <span className="text-muted-foreground ml-1">/{tier?.period}</span>
            </div>
            <p className="text-muted-foreground text-sm">
              {tier?.description}
            </p>
          </div>

          <ul className="space-y-3 mb-8">
            {tier?.features?.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Icon 
                  name="Check" 
                  size={16} 
                  className="text-success mt-0.5 flex-shrink-0" 
                />
                <span className="text-sm text-card-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant={tier?.buttonVariant}
            fullWidth
            onClick={() => onSubscribe(tier?.id)}
            className="font-medium"
          >
            {tier?.buttonText}
          </Button>

          {tier?.id === 'supporter' && (
            <p className="text-xs text-muted-foreground text-center mt-3">
              Cancel anytime. No questions asked.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SubscriptionTiers;