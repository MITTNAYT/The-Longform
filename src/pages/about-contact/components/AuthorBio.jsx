import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const AuthorBio = () => {
  const achievements = [
    {
      icon: "BookOpen",
      title: "Published Author",
      description: "3 poetry collections and 50+ essays"
    },
    {
      icon: "Award",
      title: "Literary Awards",
      description: "Winner of 2023 Longform Writers Prize"
    },
    {
      icon: "Users",
      title: "Community",
      description: "Over 5,000 subscribers worldwide"
    },
    {
      icon: "Coffee",
      title: "Writing Ritual",
      description: "Best thoughts emerge at 2 AM with coffee"
    }
  ];

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Author Photo and Introduction */}
          <div className="text-center mb-12">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 lg:w-40 lg:h-40 mx-auto rounded-full overflow-hidden border-4 border-accent/20 shadow-warm">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
                  alt="Ismail Ismail - Author of The Longform."
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center border-2 border-background">
                <Icon name="Feather" size={16} className="text-accent-foreground" />
              </div>
            </div>
            
            <h1 className="font-heading font-bold text-3xl lg:text-4xl text-foreground mb-4">
              Ismail Ismail
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              Writer, Poet & Longform Essayist
            </p>
          </div>

          {/* Personal Story */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="bg-card border border-border rounded-xl p-8 lg:p-12">
              <h2 className="font-heading font-semibold text-2xl lg:text-3xl text-card-foreground mb-6">
                My Story
              </h2>
              
              <div className="space-y-6 text-card-foreground leading-relaxed">
                <p>
                  Welcome to my corner of the digital world, where thoughts bloom in the quiet hours and words find their way to paper when the rest of the world sleeps. I'm Ismail, and I've been writing by moonlight for over a decade.
                </p>
                
                <p>
                  My journey began during sleepless nights in college, when I discovered that my most honest thoughts emerged in the stillness of 2 AM. What started as personal journaling evolved into poetry, then essays, and eventually this platform where I share the intimate reflections that shape our human experience.
                </p>
                
                <p>
                  I believe in the power of vulnerability in writing—that our shared struggles, dreams, and midnight revelations connect us across distances and differences. Through The Longform., I've found a community of fellow night owls and deep thinkers who understand that some truths can only be spoken in whispers.
                </p>
                
                <blockquote className="border-l-4 border-accent pl-6 italic text-muted-foreground my-8">
                  "The night doesn't just hide our secrets—it reveals our truths. In darkness, we find the courage to be authentically ourselves."
                </blockquote>
                
                <p>
                  When I'm not writing, you'll find me reading philosophy by candlelight, tending to my herb garden, or having deep conversations with strangers in 24-hour cafes. I hold an MFA in Creative Writing from Columbia University and have been featured in various literary magazines.
                </p>
              </div>
            </div>
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {achievements?.map((achievement, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 text-center hover:shadow-warm transition-shadow duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mb-4">
                  <Icon name={achievement?.icon} size={24} className="text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-card-foreground mb-2">
                  {achievement?.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {achievement?.description}
                </p>
              </div>
            ))}
          </div>

          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-8 lg:p-12 text-center">
            <Icon name="Heart" size={32} className="text-accent mx-auto mb-6" />
            <h2 className="font-heading font-semibold text-2xl lg:text-3xl text-foreground mb-6">
              My Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              To create a sanctuary for authentic expression and meaningful connection. Through honest storytelling and vulnerable sharing, I hope to remind us all that we're not alone in our midnight thoughts and that our deepest reflections deserve to be heard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorBio;