import React, { useState } from 'react';
import Button from './Button';
import Input from './Input';
import Icon from '../AppIcon';

const NewsletterSignup = ({ className = '', variant = 'default' }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e?.target?.value);
    if (error) setError('');
  };

  if (isSubscribed) {
    return (
      <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mb-4">
            <Icon name="Check" size={24} className="text-success" />
          </div>
          <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
            Welcome to Midnight Thoughts!
          </h3>
          <p className="text-muted-foreground text-sm">
            Thank you for subscribing. You'll receive our latest thoughts and stories directly in your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
          <Icon name="Mail" size={24} className="text-accent" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
          Join Our Literary Circle
        </h3>
        <p className="text-muted-foreground text-sm">
          Receive intimate stories and thoughtful reflections delivered to your inbox weekly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={handleEmailChange}
          error={error}
          disabled={isLoading}
          className="w-full"
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
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </Button>
      </form>

      <p className="text-xs text-muted-foreground text-center mt-4">
        No spam, ever. Unsubscribe at any time.
      </p>
    </div>
  );
};

export default NewsletterSignup;