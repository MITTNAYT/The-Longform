import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const EmailSignupForm = ({ tier = 'free', onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    agreedToTerms: false,
    marketingConsent: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData?.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData?.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and privacy policy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSubmit({ ...formData, tier });
    } catch (error) {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
          <Icon name="Mail" size={24} className="text-accent" />
        </div>
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-2">
          {tier === 'supporter' ? 'Become a Supporter' : 'Join Our Community'}
        </h3>
        <p className="text-muted-foreground text-sm">
          {tier === 'supporter' ?'Support independent writing and get exclusive access' :'Get weekly updates and never miss a story'
          }
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
          value={formData?.name}
          onChange={(e) => handleInputChange('name', e?.target?.value)}
          error={errors?.name}
          required
          disabled={isLoading}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          value={formData?.email}
          onChange={(e) => handleInputChange('email', e?.target?.value)}
          error={errors?.email}
          required
          disabled={isLoading}
        />

        <div className="space-y-3">
          <Checkbox
            label="I agree to the Terms of Service and Privacy Policy"
            checked={formData?.agreedToTerms}
            onChange={(e) => handleInputChange('agreedToTerms', e?.target?.checked)}
            error={errors?.agreedToTerms}
            required
            disabled={isLoading}
          />

          <Checkbox
            label="Send me marketing emails about new features and content"
            description="You can unsubscribe at any time"
            checked={formData?.marketingConsent}
            onChange={(e) => handleInputChange('marketingConsent', e?.target?.checked)}
            disabled={isLoading}
          />
        </div>

        {errors?.submit && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
            {errors?.submit}
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          iconName="ArrowRight"
          iconPosition="right"
        >
          {isLoading 
            ? 'Processing...' 
            : tier === 'supporter' ?'Subscribe for $5/month' :'Subscribe for Free'
          }
        </Button>
      </form>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} />
            <span>GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Lock" size={12} />
            <span>Secure</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Mail" size={12} />
            <span>No Spam</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailSignupForm;