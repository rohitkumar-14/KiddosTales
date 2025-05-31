import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar } from 'lucide-react';

const StoryCard = ({ story }) => {
  const navigate = useNavigate();
  const coverImage = story.pages[0]?.imageUrl || 'https://source.unsplash.com/random/800x600/?storybook';
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="card group cursor-pointer h-full flex flex-col"
      onClick={() => navigate(`/story/${story.id}`)}
    >
      <div className="relative h-48 overflow-hidden rounded-t-xl">
        <img 
          src={coverImage} 
          alt={story.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-4">
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500 text-white">
            {story.params.storyType.charAt(0).toUpperCase() + story.params.storyType.slice(1)}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {story.title}
        </h3>
        
        <div className="mt-auto pt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(story.createdAt)}</span>
          </div>
          
          <div className="flex items-center text-purple-600 dark:text-purple-400 font-medium">
            <BookOpen size={14} className="mr-1" />
            <span>{story.pages.length} pages</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StoryCard;