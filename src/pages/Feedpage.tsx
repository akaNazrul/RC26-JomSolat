import React from 'react';
import { Heart, MessageCircle, ExternalLink, MapPin, Calendar } from 'lucide-react';
import igData from './data.json'; // Importing your JSON file

const Feedpage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Pusat Islam Feed
          </h1>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
            {igData.length} Updates
          </div>
        </div>
      </nav>

      {/* Main Feed */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {igData.map((post) => (
          <article 
            key={post.id} 
            className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold border border-green-200">
                  PI
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">@{post.ownerUsername}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin size={12} /> {post.locationName || "USM Penang"}
                  </p>
                </div>
              </div>
              <time className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {new Date(post.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </time>
            </div>

            {/* Media Area */}
            <div className="aspect-square bg-slate-100 relative group">
                <img 
                src={`https://images.weserv.nl/?url=${encodeURIComponent(post.displayUrl)}`} 
                alt={post.alt} 
                className="w-full h-full object-cover"
                />
            </div>

            {/* Interaction Bar */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-4 items-center">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Heart size={20} className="text-rose-500 fill-rose-50" /> {post.likesCount}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <MessageCircle size={20} className="text-sky-500" /> {post.commentsCount || 0}
                  </span>
                </div>
                <a 
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-green-600 hover:text-green-700"
                >
                  OPEN IN INSTAGRAM <ExternalLink size={14} />
                </a>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  <span className="font-bold text-slate-900 mr-2">@{post.ownerUsername}</span>
                  {post.caption}
                </p>
              </div>
            </div>
          </article>
        ))}
      </main>
    </div>
  );
};

export default Feedpage;