import React from 'react';
import { Link } from 'react-router-dom';
import NotionIllustration from '../../../components/NotionIllustration';

const ThematicFeature = () => {
  const mainStory = {
    slug: "the-weight-of-words",
    title: "The Weight of Words in a Fragmented Epoch",
    excerpt: "Every word carries the gravity of intention. In an era where sentences evaporate into algorithmic feeds, we pause to examine the enduring sanctuary of patient, deliberate prose.",
    topics: ["Writing Craft", "Linguistic Philosophy"],
    illustration: "typewriter-craft"
  };

  const sideStories = [
    {
      slug: "letters-to-my-younger-self",
      title: "Letters to My Younger Self: On The Discipline of Patience",
      excerpt: "If I could whisper across time to the person I once was, what counsel would I offer? That the journey is slow, but its quietest turns hold the deepest truth.",
      topics: ["Personal History", "Epistles"],
      illustration: "letters-desk"
    },
    {
      slug: "architecture-of-silence",
      title: "The Architecture of Deep Silence",
      excerpt: "Silence is not merely an absence of noise; it is a spiritual chamber we construct through intentional boundaries and literary solitude.",
      topics: ["Philosophy", "Quietude"],
      illustration: "architecture-silence"
    }
  ];

  return (
    <section className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 py-14 lg:py-20 border-t border-[#E0D9CE]">
      {/* Intro Header */}
      <div className="pb-8 border-b border-[#E0D9CE] mb-10">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#9C6B3C] block mb-1">
          CURATED THEMATIC FOCUS
        </span>
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1C1917]">
          The Craft of Prose & Poetry
        </h2>
        <p className="font-sans text-sm sm:text-base text-[#78716C] mt-2 max-w-xl font-light">
          An exploration of poetic form, intimate diaries, and the quiet devotion required to capture the fleeting movements of human consciousness.
        </p>
      </div>

      {/* Asymmetric 2-Column Grid (Atmos exact layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Main Prominent Story (7 cols) */}
        <div className="lg:col-span-7 space-y-4 group">
          <Link
            to={`/post/${mainStory.slug}`}
            className="block aspect-[4/3] overflow-hidden bg-[#FDFCF9] border border-[#E0D9CE]"
          >
            <div className="w-full h-full transform group-hover:scale-[1.02] transition-transform duration-700 ease-out">
              <NotionIllustration name={mainStory.illustration} aspect="w-full h-full" />
            </div>
          </Link>

          <div className="space-y-2">
            <Link to={`/post/${mainStory.slug}`} className="block">
              <h3 className="font-heading text-2xl sm:text-3xl font-normal text-[#1C1917] leading-snug group-hover:underline decoration-1 underline-offset-4">
                {mainStory.title}
              </h3>
            </Link>

            <p className="font-sans text-sm sm:text-base text-[#44372A]/85 leading-relaxed font-light">
              {mainStory.excerpt}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {mainStory.topics.map((t, i) => (
                <span key={i} className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#78716C]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stacked Side Stories (5 cols) */}
        <div className="lg:col-span-5 space-y-12">
          {sideStories.map((story, i) => (
            <div key={i} className="space-y-3 group">
              <Link
                to={`/post/${story.slug}`}
                className="block aspect-[16/10] overflow-hidden bg-[#FDFCF9] border border-[#E0D9CE]"
              >
                <div className="w-full h-full transform group-hover:scale-[1.02] transition-transform duration-700 ease-out">
                  <NotionIllustration name={story.illustration} aspect="w-full h-full" />
                </div>
              </Link>

              <div className="space-y-1.5">
                <Link to={`/post/${story.slug}`} className="block">
                  <h4 className="font-heading text-xl sm:text-2xl font-normal text-[#1C1917] leading-snug group-hover:underline decoration-1 underline-offset-4">
                    {story.title}
                  </h4>
                </Link>

                <p className="font-sans text-sm text-[#44372A]/85 leading-relaxed font-light line-clamp-2">
                  {story.excerpt}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  {story.topics.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#78716C]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ThematicFeature;
