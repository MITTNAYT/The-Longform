import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import SubscriptionTiers from './components/SubscriptionTiers';
import EmailSignupForm from './components/EmailSignupForm';
import SubscriberDashboard from './components/SubscriberDashboard';
import SocialProof from './components/SocialProof';
import SubscriptionFAQ from './components/SubscriptionFAQ';
import ConfirmationFlow from './components/ConfirmationFlow';
import Icon from '../../components/AppIcon';

const SubscriptionManagement = () => {
  const [currentView, setCurrentView] = useState('tiers'); // 'tiers', 'signup', 'dashboard', 'confirmation'
  const [selectedTier, setSelectedTier] = useState(null);
  const [subscriber, setSubscriber] = useState(null);
  const [newSubscription, setNewSubscription] = useState(null);

  // Mock existing subscriber data - in real app, this would come from authentication
  const mockSubscriber = {
    email: 'reader@example.com',
    name: 'Alex Johnson',
    tier: 'supporter', // or 'free'
    subscribedDate: 'March 15, 2024',
    emailFrequency: 'weekly',
    contentTypes: ['posts', 'updates', 'exclusive'],
    digestFormat: 'summary'
  };

  useEffect(() => {
    // Check if user is already subscribed (mock logic)
    const isExistingSubscriber = localStorage.getItem('subscriber');
    if (isExistingSubscriber) {
      setSubscriber(mockSubscriber);
      setCurrentView('dashboard');
    }
  }, []);

  const handleSubscribe = (tierId) => {
    setSelectedTier(tierId);
    setCurrentView('signup');
  };

  const handleSignupSubmit = (subscriptionData) => {
    setNewSubscription(subscriptionData);
    setCurrentView('confirmation');
    
    // Mock: Save subscription to localStorage
    localStorage.setItem('subscriber', JSON.stringify(subscriptionData));
  };

  const handleUpdatePreferences = (preferences) => {
    setSubscriber(prev => ({ ...prev, ...preferences }));
    // Mock: Update preferences in localStorage
    const updatedSubscriber = { ...subscriber, ...preferences };
    localStorage.setItem('subscriber', JSON.stringify(updatedSubscriber));
  };

  const handleUnsubscribe = () => {
    if (window.confirm('Are you sure you want to unsubscribe from all emails? This action cannot be undone.')) {
      localStorage.removeItem('subscriber');
      setSubscriber(null);
      setCurrentView('tiers');
    }
  };

  const handleContinueFromConfirmation = () => {
    setSubscriber(newSubscription);
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <button
                onClick={() => setCurrentView('tiers')}
                className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
              >
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Plans
              </button>
              <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
                {selectedTier === 'supporter' ? 'Become a Supporter' : 'Join Our Community'}
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {selectedTier === 'supporter' ?'Support independent writing and get exclusive access to premium content, early previews, and direct author communication.' :'Join thousands of readers who receive thoughtful weekly updates and never miss a story.'
                }
              </p>
            </div>
            <EmailSignupForm tier={selectedTier} onSubmit={handleSignupSubmit} />
          </div>
        );

      case 'dashboard':
        return (
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="font-heading font-semibold text-3xl text-foreground mb-4">
                Subscription Dashboard
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Manage your subscription preferences and stay in control of your reading experience.
              </p>
            </div>
            <SubscriberDashboard 
              subscriber={subscriber}
              onUpdatePreferences={handleUpdatePreferences}
              onUnsubscribe={handleUnsubscribe}
            />
          </div>
        );

      case 'confirmation':
        return (
          <div className="space-y-12">
            <ConfirmationFlow 
              subscription={newSubscription}
              onContinue={handleContinueFromConfirmation}
            />
          </div>
        );

      default: // 'tiers'
        return (
          <div className="space-y-16">
            <div className="text-center">
              <h2 className="font-heading font-semibold text-3xl lg:text-4xl text-foreground mb-4">
                Choose Your Reading Experience
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                Join our community of thoughtful readers and support independent writing. 
                Choose the plan that fits your reading style and budget.
              </p>
            </div>
            
            <SubscriptionTiers onSubscribe={handleSubscribe} />
            <SocialProof />
            <SubscriptionFAQ />
          </div>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Subscription Management - The Longform.</title>
        <meta name="description" content="Join our community of thoughtful readers. Choose between free weekly updates or become a supporter for exclusive content and early access." />
        <meta name="keywords" content="subscription, newsletter, blog, writing, community, support" />
        <meta property="og:title" content="Subscription Management - The Longform." />
        <meta property="og:description" content="Support independent writing and join our community of thoughtful readers." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-16">
          {/* Hero Section */}
          <section className="relative py-16 lg:py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent"></div>
            <div className="container mx-auto px-4 lg:px-8 relative">
              {renderCurrentView()}
            </div>
          </section>

          {/* Author Commitment Section - Only show on tiers view */}
          {currentView === 'tiers' && (
            <section className="py-16 bg-muted/30">
              <div className="container mx-auto px-4 lg:px-8">
                <div className="max-w-3xl mx-auto text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
                    <Icon name="Heart" size={32} className="text-primary" />
                  </div>
                  
                  <h3 className="font-heading font-semibold text-2xl text-foreground mb-4">
                    A Personal Commitment
                  </h3>
                  
                  <blockquote className="text-muted-foreground text-lg leading-relaxed italic mb-6">
                    "Every subscriber, whether free or supporter, becomes part of a community that values 
                    thoughtful reflection over quick consumption. Your support—whether through readership 
                    or financial contribution—enables me to continue writing authentically, without the 
                    pressure of algorithms or advertising demands."
                  </blockquote>
                  
                  <div className="flex items-center justify-center space-x-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=48&h=48&fit=crop&crop=face"
                      alt="Author"
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = '/assets/images/no_image.png';
                      }}
                    />
                    <div className="text-left">
                      <div className="font-medium text-foreground">Alex Chen</div>
                      <div className="text-sm text-muted-foreground">Author & Creator</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center text-muted-foreground text-sm">
              <p>&copy; {new Date()?.getFullYear()} The Longform. All rights reserved.</p>
              <div className="flex justify-center space-x-6 mt-4">
                <a href="/privacy" className="hover:text-foreground transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="/terms" className="hover:text-foreground transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="/about-contact" className="hover:text-foreground transition-colors duration-200">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SubscriptionManagement;