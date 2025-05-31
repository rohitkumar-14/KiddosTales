import React, { createContext, useContext, useState, useEffect } from 'react';

const StoriesContext = createContext();

export const useStories = () => useContext(StoriesContext);

// Example stories data
const exampleStories = [
  {
    id: 'example-1',
    title: 'The Magical Garden of Whispers',
    params: {
      prompt: 'A child discovers a magical garden where the plants can talk and share ancient wisdom',
      ageGroup: '6-9',
      storyType: 'fantasy',
      storyLength: 'medium',
      language: 'english',
      toneStyle: 'mystical'
    },
    pages: [
      {
        pageNumber: 1,
        text: 'The Magical Garden of Whispers',
        imageUrl: 'https://images.pexels.com/photos/158028/bellingrath-gardens-alabama-landscape-scenic-158028.jpeg',
        imagePrompt: 'A mystical garden at sunset with glowing flowers'
      },
      {
        pageNumber: 2,
        text: 'Lucy discovered the garden on a misty morning. The roses sparkled with dew, and to her amazement, they began to whisper ancient secrets.',
        imageUrl: 'https://images.pexels.com/photos/1105189/pexels-photo-1105189.jpeg',
        imagePrompt: 'A young girl in a misty garden with sparkling roses'
      },
      {
        pageNumber: 3,
        text: 'The wise old oak tree told stories of centuries past, while the playful daisies danced and giggled in the breeze.',
        imageUrl: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
        imagePrompt: 'A majestic oak tree with sunlight streaming through its branches'
      },
      {
        pageNumber: 4,
        text: 'Lucy learned about courage from the tall sunflowers, patience from the slow-growing vines, and kindness from the gentle lavender.',
        imageUrl: 'https://images.pexels.com/photos/33044/sunflower-sun-summer-yellow.jpg',
        imagePrompt: 'Tall sunflowers reaching towards the sky'
      },
      {
        pageNumber: 5,
        text: 'From that day forward, Lucy visited her magical friends every morning, carrying their wisdom in her heart. The End.',
        imageUrl: 'https://images.pexels.com/photos/1168940/pexels-photo-1168940.jpeg',
        imagePrompt: 'A peaceful garden path at sunrise'
      }
    ],
    createdAt: '2024-03-15T08:00:00.000Z'
  },
  {
    id: 'example-2',
    title: 'Space Pirates of the Asteroid Belt',
    params: {
      prompt: 'A young space cadet joins a crew of reformed space pirates to protect the galaxy',
      ageGroup: '10-13',
      storyType: 'sci-fi',
      storyLength: 'medium',
      language: 'english',
      toneStyle: 'adventurous'
    },
    pages: [
      {
        pageNumber: 1,
        text: 'Space Pirates of the Asteroid Belt',
        imageUrl: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg',
        imagePrompt: 'A futuristic spaceship flying through an asteroid field'
      },
      {
        pageNumber: 2,
        text: 'Zack never expected to become a space pirate. But when Captain Nova offered him a chance to protect the galaxy, he couldn\'t refuse.',
        imageUrl: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg',
        imagePrompt: 'A starry galaxy view from a spaceship window'
      },
      {
        pageNumber: 3,
        text: 'The crew of the Stellar Defender taught Zack everything: navigation through asteroid fields, plasma cannon maintenance, and space diplomacy.',
        imageUrl: 'https://images.pexels.com/photos/73910/mars-mars-rover-space-travel-robot-73910.jpeg',
        imagePrompt: 'The interior of a futuristic spaceship control room'
      },
      {
        pageNumber: 4,
        text: 'Together, they protected merchant ships from real pirates and helped maintain peace in the outer colonies.',
        imageUrl: 'https://images.pexels.com/photos/39561/solar-flare-sun-eruption-energy-39561.jpeg',
        imagePrompt: 'A space battle with ships and laser beams'
      },
      {
        pageNumber: 5,
        text: 'Zack realized that being a hero wasn\'t about fighting, but about protecting others and doing what\'s right. The End.',
        imageUrl: 'https://images.pexels.com/photos/5439/earth-space.jpg',
        imagePrompt: 'Earth viewed from space with a spaceship in the foreground'
      }
    ],
    createdAt: '2024-03-14T15:30:00.000Z'
  },
  {
    id: 'example-3',
    title: 'The Time-Traveling Food Truck',
    params: {
      prompt: 'A food truck that accidentally travels through time, serving historical figures their first taste of modern cuisine',
      ageGroup: '6-9',
      storyType: 'comedy',
      storyLength: 'short',
      language: 'english',
      toneStyle: 'funny'
    },
    pages: [
      {
        pageNumber: 1,
        text: 'The Time-Traveling Food Truck',
        imageUrl: 'https://images.pexels.com/photos/2227787/pexels-photo-2227787.jpeg',
        imagePrompt: 'A colorful food truck with magical swirling lights around it'
      },
      {
        pageNumber: 2,
        text: 'Chef Max\'s food truck was ordinary until he added a mysterious spice to his tacos. Suddenly, the truck started spinning and disappeared!',
        imageUrl: 'https://images.pexels.com/photos/1264937/pexels-photo-1264937.jpeg',
        imagePrompt: 'A chef cooking in a food truck kitchen with magical sparkles'
      },
      {
        pageNumber: 3,
        text: 'They appeared in ancient Egypt, where Cleopatra declared his pizza "better than pyramids!" Then they served dinosaurs some spicy wings.',
        imageUrl: 'https://images.pexels.com/photos/3290075/pexels-photo-3290075.jpeg',
        imagePrompt: 'Egyptian pyramids with a modern food truck in front'
      },
      {
        pageNumber: 4,
        text: 'The truck bounced through time: Leonardo da Vinci loved the burgers, and Napoleon couldn\'t get enough of the french fries!',
        imageUrl: 'https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg',
        imagePrompt: 'A renaissance setting with people enjoying modern food'
      },
      {
        pageNumber: 5,
        text: 'Chef Max learned that good food brings people together, no matter what time period they\'re from. The End.',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
        imagePrompt: 'A diverse group of people enjoying food together'
      }
    ],
    createdAt: '2024-03-13T10:15:00.000Z'
  }
];

export const StoriesProvider = ({ children }) => {
  const [stories, setStories] = useState(() => {
    const savedStories = localStorage.getItem('generatedStories');
    return savedStories ? JSON.parse(savedStories) : exampleStories;
  });

  useEffect(() => {
    localStorage.setItem('generatedStories', JSON.stringify(stories));
  }, [stories]);

  const addStory = (story) => {
    setStories(prevStories => [story, ...prevStories]);
  };

  const getStoryById = (id) => {
    return stories.find(story => story.id === id);
  };

  const updateStory = (updatedStory) => {
    setStories(prevStories => 
      prevStories.map(story => 
        story.id === updatedStory.id ? updatedStory : story
      )
    );
  };

  return (
    <StoriesContext.Provider value={{ stories, addStory, getStoryById, updateStory }}>
      {children}
    </StoriesContext.Provider>
  );
};