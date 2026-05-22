import dotenv from 'dotenv';
dotenv.config();

import { callGemini, summarizeText, generateTitleFromContent } from './utils/aiTools.js';

async function testAI() {
  console.log('🔍 Testing AI Tools...\n');

  // Test 1: Check API Key
  console.log('1️⃣ Checking API Key...');
  console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
  console.log('API Key prefix:', process.env.GEMINI_API_KEY?.substring(0, 5) + '...\n');

  // Test 2: Test Gemini API Call
  console.log('2️⃣ Testing Gemini API Call...');
  const testResponse = await callGemini('Say "Hello from Gemini" in exactly 3 words.');
  console.log('Gemini Response:', testResponse);
  console.log('API Call Success:', !!testResponse, '\n');

  // Test 3: Test Summarize
  console.log('3️⃣ Testing Summarize...');
  const testContent = '<p>This is a test note. It contains multiple sentences. This should be summarized.</p>';
  const summary = summarizeText(testContent);
  console.log('Summary:', summary, '\n');

  // Test 4: Test Title Generation
  console.log('4️⃣ Testing Title Generation...');
  const testTitle = generateTitleFromContent(testContent);
  console.log('Generated Title:', testTitle, '\n');

  console.log('✅ Tests Complete');
}

testAI().catch(console.error);