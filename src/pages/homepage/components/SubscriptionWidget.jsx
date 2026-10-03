import React, { useState } from 'react';
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
        'Weekly curated dispatches',
        'Full public essay access',
        'Reader discussions'
      ]
    },
    {
      id: 'supporter',
      name: 'Sustaining Patron',
      price: '$5',
      period: 'mo',
      badge: 'SUPPORT',
      features: [
        'All Free benefits',
        'Archival special issues',
        'Direct correspondence with writers',
        'Print edition discounts'
      ]
    }
  ];

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(email)) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsSubscribed(true);
      setEmail('');
    } catch (err) {
      setError('Subscription error. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 text-center space-y-3">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#3F6212] block">
          SUBSCRIPTION CONFIRMED
        </span>
        <h3 className="font-heading text-xl font-normal text-[#1C1917]">
          Welcome to The Longform
        </h3>
        <p className="font-body text-xs text-[#78716C] leading-relaxed">
          You are now enrolled in our weekly Sunday dispatch. We look forward to sharing our next edition with you.
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="font-mono text-[10px] tracking-widest uppercase text-[#9C6B3C] underline pt-2"
        >
          Subscribe another address
        </button>
      </div>
    );
  }

  return (
    <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 space-y-5">
      <div className="pb-3 border-b border-[#E0D9CE]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#9C6B3C] block mb-1">
          INDEPENDENT PRESS
        </span>
        <h3 className="font-heading text-lg font-normal text-[#1C1917]">
          Become a Reader
        </h3>
        <p className="font-body text-xs text-[#78716C] mt-1 leading-relaxed">
          Support quiet, deliberate journalism without advertising or tracking algorithms.
        </p>
      </div>

      {/* Tier Selection */}
      <div className="space-y-2.5">
        {subscriptionTiers.map((tier) => (
          <div
            key={tier.id}
            onClick={() => setSelectedTier(tier.id)}
            className={`border p-3.5 cursor-pointer transition-all ${
              selectedTier === tier.id
                ? 'border-[#1C1917] bg-[#F3EFE8]'
                : 'border-[#E0D9CE] bg-transparent hover:border-[#C4A882]'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs font-semibold tracking-wider text-[#1C1917] uppercase">
                {tier.name}
              </span>
              <span className="font-mono text-xs text-[#9C6B3C]">
                {tier.price}/{tier.period}
              </span>
            </div>
            <ul className="space-y-1">
              {tier.features.slice(0, 2).map((feat, i) => (
                <li key={i} className="font-body text-[11px] text-[#78716C] flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-[#9C6B3C]" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your.email@example.com"
          className="w-full px-3 py-2.5 bg-transparent border border-[#E0D9CE] font-mono text-xs text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#1C1917]"
        />
        {error && (
          <div className="font-mono text-[10px] text-[#991B1B]">{error}</div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-[#1C1917] text-[#F8F5F0] font-mono text-xs uppercase tracking-[0.16em] hover:bg-[#44372A] transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Confirming...' : 'Enroll in Dispatch'}
        </button>
      </form>
    </div>
  );
};

export default SubscriptionWidget;