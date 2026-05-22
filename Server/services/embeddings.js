import axios from "axios";

export async function generateEmbedding(text) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.error("❌ No OpenRouter API key for embeddings");
    return null;
  }

  try {
    const cleanText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000);

    console.log(`🔄 Generating embedding for ${cleanText.length} chars...`);

    const response = await axios.post(
      "https://openrouter.ai/api/v1/embeddings",
      {
        model: "openai/text-embedding-3-small",
        input: cleanText,
        dimensions: 512  // Specify 512 dimensions
      },
      {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Notes App"
        },
        timeout: 15000
      }
    );

    const embedding = response.data?.data?.[0]?.embedding;
    
    if (!embedding || embedding.length === 0) {
      console.error("❌ No embedding in response");
      return null;
    }

    console.log(`✅ Embedding generated: ${embedding.length} dimensions`);
    return embedding;

  } catch (error) {
    console.error("❌ Embedding failed:", 
      error.response?.data?.error?.message || error.message
    );
    return null;
  }
}