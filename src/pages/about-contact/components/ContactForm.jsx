import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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

    if (!formData?.subject?.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData?.message?.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData?.message?.trim()?.length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setErrors({
        submit: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="bg-card border border-border rounded-xl p-8 lg:p-12">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>
          <h3 className="font-heading font-semibold text-2xl text-card-foreground mb-4">
            Message Sent Successfully!
          </h3>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Thank you for reaching out. I read every message personally and will get back to you within 24-48 hours. Your thoughts and questions mean the world to me.
          </p>
          <Button
            variant="outline"
            onClick={() => setIsSubmitted(false)}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Send Another Message
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-6">
              <Icon name="MessageCircle" size={24} className="text-accent" />
            </div>
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Let's Connect
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              I'd love to hear from you. Whether you have a question, want to share your own midnight thoughts, or just want to say hello—every message is welcomed with warmth.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 lg:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Your Name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData?.name}
                  onChange={handleChange}
                  error={errors?.name}
                  required
                />
                
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="your.email@example.com"
                  value={formData?.email}
                  onChange={handleChange}
                  error={errors?.email}
                  required
                />
              </div>

              <Input
                label="Subject"
                type="text"
                name="subject"
                placeholder="What would you like to talk about?"
                value={formData?.subject}
                onChange={handleChange}
                error={errors?.subject}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-card-foreground">
                  Message <span className="text-destructive">*</span>
                </label>
                <textarea
                  name="message"
                  rows={6}
                  placeholder="Share your thoughts, questions, or just say hello..."
                  value={formData?.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                />
                {errors?.message && (
                  <p className="text-sm text-destructive">{errors?.message}</p>
                )}
              </div>

              {errors?.submit && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                  <p className="text-sm text-destructive">{errors?.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="default"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full"
                iconName="Send"
                iconPosition="right"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                <div className="space-y-2">
                  <Icon name="Clock" size={20} className="text-accent mx-auto" />
                  <h4 className="font-medium text-card-foreground">Response Time</h4>
                  <p className="text-sm text-muted-foreground">Usually within 24-48 hours</p>
                </div>
                <div className="space-y-2">
                  <Icon name="Shield" size={20} className="text-accent mx-auto" />
                  <h4 className="font-medium text-card-foreground">Privacy</h4>
                  <p className="text-sm text-muted-foreground">Your information is secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;