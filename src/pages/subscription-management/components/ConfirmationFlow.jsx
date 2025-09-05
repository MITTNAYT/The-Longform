import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationFlow = ({ subscription, onContinue }) => {
  const nextSteps = [
    {
      icon: 'Mail',
      title: 'Check Your Email',
      description: 'We\'ve sent a confirmation email to verify your subscription. Please click the link to activate your account.'
    },
    {
      icon: 'Bell',
      title: 'Set Your Preferences',
      description: 'Customize your email frequency and content preferences from your subscriber dashboard.'
    },
    {
      icon: 'BookOpen',
      title: 'Start Reading',
      description: subscription?.tier === 'supporter' ?'Access exclusive content and early previews immediately after confirmation.' :'Browse our archive and get ready for your first weekly digest.'
    }
  ];

  const welcomeMessage = subscription?.tier === 'supporter' ? `Welcome to our inner circle! As a Supporter, you're not just a reader—you're a vital part of keeping independent writing alive. Your support means the world and enables the creation of thoughtful, authentic content.` : `Welcome to our community! You're now part of a growing circle of readers who appreciate thoughtful, reflective writing. We're excited to share our weekly journey with you.`;

  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* Success Icon */}
      <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
        <Icon name="CheckCircle" size={32} className="text-success" />
      </div>
      {/* Main Message */}
      <h2 className="font-heading font-semibold text-2xl text-foreground mb-4">
        {subscription?.tier === 'supporter' ? 'Thank You for Your Support!' : 'Welcome to Midnight Thoughts!'}
      </h2>
      <p className="text-muted-foreground leading-relaxed mb-8">
        {welcomeMessage}
      </p>
      {/* Subscription Details */}
      <div className="bg-card border border-border rounded-lg p-6 mb-8">
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
          Subscription Details
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="text-left">
            <span className="text-muted-foreground">Name:</span>
            <span className="ml-2 text-card-foreground font-medium">{subscription?.name}</span>
          </div>
          <div className="text-left">
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-2 text-card-foreground font-medium">{subscription?.email}</span>
          </div>
          <div className="text-left">
            <span className="text-muted-foreground">Plan:</span>
            <span className={`ml-2 font-medium ${
              subscription?.tier === 'supporter' ? 'text-accent' : 'text-card-foreground'
            }`}>
              {subscription?.tier === 'supporter' ? 'Supporter ($5/month)' : 'Free Reader'}
            </span>
          </div>
          <div className="text-left">
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 text-warning font-medium">Pending Confirmation</span>
          </div>
        </div>
      </div>
      {/* Next Steps */}
      <div className="text-left mb-8">
        <h3 className="font-heading font-semibold text-lg text-foreground mb-6 text-center">
          What Happens Next?
        </h3>
        
        <div className="space-y-6">
          {nextSteps?.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-10 h-10 bg-accent/10 rounded-full">
                  <Icon name={step?.icon} size={20} className="text-accent" />
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-1">
                  {step?.title}
                </h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Special Supporter Benefits */}
      {subscription?.tier === 'supporter' && (
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Icon name="Crown" size={24} className="text-accent mr-2" />
            <h3 className="font-heading font-semibold text-lg text-foreground">
              Your Supporter Benefits
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="Lock" size={16} className="text-accent" />
              <span className="text-foreground">Exclusive subscriber-only posts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} className="text-accent" />
              <span className="text-foreground">48-hour early access</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Mail" size={16} className="text-accent" />
              <span className="text-foreground">Direct author communication</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Eye" size={16} className="text-accent" />
              <span className="text-foreground">Behind-the-scenes updates</span>
            </div>
          </div>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          onClick={onContinue}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Continue to Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={() => window.open('mailto:' + subscription?.email, '_blank')}
          iconName="Mail"
          iconPosition="left"
        >
          Check Email
        </Button>
      </div>
      {/* Footer Note */}
      <p className="text-xs text-muted-foreground mt-8">
        Didn't receive the confirmation email? Check your spam folder or{' '}
        <button className="text-accent hover:underline">
          resend confirmation
        </button>
      </p>
    </div>
  );
};

export default ConfirmationFlow;