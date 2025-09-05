import React from 'react';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-accent/5">
      {/* Starfield Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-accent rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-accent/60 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-accent/40 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-accent rounded-full animate-pulse delay-1500"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-accent/80 rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Where Thoughts Find Their
            <span className="text-accent block mt-2">Midnight Voice</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            A sanctuary for intimate reflections, poetry, and essays that emerge in the quiet hours when the world sleeps and souls speak.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="default" 
              size="lg"
              iconName="BookOpen"
              iconPosition="left"
              className="min-w-[180px]"
            >
              Start Reading
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              iconName="Mail"
              iconPosition="left"
              className="min-w-[180px]"
            >
              Subscribe
            </Button>
          </div>

          <div className="mt-12 text-sm text-muted-foreground">
            <p>Join 2,847 readers who find solace in midnight musings</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;