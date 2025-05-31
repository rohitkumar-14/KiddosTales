import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { generateSpeech } from '../../services/geminiService';

const FlipBook = ({ story }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isNarrating, setIsNarrating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const bookRef = useRef(null);

  // Initialize loading state for all pages
  useEffect(() => {
    if (story && story.pages) {
      const initialLoadState = {};
      story.pages.forEach(page => {
        // Pre-load each image
        const img = new Image();
        img.src = page.imageUrl;
        img.onload = () => handleImageLoad(page.pageNumber);
        initialLoadState[page.pageNumber] = false;
      });
      setLoadedImages(initialLoadState);
    }
  }, [story]);
  
  // Check if all images are loaded
  useEffect(() => {
    if (story && story.pages) {
      const allImagesLoaded = story.pages.every(page => loadedImages[page.pageNumber]);
      setIsLoading(!allImagesLoaded);
    }
  }, [loadedImages, story]);

  // Handle image load event
  const handleImageLoad = (pageNumber) => {
    setLoadedImages(prev => ({
      ...prev,
      [pageNumber]: true
    }));
  };

  // Function to start narration
  const startNarration = async () => {
    if (isMuted) return;
    
    setIsNarrating(true);
    
    try {
      // Get current page content
      const pageContent = story.pages[currentPage].text;
      
      // Use Web Speech API to narrate
      await generateSpeech(pageContent);
      
      // Auto-flip to next page when narration ends
      if (currentPage < story.pages.length - 1 && bookRef.current) {
        bookRef.current.pageFlip().flipNext();
      } else {
        setIsNarrating(false);
      }
    } catch (error) {
      console.error('Narration error:', error);
      setIsNarrating(false);
    }
  };

  // Function to stop narration
  const stopNarration = () => {
    window.speechSynthesis.cancel();
    setIsNarrating(false);
  };

  // Function to toggle mute
  const toggleMute = () => {
    if (isNarrating) {
      stopNarration();
    }
    setIsMuted(!isMuted);
  };

  // Function to restart from the beginning
  const restartBook = () => {
    stopNarration();
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(0);
    }
  };

  // Function to handle page flip
  const handlePageFlip = (e) => {
    const newPageNumber = e.data;
    setCurrentPage(newPageNumber);
    
    if (isNarrating) {
      stopNarration();
      if (!isMuted) {
        // Small timeout to ensure proper page transition
        setTimeout(() => {
          startNarration();
        }, 500);
      }
    }
  };

  if (!story || !story.pages || story.pages.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No story data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-[500px] w-full">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading your story...</p>
        </div>
      ) : (
        <>
          <div className="w-full max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-hidden">
            <HTMLFlipBook
              width={350}
              height={500}
              size="stretch"
              minWidth={300}
              maxWidth={500}
              minHeight={400}
              maxHeight={700}
              showCover={false}
              ref={bookRef}
              onFlip={handlePageFlip}
              className="flip-book"
            >
              {story.pages.map((page) => (
                <div key={page.pageNumber} className="flip-book-page">
                  <div className="flip-book-page-content flex flex-col h-full">
                    {/* First page is title page */}
                    {page.pageNumber === 1 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-6">
                        <motion.h1 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-3xl font-bold mb-4 px-4 text-purple-700 dark:text-purple-400"
                        >
                          {story.title}
                        </motion.h1>
                        <div className="mt-4 w-full h-64 rounded-lg overflow-hidden">
                          <img
                            src={page.imageUrl}
                            alt="Story Cover"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="text-right mb-2 text-sm text-slate-500 dark:text-slate-400">
                          Page {page.pageNumber - 1}
                        </div>
                        <div className="prose dark:prose-invert flex-grow">
                          <p className="text-lg">{page.text}</p>
                        </div>
                        <div className="mt-6 h-48 md:h-64 rounded-lg overflow-hidden">
                          <img
                            src={page.imageUrl}
                            alt={`Illustration for page ${page.pageNumber}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </HTMLFlipBook>
          </div>

          {/* Controls */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center space-x-4 mt-6 bg-white dark:bg-slate-800 p-3 rounded-full shadow-md"
          >
            <button
              onClick={restartBook}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              aria-label="Restart"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={isNarrating ? stopNarration : startNarration}
              disabled={isMuted}
              className={`p-3 rounded-full ${
                isNarrating 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              } hover:bg-opacity-80 transition-colors ${
                isMuted ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label={isNarrating ? "Pause narration" : "Start narration"}
            >
              {isNarrating ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={toggleMute}
              className={`p-2 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors ${
                isMuted ? 'text-red-500' : ''
              }`}
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default FlipBook;