# Project Setup Guide

This guide provides step-by-step instructions to set up and debug the development environment for the project.

## Prerequisites

Ensure you have the following installed on your system:
- Python (>=3.x)
- pip (Python package manager)
- Node.js and npm (for React frontend)

---

## Backend (Flask) Setup

1. Navigate to the backend directory (if applicable):
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Create the SQLite database using ORM:
   ```sh
   python create.py
   ```
4. Start the Flask backend:
   ```sh
   python api.py
   ```
5. The Flask backend should now be running.

---

## Frontend (React) Setup

1. Navigate to the React project directory:
   ```sh
   cd react
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. Open your browser and visit:
   ```
   http://localhost:3000
   ```
   Or use your machine's IP address if accessing remotely.

---

Happy Coding! 🚀

