import axios from 'axios';
import { generateEmbedding } from './embeddings.js';

function getConfig() {
  return {
    baseUrl: process.env.PINECONE_INDEX_HOST,
    apiKey: process.env.PINECONE_API_KEY
  };
}

function getHeaders() {
  const { apiKey } = getConfig();
  return {
    'Api-Key': apiKey,
    'Content-Type': 'application/json'
  };
}

export async function storeNoteEmbedding(noteId, title, content) {
  try {
    console.log(`📝 STORING: Note ${noteId}`);
    
    const { baseUrl } = getConfig();
    console.log('  Base URL:', baseUrl);
    
    const embedding = await generateEmbedding(`${title}\n${content}`);
    if (!embedding) return false;

    const url = `${baseUrl}/vectors/upsert`;
    const response = await axios.post(url, {
      vectors: [{
        id: noteId.toString(),
        values: embedding,
        metadata: {
          title: title?.substring(0, 200) || "Untitled",
          preview: content?.replace(/<[^>]*>/g, '').substring(0, 500) || ""
        }
      }]
    }, { headers: getHeaders() });

    console.log(`✅ Stored! Count:`, response.data.upsertedCount);
    return true;

  } catch (error) {
    console.error(`❌ Failed:`, error.response?.data || error.message);
    return false;
  }
}

export async function updateNoteEmbedding(noteId, title, content) {
  return storeNoteEmbedding(noteId, title, content);
}

export async function deleteNoteEmbedding(noteId) {
  try {
    const { baseUrl } = getConfig();
    const url = `${baseUrl}/vectors/delete`;
    await axios.post(url, { ids: [noteId.toString()] }, { headers: getHeaders() });
    console.log(`🗑️ Deleted: ${noteId}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed:`, error.message);
    return false;
  }
}

export async function searchSimilarNotes(question, topK = 5) {
  try {
    const { generateEmbedding } = await import('./embeddings.js');
    const { baseUrl } = getConfig();
    
    // Semantic search
    const questionEmbedding = await generateEmbedding(question);
    if (!questionEmbedding) return [];

    const url = `${baseUrl}/query`;
    const response = await axios.post(url, {
      vector: questionEmbedding,
      topK: topK,
      includeMetadata: true
    }, { headers: getHeaders() });

    // Also do keyword search in metadata
    const keywords = question.toLowerCase().split(' ').filter(w => w.length > 2);
    
    let results = response.data.matches.map(match => {
      // Boost score if keywords found in title/preview
      let boost = 0;
      const text = `${match.metadata?.title || ''} ${match.metadata?.preview || ''}`.toLowerCase();
      keywords.forEach(keyword => {
        if (text.includes(keyword)) boost += 0.1;
      });
      
      return {
        noteId: match.id,
        score: Math.min(1, match.score + boost), // Boost but cap at 1
        title: match.metadata?.title || "Untitled",
        preview: match.metadata?.preview || ""
      };
    });

    // Re-sort by boosted score
    results.sort((a, b) => b.score - a.score);

    return results;

  } catch (error) {
    console.error("❌ Search failed:", error.message);
    return [];
  }
}

export async function checkPineconeHealth() {
  try {
    const { baseUrl } = getConfig();
    const url = `${baseUrl}/describe_index_stats`;
    const response = await axios.get(url, { headers: getHeaders() });
    return { status: 'healthy', totalVectors: response.data.totalVectorCount || 0 };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}