import { GoogleGenerativeAI } from "@google/generative-ai";
import { OpenAI } from "openai";
import axios from "axios";

const AI_PROVIDERS = {
  gemini: {
    init: (apiKey) => {
      const genAI = new GoogleGenerativeAI(apiKey);
      return {
        textModel: genAI.getGenerativeModel({ model: "gemini-2.0-flash" }),
        imageModel: genAI.getGenerativeModel({ model: "gemini-2.0-flash" }),
      };
    },
    generateStory: async (model, storyParams) => {
      const result = await model.textModel.generateContent(
        buildGeminiPrompt(storyParams)
      );
      const response = await result.response;
      return parseGeminiResponse(response.text());
    },
    generateImage: async (model, imagePrompt) => {
      try {
        // For Gemini 1.5 or later which supports image generation
        const result = await model.textModel.generateContent([
          "Generate a detailed prompt for an image generator based on: " +
            imagePrompt,
          "Then generate an image based on that prompt.",
        ]);

        const response = await result.response;
        const text = response.text();

        // Parse the image data if returned (Gemini 1.5+)
        if (text.includes("image data")) {
          const imageMatch = text.match(/image data: (.*)/);
          if (imageMatch) {
            return `data:image/png;base64,${imageMatch[1]}`;
          }
        }

        // Fallback to using the prompt with another service
        throw new Error("Gemini image generation not fully supported yet");
      } catch (error) {
        console.warn(
          "Gemini direct image generation failed, falling back to placeholder"
        );
        return generatePlaceholderImage(imagePrompt);
      }
    },
  },

  openai: {
    init: (apiKey) => new OpenAI({ apiKey }),
    generateStory: async (client, storyParams) => {
      const response = await client.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: buildGeminiPrompt(storyParams) }],
      });
      return parseGeminiResponse(response.choices[0].message.content);
    },
    generateImage: async (client, imagePrompt) => {
      const response = await client.images.generate({
        model: "dall-e-3",
        prompt: `Children's storybook illustration in colorful, friendly style. ${imagePrompt}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
      });
      return response.data[0].url;
    },
  },

  stability: {
    init: (apiKey) => ({ apiKey }),
    generateStory: async (storyParams) => {
      const gemini = AI_PROVIDERS.gemini.init(process.env.GEMINI_API_KEY);
      return await AI_PROVIDERS.gemini.generateStory(gemini, storyParams);
    },
    generateImage: async (client, imagePrompt) => {
      try {
        const response = await axios.post(
          "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
          {
            text_prompts: [
              {
                text: `Children's storybook illustration, colorful, friendly style: ${imagePrompt}`,
                weight: 1,
              },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${client.apiKey}`,
            },
          }
        );

        return `data:image/png;base64,${response.data.artifacts[0].base64}`;
      } catch (error) {
        console.error(
          "Stability AI error:",
          error.response?.data || error.message
        );
        throw new Error("Failed to generate image with Stability AI");
      }
    },
  },
};
// Helper functions
const buildGeminiPrompt = (storyParams) => {
  const { prompt, ageGroup, storyType, storyLength, language, toneStyle } =
    storyParams;

  let pageCount;
  switch (storyLength) {
    case "short":
      pageCount = 5;
      break;
    case "medium":
      pageCount = 8;
      break;
    case "long":
      pageCount = 12;
      break;
    default:
      pageCount = 5;
  }

  return `
    Generate a ${storyType} story for ${ageGroup} age group based on this prompt: "${prompt}".
    The tone should be ${toneStyle}.
    ${language !== "english" ? `Write the story in ${language}.` : ""}

    Break the story into exactly ${pageCount} pages, including a title page and an ending page.
    
    For each page, provide:
    1. Page number
    2. Text content (appropriate length for ${ageGroup} age group)
    3. A detailed image description that would work well for AI image generation
    
    Format the response as a JSON object with the following structure:
    {
      "title": "Story Title",
      "pages": [
        {
          "pageNumber": 1,
          "text": "Once upon a time...",
          "imagePrompt": "A detailed description for generating an image for this page"
        },
        ...
      ]
    }
    
    For the first page (pageNumber: 1), make it a title page with minimal text but an engaging image prompt.
    For the last page, include a satisfying conclusion with "The End" in the text.
    
    Make sure the story is coherent, engaging, and appropriate for ${ageGroup} age group.
  `;
};

const buildGeminiImagePrompt = (imagePrompt) => {
  return `
    Create a detailed visual description of an image based on this prompt: "${imagePrompt}".
    The description should be very detailed and formatted as:
    "A colorful children's book illustration in [art style] style showing [detailed scene description]. 
    The scene includes [key elements] with [specific details about colors, lighting, composition]. 
    The mood should be [mood] with [specific stylistic choices]."
    
    Make it specific and visually interesting, suitable for a children's storybook illustration.
    Avoid any problematic content for children.
  `;
};

const parseGeminiResponse = (text) => {
  const jsonMatch =
    text.match(/```json\n([\s\S]*)\n```/) ||
    text.match(/```\n([\s\S]*)\n```/) ||
    text.match(/{[\s\S]*}/);

  const jsonString = jsonMatch ? jsonMatch[1] || jsonMatch[0] : text;

  try {
    return JSON.parse(jsonString.trim());
  } catch (parseError) {
    console.error("Failed to parse JSON response:", parseError);
    throw new Error("Failed to parse story data");
  }
};

const generatePlaceholderImage = (description) => {
  const searchQuery = description
    .split(".")[0]
    .replace(/^Photo of /i, "")
    .replace(/[^\w\s]/gi, "")
    .trim()
    .split(" ")
    .slice(0, 3)
    .join(" ");

  return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(
    searchQuery
  )}`;
};

// Main export functions
export const generateStory = async (
  apiKey,
  storyParams,
  provider = "gemini"
) => {
  try {
    const aiProvider = AI_PROVIDERS[provider];
    if (!aiProvider) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    const model = aiProvider.init(apiKey);
    return await aiProvider.generateStory(model, storyParams);
  } catch (error) {
    console.error("Error generating story:", error);
    throw error;
  }
};

export const generateImage = async (
  apiKey,
  imagePrompt,
  provider = "gemini"
) => {
  try {
    const aiProvider = AI_PROVIDERS[provider];
    if (!aiProvider) {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }

    const model = aiProvider.init(apiKey);
    return await aiProvider.generateImage(model, imagePrompt);
  } catch (error) {
    console.error("Error generating image:", error);
    return generatePlaceholderImage(imagePrompt);
  }
};

export const generateSpeech = (text) => {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error("Speech synthesis not supported"));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    utterance.onend = () => resolve();
    utterance.onerror = (err) => reject(err);

    window.speechSynthesis.speak(utterance);
  });
};
