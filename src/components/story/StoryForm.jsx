import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, BookText, Users, Clock, Languages, Palette } from 'lucide-react';
import { useApiKey } from '../../context/ApiKeyContext';
import { useStories } from '../../context/StoriesContext';
import { generateStory, generateImage } from '../../services/geminiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const StoryForm = () => {
  const { activeKey, activeProvider } = useApiKey();
  const { addStory } = useStories();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [storyParams, setStoryParams] = useState({
    prompt: '',
    ageGroup: '6-9',
    storyType: 'adventure',
    storyLength: 'medium',
    language: 'english',
    toneStyle: 'engaging',
  });

  const ageGroups = [
    { value: '3-5', label: '3-5 years' },
    { value: '6-9', label: '6-9 years' },
    { value: '10-13', label: '10-13 years' },
    { value: '14+', label: '14+ years' },
  ];

  const storyTypes = [
    { value: 'adventure', label: 'Adventure' },
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Science Fiction' },
    { value: 'moral', label: 'Moral Story' },
    { value: 'comedy', label: 'Comedy' },
    { value: 'mystery', label: 'Mystery' },
    { value: 'historical', label: 'Historical' },
    { value: 'educational', label: 'Educational' },
  ];

  const storyLengths = [
    { value: 'short', label: 'Short (1-3 mins)' },
    { value: 'medium', label: 'Medium (4-7 mins)' },
    { value: 'long', label: 'Long (8+ mins)' },
  ];

  const languages = [
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'hindi', label: 'Hindi' },
  ];

  const toneStyles = [
    { value: 'engaging', label: 'Engaging' },
    { value: 'funny', label: 'Funny' },
    { value: 'mystical', label: 'Mystical' },
    { value: 'educational', label: 'Educational' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'suspenseful', label: 'Suspenseful' },
    { value: 'calming', label: 'Calming' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoryParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activeKey) {
      toast.error('Please set your API key first');
      return;
    }
    
    if (!storyParams.prompt.trim()) {
      toast.error('Please enter a story prompt');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate story content using selected provider
      const storyData = await generateStory(activeKey, storyParams, activeProvider);
      
      // Generate images for each page
      const pagesWithImageUrls = await Promise.all(
        storyData.pages.map(async (page) => {
          const imageUrl = await generateImage(activeKey, page.imagePrompt, activeProvider);
          return { ...page, imageUrl };
        })
      );
      
      // Create story object
      const newStory = {
        id: Date.now().toString(),
        title: storyData.title,
        params: {
          ...storyParams,
          provider: activeProvider
        },
        pages: pagesWithImageUrls,
        createdAt: new Date().toISOString(),
      };
      
      // Save story
      addStory(newStory);
      
      toast.success('Story generated successfully!');
      navigate(`/story/${newStory.id}`);
    } catch (error) {
      console.error('Error generating story:', error);
      toast.error(error.message || 'Failed to generate story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto p-4 md:p-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 flex items-center justify-center">
          <Wand2 className="text-purple-500 mr-2" size={32} />
          <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
            Create Your Story
          </span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Provide a prompt and customize your preferences to generate a unique, 
          AI-powered interactive story.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6">
        <div className="input-group">
          <label htmlFor="prompt" className="input-label flex items-center">
            <Sparkles size={16} className="mr-1.5 text-purple-500" />
            Story Prompt
          </label>
          <textarea
            id="prompt"
            name="prompt"
            value={storyParams.prompt}
            onChange={handleInputChange}
            placeholder="A child discovers a magical garden where the plants can talk..."
            className="input-field min-h-[100px]"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label htmlFor="ageGroup" className="input-label flex items-center">
              <Users size={16} className="mr-1.5 text-purple-500" />
              Age Group
            </label>
            <select
              id="ageGroup"
              name="ageGroup"
              value={storyParams.ageGroup}
              onChange={handleInputChange}
              className="input-field"
            >
              {ageGroups.map(group => (
                <option key={group.value} value={group.value}>
                  {group.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="storyType" className="input-label flex items-center">
              <BookText size={16} className="mr-1.5 text-purple-500" />
              Story Type
            </label>
            <select
              id="storyType"
              name="storyType"
              value={storyParams.storyType}
              onChange={handleInputChange}
              className="input-field"
            >
              {storyTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="input-group">
            <label htmlFor="language" className="input-label flex items-center">
              <Languages size={16} className="mr-1.5 text-purple-500" />
              Language
            </label>
            <select
              id="language"
              name="language"
              value={storyParams.language}
              onChange={handleInputChange}
              className="input-field"
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="toneStyle" className="input-label flex items-center">
              <Palette size={16} className="mr-1.5 text-purple-500" />
              Tone Style
            </label>
            <select
              id="toneStyle"
              name="toneStyle"
              value={storyParams.toneStyle}
              onChange={handleInputChange}
              className="input-field"
            >
              {toneStyles.map(tone => (
                <option key={tone.value} value={tone.value}>
                  {tone.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label flex items-center mb-2">
            <Clock size={16} className="mr-1.5 text-purple-500" />
            Story Length
          </label>
          <div className="flex flex-wrap gap-3">
            {storyLengths.map(length => (
              <label
                key={length.value}
                className={`flex items-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition-all ${
                  storyParams.storyLength === length.value
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-800'
                }`}
              >
                <input
                  type="radio"
                  name="storyLength"
                  value={length.value}
                  checked={storyParams.storyLength === length.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span>{length.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || !activeKey}
            className={`btn-primary w-full flex items-center justify-center ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Generating Story...
              </>
            ) : (
              <>
                <Wand2 size={18} className="mr-2" />
                Generate My Story
              </>
            )}
          </button>
          
          {!activeKey && (
            <p className="text-sm text-red-500 mt-2 text-center">
              Please set your API key in the navbar first
            </p>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default StoryForm;