import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import AuthorBio from './components/AuthorBio';
import ContactForm from './components/ContactForm';
import SocialConnect from './components/SocialConnect';
import Icon from '../../components/AppIcon';


const AboutContact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>About Ismail Ismail - The Longform.</title>
        <meta 
          name="description" 
          content="Meet Ismail Ismail, the writer behind The Longform. Discover his story, writing philosophy, and connect through various channels for meaningful conversations." 
        />
        <meta name="keywords" content="Ismail Ismail, writer, poet, longform, about author, contact writer" />
        <meta property="og:title" content="About Ismail Ismail - The Longform." />
        <meta property="og:description" content="Meet the writer behind The Longform and discover his journey of authentic expression and meaningful connection." />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Ismail Ismail - The Longform." />
        <meta name="twitter:description" content="Meet the writer behind The Longform and discover his journey of authentic expression." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section with Breadcrumb */}
        <section className="pt-20 lg:pt-24 pb-8 bg-gradient-to-br from-accent/5 to-primary/5">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <nav className="flex items-center justify-center space-x-2 text-sm text-muted-foreground mb-6">
                <span>Home</span>
                <Icon name="ChevronRight" size={16} />
                <span className="text-foreground">About & Contact</span>
              </nav>
              
              <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4">
                About & Contact
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                The person behind the midnight musings, and how you can connect with me for meaningful conversations.
              </p>
            </div>
          </div>
        </section>

        {/* Author Bio Section */}
        <AuthorBio />

        {/* Contact Form Section */}
        <ContactForm />

        {/* Social Connect Section */}
        <SocialConnect />

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Icon name="Moon" size={24} className="text-accent" />
                <span className="font-heading font-semibold text-xl">The Longform.</span>
              </div>
              
              <p className="text-primary-foreground/80 mb-6 leading-relaxed">
                A sanctuary for authentic expression and meaningful connection through the written word.
              </p>
              
              <div className="flex items-center justify-center space-x-6 mb-8">
                <button 
                  onClick={() => window.open('https://twitter.com/midnightthoughts', '_blank')}
                  className="text-primary-foreground/60 hover:text-accent transition-colors duration-200"
                >
                  <Icon name="Twitter" size={20} />
                </button>
                <button 
                  onClick={() => window.open('https://instagram.com/midnightthoughts', '_blank')}
                  className="text-primary-foreground/60 hover:text-accent transition-colors duration-200"
                >
                  <Icon name="Instagram" size={20} />
                </button>
                <button 
                  onClick={() => window.open('https://linkedin.com/in/elena-rodriguez-writer', '_blank')}
                  className="text-primary-foreground/60 hover:text-accent transition-colors duration-200"
                >
                  <Icon name="Linkedin" size={20} />
                </button>
                <button 
                  onClick={() => window.location.href = 'mailto:elena@midnightthoughts.com'}
                  className="text-primary-foreground/60 hover:text-accent transition-colors duration-200"
                >
                  <Icon name="Mail" size={20} />
                </button>
              </div>
              
              <div className="border-t border-primary-foreground/20 pt-6">
                <p className="text-sm text-primary-foreground/60">
                  © {new Date()?.getFullYear()} The Longform. All rights reserved. | 
                  <span className="ml-1">Made with ❤️ for fellow night thinkers</span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default AboutContact;