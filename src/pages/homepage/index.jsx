import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturedPost from './components/FeaturedPost';
import PostsGrid from './components/PostsGrid';
import CategoryNavigation from './components/CategoryNavigation';
import RecentComments from './components/RecentComments';
import SubscriptionWidget from './components/SubscriptionWidget';
import Footer from './components/Footer';

const Homepage = () => {
  useEffect(() => {
    // Smooth scroll to top on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <>
      <Helmet>
        <title>The Longform. - Where Thoughts Find Their Voice</title>
        <meta 
          name="description" 
          content="A sanctuary for intimate reflections, poetry, and essays that emerge in the quiet hours when the world sleeps and souls speak. Join our literary circle." 
        />
        <meta name="keywords" content="blog, poetry, essays, reflection, writing, longform, literature" />
        <meta property="og:title" content="The Longform. - Where Thoughts Find Their Voice" />
        <meta property="og:description" content="A sanctuary for intimate reflections, poetry, and essays that emerge in the quiet hours." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://thelongform.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Longform." />
        <meta name="twitter:description" content="A sanctuary for intimate reflections, poetry, and essays." />
        <link rel="canonical" href="https://thelongform.com" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 lg:pt-24">
          {/* Swiss Broadsheet Hero (Cover Essay + Digest) */}
          <HeroSection />
          
          {/* Main Content Area */}
          <div className="py-12 lg:py-16">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
                {/* Main Content */}
                <div className="lg:col-span-3 order-2 lg:order-1">
                  <PostsGrid />
                </div>
                
                {/* Sidebar */}
                <aside className="lg:col-span-1 order-1 lg:order-2">
                  <div className="sticky top-24 space-y-8">
                    <CategoryNavigation />
                    <RecentComments />
                    <SubscriptionWidget />
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Homepage;