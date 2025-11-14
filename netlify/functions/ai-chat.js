/**
 * Convert OpenAI format messages to Gemini API format
 */
function convertToGeminiFormat(messages) {
  const contents = [];
  
  for (const msg of messages) {
    if (msg.role === 'system') {
      // Gemini doesn't support system messages directly, 
      // so we'll prepend it as the first user message
      if (contents.length === 0 || contents[0].role !== 'user') {
        contents.push({
          role: 'user',
          parts: [{ text: msg.content }]
        });
        contents.push({
          role: 'model',
          parts: [{ text: 'I understand. I will act as an AI assistant with the information provided.' }]
        });
      } else {
        // Prepend system message to first user message
        contents[0].parts[0].text = msg.content + '\n\n' + contents[0].parts[0].text;
      }
    } else if (msg.role === 'user') {
      contents.push({
        role: 'user',
        parts: [{ text: msg.content }]
      });
    } else if (msg.role === 'assistant') {
      contents.push({
        role: 'model',
        parts: [{ text: msg.content }]
      });
    }
  }
  
  return contents;
}

/**
 * Convert Gemini API response to OpenAI format for frontend compatibility
 */
function convertFromGeminiFormat(geminiResponse) {
  try {
    const candidates = geminiResponse.candidates || [];
    if (candidates.length === 0) {
      throw new Error('No candidates in Gemini response');
    }
    
    const candidate = candidates[0];
    const content = candidate.content || {};
    const parts = content.parts || [];
    
    let text = '';
    for (const part of parts) {
      if (part.text) {
        text += part.text;
      }
    }
    
    // Return in OpenAI-compatible format
    return {
      choices: [{
        message: {
          role: 'assistant',
          content: text
        },
        finish_reason: candidate.finishReason || 'stop'
      }],
      usage: geminiResponse.usageMetadata || {}
    };
  } catch (error) {
    console.error('Error converting Gemini response:', error);
    throw error;
  }
}

const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Get the request body
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Invalid JSON in request body' })
      };
    }

    // Get API key from environment variable (support both names for backward compatibility)
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    
    if (!GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not configured in environment variables');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Get model from request or use default
    const modelId = requestBody.model || 'gemini-2.0-flash-lite';
    const stream = requestBody.stream || false;
    
    // Convert OpenAI format to Gemini format
    const messages = requestBody.messages || [];
    if (messages.length === 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'No messages provided' })
      };
    }

    const geminiContents = convertToGeminiFormat(messages);

    // Prepare Gemini API request
    const geminiRequest = {
      contents: geminiContents,
      generationConfig: {
        temperature: requestBody.temperature || 0.7,
        topP: requestBody.top_p || 0.95,
        topK: requestBody.top_k || 40,
        maxOutputTokens: requestBody.max_tokens || 2048,
        ...(requestBody.generationConfig || {})
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE'
        }
      ]
    };

    // Determine API endpoint based on whether streaming is requested
    const generateContentAPI = stream ? 'streamGenerateContent' : 'generateContent';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:${generateContentAPI}?key=${GEMINI_API_KEY}`;

    // Make the API call to Google Gemini
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(geminiRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText };
      }
      
      console.error('Gemini API Error:', response.status, errorData);
      
      return {
        statusCode: response.status >= 500 ? 502 : response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Gemini API request failed',
          details: errorData,
          status: response.status
        })
      };
    }

    const geminiData = await response.json();

    // Convert Gemini response to OpenAI format for frontend compatibility
    const openAIFormatResponse = convertFromGeminiFormat(geminiData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify(openAIFormatResponse)
    };

  } catch (error) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      })
    };
  }
};

module.exports = { handler };
