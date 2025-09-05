import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SubscriptionFAQ = () => {
  const [openItems, setOpenItems] = useState(new Set([0])); // First item open by default

  const faqItems = [
    {
      question: "What's the difference between Free and Supporter subscriptions?",
      answer: `Free subscribers receive weekly email digests with our latest posts and can access our public archive. Supporters get everything free subscribers do, plus exclusive subscriber-only content, early access to new posts (48 hours before public release), direct email communication with the author, monthly behind-the-scenes updates, and an ad-free reading experience.`
    },
    {
      question: "How often will I receive emails?",
      answer: `Free subscribers receive one weekly digest every Sunday morning with the week's posts and updates. Supporters can choose between daily, weekly, or monthly digests, plus they receive exclusive content notifications and behind-the-scenes updates. You can adjust your email frequency preferences anytime from your subscriber dashboard.`
    },
    {
      question: "Can I cancel my Supporter subscription anytime?",
      answer: `Absolutely! You can cancel your Supporter subscription at any time with no questions asked. If you cancel, you'll continue to have Supporter access until the end of your current billing period, then automatically switch to our Free subscription tier. No content access is lost - you'll just return to the free tier benefits.`
    },
    {
      question: "What payment methods do you accept?",
      answer: `We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. All payments are processed securely through Stripe, and we never store your payment information on our servers. You'll receive email receipts for all transactions.`
    },
    {
      question: "Is my personal information safe?",
      answer: `Yes, your privacy is our top priority. We're GDPR compliant and only collect the minimum information needed to deliver your subscription. We never sell, rent, or share your email address with third parties. You can view, update, or delete your data anytime from your subscriber dashboard.`
    },
    {
      question: "What if I'm not satisfied with my Supporter subscription?",
      answer: `We offer a 30-day money-back guarantee for new Supporter subscribers. If you're not completely satisfied within your first month, contact us and we'll provide a full refund, no questions asked. We're confident you'll love the exclusive content and community experience.`
    },
    {
      question: "Can I change my email preferences?",
      answer: `Yes! You have complete control over your email preferences. From your subscriber dashboard, you can adjust email frequency (daily, weekly, monthly), choose content types (posts, updates, exclusive content), select digest format (summary, full content, or links only), and manage your subscription status.`
    },
    {
      question: "Do you offer student or international discounts?",
      answer: `We understand that $5/month might be challenging for some readers. While we don't have formal discount programs, we occasionally offer limited-time promotions. Follow us on social media or join our free subscription to be notified of any special offers. We're also exploring regional pricing for international subscribers.`
    }
  ];

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems?.has(index)) {
      newOpenItems?.delete(index);
    } else {
      newOpenItems?.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="font-heading font-semibold text-2xl text-foreground mb-3">
          Frequently Asked Questions
        </h3>
        <p className="text-muted-foreground">
          Everything you need to know about subscriptions and our community
        </p>
      </div>
      <div className="space-y-4">
        {faqItems?.map((item, index) => (
          <div 
            key={index}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/30 transition-colors duration-200"
            >
              <h4 className="font-medium text-card-foreground pr-4">
                {item?.question}
              </h4>
              <Icon 
                name={openItems?.has(index) ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-muted-foreground flex-shrink-0 transition-transform duration-200"
              />
            </button>
            
            {openItems?.has(index) && (
              <div className="px-6 pb-4">
                <div className="pt-2 border-t border-border">
                  <p className="text-muted-foreground leading-relaxed">
                    {item?.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">
          Still have questions? We're here to help.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a 
            href="mailto:hello@midnightthoughts.com"
            className="inline-flex items-center justify-center px-4 py-2 bg-accent/10 text-accent-foreground rounded-lg hover:bg-accent/20 transition-colors duration-200"
          >
            <Icon name="Mail" size={16} className="mr-2" />
            Email Support
          </a>
          <a 
            href="/about-contact"
            className="inline-flex items-center justify-center px-4 py-2 border border-border text-card-foreground rounded-lg hover:bg-muted/50 transition-colors duration-200"
          >
            <Icon name="MessageCircle" size={16} className="mr-2" />
            Contact Form
          </a>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionFAQ;