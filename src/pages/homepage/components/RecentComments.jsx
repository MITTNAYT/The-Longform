import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';

const RecentComments = () => {
  const recentComments = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      comment: "Your words about solitude really resonated with me. Finding quiet in this restless city is a daily practice.",
      postTitle: "The Art of Solitude",
      postSlug: "art-of-solitude",
      timestamp: "2h ago"
    },
    {
      id: 2,
      author: "Michael Vance",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      comment: "The passage on reclaiming attention struck a deep chord. We need more writing with this pace.",
      postTitle: "Reclaiming Attention",
      postSlug: "reclaiming-attention",
      timestamp: "5h ago"
    },
    {
      id: 3,
      author: "Elena Rostova",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      comment: "Each edition feels like an unhurried letter from an observant friend.",
      postTitle: "Letters to My Younger Self",
      postSlug: "letters-to-my-younger-self",
      timestamp: "1d ago"
    }
  ];

  return (
    <div className="border border-[#E0D9CE] bg-[#FDFCF9] p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#E0D9CE]">
        <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#1C1917] font-medium">
          Reader Dialogues
        </h3>
        <span className="font-mono text-[10px] text-[#78716C]">VOICES</span>
      </div>

      <div className="space-y-4 divide-y divide-[#EDE8E0]">
        {recentComments.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#78716C]">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 overflow-hidden border border-[#E0D9CE] bg-[#EDE8E0]">
                  <Image
                    src={item.avatar}
                    alt={item.author}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[#1C1917] font-medium">{item.author}</span>
              </div>
              <span>{item.timestamp}</span>
            </div>

            <p className="font-body text-xs text-[#44372A] leading-relaxed italic">
              "{item.comment}"
            </p>

            <Link
              to={`/post/${item.postSlug}`}
              className="font-mono text-[10px] tracking-wider uppercase text-[#9C6B3C] hover:underline block"
            >
              on {item.postTitle} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentComments;