import heroImg from "../assets/heroimg.png"
import funImg from "../assets/fun.png"
import writeImg from "../assets/write.png"
import storyImg from "../assets/story.png"
import { motion } from 'framer-motion';
import StoryForm from '../components/story/StoryForm';
import { Link } from "react-router-dom";
import { useRef } from "react";

const Home = () => {
  const targetSectionRef = useRef(null);

  const handleClick = () => {
    if (targetSectionRef.current) {
      targetSectionRef.current.scrollIntoView({
        behavior: 'smooth', 
        block: 'start',    
      });
    }
  };

  return (
    <>
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-magic text-white py-20 px-4">
        <div class="absolute inset-0 z-0">
            <svg class="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                <defs>
                    <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="transparent"/>
                    </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="15" fill="url(#grad1)"/>
                <circle cx="80" cy="30" r="20" fill="url(#grad1)"/>
                <circle cx="50" cy="70" r="18" fill="url(#grad1)"/>
            </svg>
            <div class="absolute top-1/4 left-1/10 w-24 h-24 bg-purple-300 rounded-full mix-blend-screen opacity-10 animate-[pulse_4s_infinite]"></div>
            <div class="absolute bottom-1/3 right-1/10 w-32 h-32 bg-pink-300 rounded-full mix-blend-screen opacity-10 animate-[pulse_5s_infinite_reverse]"></div>
        </div>

        <div class="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div class="text-center md:text-left">
                <h1 class="text-5xl md:text-6xl font-extrabold leading-tight mb-6 animate-slideInLeft delay-100 text-slate-700 dark:text-slate-300">
                    Your Imagination, <br class="hidden sm:inline"/> Our AI Canvas.
                </h1>
                <p class="text-xl md:text-2xl mb-8 opacity-0 animate-slideInLeft delay-300 text-slate-700 dark:text-slate-300" style={{animationDelay: "0.3s"}}>
                Create custom, illustrated stories with just a prompt. Perfect for children, creative writing, or just for fun!
                </p>
                <ul class="text-lg md:text-xl space-y-3 mb-10 opacity-0 animate-slideInLeft delay-500" style={{animationDelay: "0.5s"}}>
                    <li class="flex items-center justify-center md:justify-start text-slate-700 dark:text-slate-300">
                        <svg class="w-6 h-6 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Perfect for children's bedtime tales
                    </li>
                    <li class="flex items-center justify-center md:justify-start text-slate-700 dark:text-slate-300">
                        <svg class="w-6 h-6 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Unleash your creative writing
                    </li>
                    <li class="flex items-center justify-center md:justify-start text-slate-700 dark:text-slate-300">
                        <svg class="w-6 h-6 mr-3 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Just for fun & unique stories
                    </li>
                </ul>
                <div class="flex justify-center md:justify-start space-x-4 opacity-0 animate-slideInLeft delay-700" style={{animationDelay: "0.7s"}}>
                
                    <button onClick={handleClick} class="bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 animate-bounce-hover">
                        Start Your Story Now!
                    </button>
                    <Link to='/explore'>
                    <button class="bg-transparent border-2 border-white hover:bg-white hover:text-purple-900 text-slate-700 dark:text-slate-300 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
                      Explore more
                    </button></Link>
                </div>
            </div>

            <div class="relative flex justify-center md:justify-end animate-fadeInZoom" style={{animationDelay: "0.2s"}}>
                <div class="relative w-full max-w-md aspect-[4/3] bg-white rounded-xl shadow-2xl p-4 flex items-center justify-center overflow-hidden">
                    <img src={heroImg} alt="AI-generated story illustration" class="w-full h-full object-cover rounded-lg shadow-inner animate-slideInRight delay-300" style={{animationDelay: "0.3s"}}/>
                    <div class="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-transparent to-pink-400/30 opacity-70 animate-[pulse_3s_infinite]"></div>
                    <div class="absolute bottom-4 right-4 bg-purple-800 text-white text-xs px-3 py-1 rounded-full opacity-0 animate-slideInRight delay-700" style={{animationDelay: "0.7s"}}>
                        "Tell me about a brave knight and a sleepy dragon..."
                    </div>
                </div>
                <div class="absolute top-1/4 left-1/4 w-8 h-8 bg-yellow-300 rounded-full mix-blend-screen opacity-70 animate-[float_6s_infinite_ease-in-out]"></div>
                <div class="absolute bottom-1/5 right-1/5 w-10 h-10 bg-blue-300 rounded-full mix-blend-screen opacity-70 animate-[float_7s_infinite_reverse_ease-in-out]"></div>
            </div>
        </div>
    </section>

    <div className="min-h-[calc(100vh-160px)] flex flex-col" ref={targetSectionRef}>
      <div className="container mx-auto px-4 py-8 md:py-24 flex-grow">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Interactive Stories
          </h1>
        </motion.div>

        <StoryForm />
      </div>
    </div>

    <div class="mx-auto w-full">
        <div class=" p-8 sm:p-10">
            <h1 class="text-4xl sm:text-5xl font-extrabold text-center text-purple-700 dark:text-purple-400 mb-6 leading-tight">
                Your Imagination, <br class="sm:hidden"/> Our AI Canvas.
            </h1>
            <p class="text-lg text-center text-slate-600 dark:text-slate-300 mb-10">
                Create custom, illustrated stories with just a prompt. Perfect for children, creative writing, or just for fun!
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div class="card p-6 flex flex-col items-center text-center">
                    <img src={storyImg} alt="Children's stories icon" class="mb-4"/>
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Perfect for children's bedtime tales</h3>
                    <p class="text-slate-500 dark:text-slate-400">Enchanting and personalized stories for little ones.</p>
                </div>
                <div class="card p-6 flex flex-col items-center text-center">
                    <img src={writeImg} alt="Creative writing icon" class="mb-4"/>
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Unleash your creative writing</h3>
                    <p class="text-slate-500 dark:text-slate-400">Explore new narratives and expand your storytelling horizons.</p>
                </div>
                <div class="card p-6 flex flex-col items-center text-center">
                    <img src={funImg} alt="Just for fun icon" class="mb-4"/>
                    <h3 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Just for fun & unique stories</h3>
                    <p class="text-slate-500 dark:text-slate-400">Whimsical, one-of-a-kind stories on any topic you can imagine.</p>
                </div>
            </div>

          
        </div>
    </div>
    </>
  );
};

export default Home;