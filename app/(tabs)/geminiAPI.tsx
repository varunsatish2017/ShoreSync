// geminiApi.js

import axios from 'axios';

const API_KEY = 'AIzaSyBH2w-e21KP6qIk9k3XB-oBKKrnko3UNBY';
const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function getWaterActivityRecommendation(waterData) {
  const prompt = `
Given these water conditions:
- Height: ${waterData.height} meters
- Temperature: ${waterData.temperature} °C
- Turbidity: ${waterData.turbidity} NTU

Recommend safe water activities.
`;

  try {
    const response = await axios.post(
      `${GEMINI_ENDPOINT}?key=${API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Extract the response text
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No recommendation found.';
  } catch (error) {
    console.error('Gemini API error:', error.toJSON());
    return 'Failed to get recommendations.';
  }
}
