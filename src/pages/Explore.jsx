import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStories } from '../context/StoriesContext';
import StoryCard from '../components/story/StoryCard';
import { BookX, Search, Filter } from 'lucide-react';

const Explore = () => {
  const { stories } = useStories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const filteredStories = stories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.params.prompt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || story.params.storyType === filterType;
    
    return matchesSearch && matchesType;
  });
  
  const storyTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'adventure', label: 'Adventure' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'moral', label: 'Moral' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'historical', label: 'Historical' },
    { value: 'educational', label: 'Educational' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Explore Stories
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Discover stories created by the community or browse your own creations.
        </p>
      </motion.div>

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search stories..."
            className="input-field pl-10"
          />
        </div>
        
        <div className="relative md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={18} className="text-slate-400" />
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="input-field pl-10"
          >
            {storyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <BookX size={64} className="text-slate-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No stories found</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-md">
            {stories.length === 0
              ? "You haven't created any stories yet. Go to the Create Story page to get started!"
              : "No stories match your current search and filter settings. Try adjusting your criteria."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default Explore;