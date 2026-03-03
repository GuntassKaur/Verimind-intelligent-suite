# VeriMind

VeriMind is a full-stack AI project focused on detecting hallucinations and evaluating the reliability of AI-generated content.

As large language models become more common, the risk of incorrect or fabricated information also increases. VeriMind attempts to solve this problem by introducing a structured verification layer that analyzes generated text, breaks it into smaller claims, and assigns a credibility score.

This project was built to explore AI safety, system design, and full-stack development in a practical way.

---

## What VeriMind Does

• Breaks long AI-generated text into smaller factual claims  
• Analyzes each claim for potential hallucination patterns  
• Assigns a weighted risk score  
• Generates an overall credibility index  
• Provides a clean and interactive dashboard to visualize results  

It also includes additional content tools such as:
- Text generation
- Humanization module
- Plagiarism checking
- Typing interaction tracking

---

## Tech Stack

### Frontend
- React (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion
- Chart.js

### Backend
- Python
- Flask
- REST API architecture

---

## How It Works (High Level)

1. User submits AI-generated content  
2. Backend extracts atomic claims  
3. Each claim is analyzed using heuristic logic  
4. A hallucination risk score is calculated  
5. Results are returned as structured JSON  
6. Frontend visualizes credibility metrics  

---

## Running the Project Locally

### Backend

cd server  
pip install -r requirements.txt  
python app.py  

Runs on: http://localhost:5000  

---

### Frontend

Open a new terminal:

cd client  
npm install  
npm run dev  

Runs on: http://localhost:5173  

---

## Why I Built This

I wanted to build something beyond a basic CRUD project — something that reflects:

- Understanding of AI safety concepts  
- Full-stack integration skills  
- Clean system architecture  
- Practical problem-solving in emerging tech  

VeriMind represents my interest in building responsible AI tools rather than just AI applications.

---

## Project Status

This is an actively evolving system.  
Future improvements may include:
- External knowledge base integration  
- Real-time fact-check APIs  
- Advanced scoring models  
- Deployment at scale  

---

## Author

Guntass Kaur  
B.Tech CSE  
Full Stack Developer | Aspiring Software Engineer
