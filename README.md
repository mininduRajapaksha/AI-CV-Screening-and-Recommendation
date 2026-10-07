# CVision AI – AI CV Screening and Recommendation System

A comprehensive AI-powered web application designed to help HR professionals automate CV screening, evaluate candidates against job requirements, and generate recruitment recommendations using a multi-agent AI architecture.

## 🚀 Features
* **CV Upload:** Upload individual or multiple candidate CVs in PDF format for screening.
* **AI Information Extraction:** Automatically extracts candidate personal information, education, experience, and technical skills from CVs.
* **AI Candidate Evaluation:** Compares candidate skills and experience with job requirements and calculates a match percentage.
* **Skill Analysis:** Identifies matched and missing skills for each candidate.
* **AI Recommendation:** Generates candidate recommendations such as Highly Recommended, Recommended, or Not Recommended with AI-generated justifications.
* **Asynchronous CV Processing:** Processes CVs in the background using BullMQ and Redis without blocking the main server.
* **Screening Progress:** Track the processing status and progress of uploaded CVs.
* **Job Management:** Create and manage job postings and their requirements.
* **Candidate Management:** View and manage screened candidate information and evaluation results.
* **Reports:** View screening and candidate evaluation results.
* **Secure Authentication:** JWT-based authentication and role-based access control.
* **Admin Management:** Administrative features for managing users and system settings.
* **AI Service Monitoring:** Monitor the availability of the AI service, Redis, database, and CV worker.

## 💻 Tech Stack
* **Frontend:** React.js, Tailwind CSS, Vite, Axios
* **Backend:** Node.js, Express.js, JWT, Multer
* **Database:** MongoDB Atlas, Mongoose
* **AI Microservice:** Python, FastAPI, Pydantic, Google Gemini API
* **Background Processing:** Redis, BullMQ, ioredis

## 🤖 AI Agents
* **Agent 01 – Information Extractor:** Extracts candidate information from uploaded CVs, including personal details, education, experience, and technical skills.
* **Agent 02 – HR Evaluator:** Compares the candidate with the selected job description and generates match percentage, matched skills, missing skills, and experience evaluation.
* **Agent 03 – Decision Maker:** Generates the final candidate recommendation and justification based on the HR evaluation.

## 🛠️ Getting Started

Follow these steps to run the project on your local machine.

### 1. Clone the repository

`git clone https://github.com/mininduRajapaksha/AI-CV-Screening-and-Recommendation.git`

`cd "AI CV Screening and Recommendation"`

### 2. Setup Backend

Open a terminal and navigate to the backend directory:

`cd backend`

`npm install`

Create a `.env` file in the `backend` folder and add your environment variables:

`PORT=5000`

`MONGO_URI=your_mongodb_connection_string`

`JWT_SECRET=your_jwt_secret_key`

`AI_SERVICE_URL=http://localhost:8000`

`REDIS_HOST=localhost`

`REDIS_PORT=6379`

`REDIS_USERNAME=your user name`

`REDIS_PASSWORD=your password`

Start the backend server:

`npm run dev`

### 3. Setup AI Service

Open a new terminal and navigate to the AI service directory:

`cd ai-service`

Create a Python virtual environment:

`python -m venv venv`

Activate the virtual environment on Windows:

`venv\Scripts\activate`

Install the required packages:

`pip install -r requirements.txt`

Create a `.env` file in the `ai-service` folder:

`GEMINI_API_KEY=your_gemini_api_key`

Start the AI service:

`uvicorn app.main:app --reload --port 8000`

### 4. Setup Redis

Make sure Redis is installed and running on:

`localhost:6379`

Redis is used by BullMQ to manage asynchronous CV processing jobs.

### 5. Start the CV Worker

Open another terminal and navigate to the backend directory:

`cd backend`

Start the CV processing worker:

`node queues/cvWorker.js`

### 6. Setup Frontend

Open another terminal and navigate to the frontend directory:

`cd frontend`

`npm install`

Start the frontend development server:

`npm run dev`

The frontend will normally run on:

`http://localhost:5173`

## 🔄 System Workflow

`CV Upload → BullMQ/Redis → CV Worker → Agent 01 → Agent 02 → Agent 03 → MongoDB → Candidate Results`