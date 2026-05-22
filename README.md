# 📝 Notely – AI‑Powered Notes App with RAG 🚀

Notely is an **intelligent note-taking application** built with the **MERN stack** that combines traditional note management with cutting-edge AI capabilities. It features **Retrieval-Augmented Generation (RAG)** for semantic search across your knowledge base, AI-powered content enhancement, and smart organization tools.

---

## ✨ Features

### 📝 Note Management
- ✍️ Create, edit, and delete rich-text notes
- 📁 Organize with folders and tags
- 📌 Pin, archive, and trash notes
- 📥 Import notes from files
- 🎨 Color-coded notes for visual organization
- 🔐 Secure JWT-based authentication
- 💾 Auto-save functionality

### 🤖 AI-Powered Features
- 🚀 **Enhance Writing** – AI expands notes with detailed explanations, examples, and statistics
- 📋 **Generate Titles** – Auto-generate meaningful titles from content
- 📊 **Summarize Notes** – Get concise AI-powered summaries
- 🏷️ **Extract Keywords** – Automatic tag extraction and suggestions
- ❓ **Ask Questions** – Query your notes in natural language

### 🔍 RAG (Retrieval-Augmented Generation)
- 💬 **Ask Your Notes** – Ask questions and get answers based on YOUR note content
- 🧠 **Semantic Search** – Finds notes by meaning, not just keywords
- 📎 **Source Attribution** – See which notes were used to generate answers with relevance scores
- 🔗 **Cross-Note Intelligence** – Connects information across your entire knowledge base
- ⚡ **Real-Time Indexing** – Notes are automatically indexed for search on create/update/delete

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────────────┐
│ Notely Architecture │
├─────────────────────────────────────────────────────────────┤
│ │
│ Frontend (React + Vite) │
│ ├── Rich Text Editor (TipTap) │
│ ├── AI Actions Panel │
│ └── RAG Question Interface │
│ │
│ Backend (Express.js) │
│ ├── Notes CRUD API │
│ ├── AI Enhancement Routes │
│ └── RAG Query Endpoint │
│ │
│ AI Services │
│ ├── OpenRouter API │
│ │ ├── Gemini 2.0 Flash (Text Generation) │
│ │ └── Text Embedding 3 Small (Vector Embeddings) │
│ └── Pinecone (Vector Database) │
│ └── Semantic Search (512-dimension vectors) │
│ │
│ Database │
│ └── MongoDB Atlas (Notes, Users, Tags, Folders) │
│ │
└─────────────────────────────────────────────────────────────┘

text

### How RAG Works
📝 Note Created/Updated
↓
Text → Embedding Model → 512-number Vector → Pinecone Storage

❓ User Asks Question
↓
Question → Embedding → Pinecone Search (Cosine Similarity)
↓
Top 3-5 Most Relevant Notes Found
↓
Full Note Content Retrieved from MongoDB
↓
Context + Question → Gemini 2.0 Flash
↓
Answer Generated + Source Attribution with Relevance Scores

text

---

## 🛠️ Tech Stack

### Frontend
- **React.js** with Vite
- **Tailwind CSS** for styling
- **TipTap** Rich Text Editor
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose ODM
- **JWT** Authentication
- **Multer** for file uploads
- **Dotenv** for configuration

### AI & Machine Learning
- **OpenRouter API**
  - Gemini 2.0 Flash (Text generation, enhancement, summarization)
  - Text Embedding 3 Small (Vector embeddings - 512 dimensions)
- **Pinecone** (Vector database for semantic search)
- **Cosine Similarity** for relevance scoring

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Vector DB:** Pinecone Cloud

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- OpenRouter API key
- Pinecone account

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/notely.git
cd notely
2️⃣ Backend Setup
bash
cd Server
npm install
Create a .env file in the Server directory:

env
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES=7d
NODE_ENV=development

# AI Services
OPENROUTER_API_KEY=your_openrouter_api_key

# Vector Database
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_HOST=your_pinecone_host_url

# Frontend URL
CLIENT_URL=http://localhost:5173
Run the backend:

bash
npm start
3️⃣ Frontend Setup
bash
cd Client
npm install
Create a .env file in the Client directory:

env
VITE_API_URL=http://localhost:5000/api
Run the frontend:

bash
npm run dev
4️⃣ Pinecone Setup
Create a free account at Pinecone

Create an index named notes-rag

Set Dimensions: 512

Set Metric: cosine

Copy your API key and host URL to .env

5️⃣ Index Your Notes
After creating some notes, index them for RAG search:

bash
curl -X POST http://localhost:5000/api/ai/index-all-notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
Or use Postman:

text

🔒 Security
JWT-based authentication with token expiration

All notes are user-scoped (users can only access their own data)

AI queries only search the authenticated user's notes

Environment variables for all sensitive keys

CORS protection with whitelist

Input validation on all endpoints

Password hashing with bcrypt

🧩 Future Enhancements
🎙️ Voice-to-text notes

📄 Export notes as PDF / Markdown / HTML

🤝 Real-time collaboration

🔔 AI-powered study reminders

📱 Mobile app (React Native)

🌐 Multi-language support

🔌 Third-party integrations (Notion, Google Drive, etc.)

📈 Advanced analytics dashboard

🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository

Create a new branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request


```

