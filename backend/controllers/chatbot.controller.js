const axios = require('axios');

exports.askGemini = async (req, res) => {
  console.log('Chatbot endpoint hit', req.body);
  const { message } = req.body;
  
  // Quick responses for simple greetings to avoid API calls
  const simpleGreetings = ['hi', 'hello', 'hey', 'hola', 'hellow'];
  if (simpleGreetings.includes(message.toLowerCase().trim())) {
    return res.json({ 
      reply: "Hey there, fellow traveler! 🌍 I'm Whispy, your enthusiastic travel buddy! I'm absolutely thrilled to help you discover amazing destinations around the world! Whether you're dreaming of tropical beaches, bustling cities, hidden gems, or cultural adventures, I'm here to make your travel dreams come true. What exciting journey are we planning today?" 
    });
  }
  
  const systemPrompt = "You are Whispy, an enthusiastic and knowledgeable travel guide and travel buddy. You LOVE helping people discover amazing destinations, plan incredible trips, and share exciting travel experiences. Be friendly, energetic, and passionate about travel. Provide detailed, helpful advice about destinations, activities, local culture, food, budgets, and travel tips. Always show excitement about travel and make the user feel inspired to explore the world. Use emojis occasionally to show enthusiasm. Remember to occasionally mention that you're Whispy, their travel buddy.";
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    console.log('Loaded Gemini API Key:', GEMINI_API_KEY);
    
    // Retry mechanism for API calls
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            contents: [{ parts: [{ text: `${systemPrompt}\n\n${message}` }] }]
          },
          { timeout: 10000 } // 10 second timeout
        );
        const botReply = response.data.candidates[0].content.parts[0].text;
        return res.json({ reply: botReply });
      } catch (apiError) {
        attempts++;
        console.log(`Attempt ${attempts} failed:`, apiError.response?.status, apiError.response?.data?.error?.message);
        
        if (attempts >= maxAttempts || (apiError.response?.status !== 503 && apiError.response?.status !== 429)) {
          throw apiError; // Re-throw if not retryable or max attempts reached
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
  } catch (error) {
    // Log detailed Gemini API error for debugging
    if (error.response) {
      console.error('Gemini API error:', error.response.status, error.response.data);
      
      // Provide specific error messages based on status code
      if (error.response.status === 503) {
        return res.json({ reply: "I'm experiencing high traffic right now! 😅 It's me, Whispy, and the servers are a bit busy, but I'm still excited to help you with your travel plans. Could you please try asking your question again in a moment?" });
      } else if (error.response.status === 429) {
        return res.json({ reply: "Whoa, lots of travel questions today! 🌍 I'm Whispy, and I've hit my chat limit for the moment. Give me just a minute to catch my breath, then I'll be ready to help you plan your next adventure!" });
      } else if (error.response.status === 400) {
        return res.json({ reply: "Oops! There seems to be a small hiccup with your question. I'm Whispy, and I'm eager to help you discover amazing travel destinations! Could you try rephrasing it? ✈️" });
      }
    } else {
      console.error('Gemini API error:', error.message || error);
    }
    res.json({ reply: 'Hi! I\'m Whispy, your travel buddy! 🗺️ I encountered a small technical issue, but don\'t let that stop your wanderlust! Please try your question again - I\'m here to help you explore the world!' });
  }
};