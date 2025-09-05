import React from 'react';
import Icon from '../../../components/AppIcon';

const SocialProof = () => {
  const stats = [
    { label: 'Active Subscribers', value: '2,847', icon: 'Users' },
    { label: 'Monthly Readers', value: '12.5K', icon: 'BookOpen' },
    { label: 'Countries Reached', value: '47', icon: 'Globe' }
  ];

  const testimonials = [
    {
      id: 1,
      content: `"The depth and vulnerability in these midnight thoughts always leaves me reflecting long after I've finished reading. It's like having a thoughtful conversation with a dear friend."`,
      author: 'Sarah Chen',
      role: 'Supporter since 2023',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face'
    },
    {
      id: 2,
      content: `"I look forward to these weekly emails more than any other newsletter. The writing is beautiful, honest, and always arrives at the perfect moment when I need it most."`,
      author: 'Michael Rodriguez',
      role: 'Free Reader',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face'
    },
    {
      id: 3,
      content: `"Supporting this writer has been one of my best decisions. The exclusive content and behind-the-scenes glimpses make me feel part of something special."`,
      author: 'Emma Thompson',
      role: 'Supporter since 2022',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Statistics */}
      <div className="text-center">
        <h3 className="font-heading font-semibold text-2xl text-foreground mb-8">
          Join Our Growing Community
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {stats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                <Icon name={stat?.icon} size={24} className="text-accent" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {stat?.value}
              </div>
              <div className="text-muted-foreground text-sm">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Testimonials */}
      <div>
        <h3 className="font-heading font-semibold text-xl text-foreground text-center mb-8">
          What Our Readers Say
        </h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials?.map((testimonial) => (
            <div 
              key={testimonial?.id}
              className="bg-card border border-border rounded-lg p-6 hover:shadow-warm transition-shadow duration-300"
            >
              <div className="flex items-start space-x-1 mb-4">
                {[...Array(5)]?.map((_, i) => (
                  <Icon 
                    key={i} 
                    name="Star" 
                    size={16} 
                    className="text-accent fill-current" 
                  />
                ))}
              </div>
              
              <blockquote className="text-card-foreground text-sm leading-relaxed mb-4">
                {testimonial?.content}
              </blockquote>
              
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial?.avatar}
                  alt={testimonial?.author}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
                <div>
                  <div className="font-medium text-card-foreground text-sm">
                    {testimonial?.author}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {testimonial?.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Trust Signals */}
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="text-center mb-6">
          <h4 className="font-heading font-semibold text-lg text-foreground mb-2">
            Trusted & Secure
          </h4>
          <p className="text-muted-foreground text-sm">
            Your privacy and data security are our top priorities
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} />
            <span className="text-sm">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Lock" size={20} />
            <span className="text-sm">SSL Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Mail" size={20} />
            <span className="text-sm">Powered by Mailchimp</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="CreditCard" size={20} />
            <span className="text-sm">Secure Payments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialProof;