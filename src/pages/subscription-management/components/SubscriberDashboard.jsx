import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const SubscriberDashboard = ({ subscriber, onUpdatePreferences, onUnsubscribe }) => {
  const [preferences, setPreferences] = useState({
    emailFrequency: subscriber?.emailFrequency || 'weekly',
    contentTypes: subscriber?.contentTypes || ['posts', 'updates'],
    digestFormat: subscriber?.digestFormat || 'summary'
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  const formatOptions = [
    { value: 'summary', label: 'Summary with excerpts' },
    { value: 'full', label: 'Full post content' },
    { value: 'links', label: 'Links only' }
  ];

  const contentTypeOptions = [
    { id: 'posts', label: 'New Posts', description: 'Get notified about new blog posts' },
    { id: 'updates', label: 'Author Updates', description: 'Behind-the-scenes and personal updates' },
    { id: 'exclusive', label: 'Exclusive Content', description: 'Subscriber-only posts and early access', disabled: subscriber?.tier === 'free' }
  ];

  const handlePreferenceChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleContentTypeChange = (typeId, checked) => {
    setPreferences(prev => ({
      ...prev,
      contentTypes: checked 
        ? [...prev?.contentTypes, typeId]
        : prev?.contentTypes?.filter(id => id !== typeId)
    }));
  };

  const handleSavePreferences = async () => {
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdatePreferences(preferences);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Subscription Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              Subscription Status
            </h3>
            <p className="text-muted-foreground text-sm">
              Manage your subscription and preferences
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscriber?.tier === 'supporter' ?'bg-accent/10 text-accent-foreground' :'bg-muted text-muted-foreground'
          }`}>
            {subscriber?.tier === 'supporter' ? 'Supporter' : 'Free Reader'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Email:</span>
            <span className="ml-2 text-card-foreground">{subscriber?.email}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Subscribed:</span>
            <span className="ml-2 text-card-foreground">{subscriber?.subscribedDate}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Status:</span>
            <span className="ml-2 text-success">Active</span>
          </div>
          <div>
            <span className="text-muted-foreground">Next billing:</span>
            <span className="ml-2 text-card-foreground">
              {subscriber?.tier === 'supporter' ? 'January 14, 2025' : 'N/A'}
            </span>
          </div>
        </div>

        {subscriber?.tier === 'free' && (
          <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Crown" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-card-foreground mb-1">
                  Upgrade to Supporter
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Get exclusive content, early access, and support independent writing for just $5/month.
                </p>
                <Button variant="outline" size="sm">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Email Preferences */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-4">
          Email Preferences
        </h3>

        <div className="space-y-6">
          <Select
            label="Email Frequency"
            description="How often would you like to receive emails?"
            options={frequencyOptions}
            value={preferences?.emailFrequency}
            onChange={(value) => handlePreferenceChange('emailFrequency', value)}
          />

          <Select
            label="Digest Format"
            description="Choose how you'd like to receive content"
            options={formatOptions}
            value={preferences?.digestFormat}
            onChange={(value) => handlePreferenceChange('digestFormat', value)}
          />

          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Content Types
            </label>
            <div className="space-y-3">
              {contentTypeOptions?.map((option) => (
                <Checkbox
                  key={option?.id}
                  label={option?.label}
                  description={option?.description}
                  checked={preferences?.contentTypes?.includes(option?.id)}
                  onChange={(e) => handleContentTypeChange(option?.id, e?.target?.checked)}
                  disabled={option?.disabled}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-border">
          <Button
            variant="default"
            onClick={handleSavePreferences}
            loading={isUpdating}
            disabled={isUpdating}
            iconName="Save"
            iconPosition="left"
          >
            Save Preferences
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location?.reload()}
            disabled={isUpdating}
          >
            Reset to Defaults
          </Button>
        </div>
      </div>
      {/* Danger Zone */}
      <div className="bg-card border border-destructive/20 rounded-lg p-6">
        <h3 className="font-heading font-semibold text-lg text-destructive mb-2">
          Danger Zone
        </h3>
        <p className="text-muted-foreground text-sm mb-4">
          These actions cannot be undone. Please proceed with caution.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {subscriber?.tier === 'supporter' && (
            <Button variant="outline" size="sm">
              Downgrade to Free
            </Button>
          )}
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onUnsubscribe}
          >
            Unsubscribe from All Emails
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriberDashboard;