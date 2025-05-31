import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStories } from '../context/StoriesContext';
import FlipBook from '../components/story/FlipBook';
import { ArrowLeft, BookOpen, BookX, Wand2 } from 'lucide-react';

const StoryViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStoryById } = useStories();
  const [story, setStory] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const foundStory = getStoryById(id);
    if (foundStory) {
      setStory(foundStory);
      // Update page title
      document.title = `${foundStory.title} | StoryAI`;
    } else {
      setNotFound(true);
    }
    
    // Reset title when component unmounts
    return () => {
      document.title = 'StoryAI';
    };
  }, [id, getStoryById]);

  if (notFound) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <BookX className="text-red-500 mb-6" size={64} />
        <h1 className="text-3xl font-bold mb-4">Story Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8 text-center max-w-md">
          We couldn't find the story you're looking for. It may have been deleted or never existed.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="btn-primary"
        >
          Browse Stories
        </button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading story...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back</span>
        </button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          {story.title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm mb-2">
          <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
            {story.params.storyType.charAt(0).toUpperCase() + story.params.storyType.slice(1)}
          </span>
          <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300">
            Age: {story.params.ageGroup}
          </span>
          <span className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 flex items-center">
            <BookOpen size={14} className="mr-1" />
            {story.pages.length} pages
          </span>
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto italic">
          "{story.params.prompt}"
        </p>
      </motion.div>

      <div className="mb-12">
        <FlipBook story={story} />
      </div>
      
      <div className="flex justify-center mb-8">
        <Link 
          to="/"
          className="btn-primary flex items-center"
        >
          <Wand2 size={18} className="mr-2" />
          Create Another Story
        </Link>
      </div>
    </div>
  );
};

// Link component for internal navigation
const Link = ({ to, className, children }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className={className}
    >
      {children}
    </button>
  );
};

export default StoryViewer;