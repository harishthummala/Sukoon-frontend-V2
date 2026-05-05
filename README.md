 Sukoon - Mental Wellness Companion

---

A beautiful, modern mental wellness application built with Next.js that connects to your Java Spring Boot backend. Sukoon provides a safe space for users to express their feelings, chat with an AI companion, and maintain personal wellness notes.

---

## Features

---

## Core Features
- **8 Mood Selection**: Happy, Calm, Neutral, Sad, Anxious, Stressed, Angry, Tired
- **AI-Powered Chat**: Groq-powered conversations via backend
- **Message Counter**: 20 messages per chat limit tracking
- **Session Summaries**: Detailed insights after each chat session
- **Personal Notes**: Create, edit, and organize private reflections
- **Chat History**: Access previous conversations from the sidebar

---

## Authentication
- Email/Password registration and login
- Google OAuth integration (requires credentials)
- Secure JWT token storage in localStorage

---

## Design
- Gen Z/Millennial aesthetic with calming color palette (purple, blue, mint)
- Fully responsive mobile-first design
- Smooth animations and transitions
- Accessibility-first approach with semantic HTML

---

## Tech Stack

- **Frontend**: Next.js 16 + React 19
- **Styling**: Tailwind CSS with custom design tokens
- **Backend**: https://sukoonai.mooo.com/api
- **Icons**: Lucide React
- **State Management**: React Context API + Custom Hooks


---

## Key Features

- Modern and responsive frontend experience
- Secure backend architecture using Spring Security
- RESTful API design
- PostgreSQL-backed persistence
- Cloud deployment on AWS
- Docker-based application packaging
- CI/CD automation using GitHub Actions
- Nginx configured for production traffic routing
- Separate frontend and backend deployments for cleaner scaling and maintainability

---

## Architecture Overview

- **Frontend** communicates with the backend through REST APIs
- **Backend** handles authentication, business logic, and data persistence
- **PostgreSQL** stores application data on AWS RDS
- **AWS EC2** runs the backend service in a production environment
- **Nginx** acts as the reverse proxy and supports production routing
- **GitHub Actions** automates deployment workflow
---

## Why This Project Matters

Sukoon is not just a CRUD app. It reflects real-world engineering decisions around:
- clean separation of concerns
- secure API design
- deployment on cloud infrastructure
- containerized delivery
- maintainable backend architecture

---

## Repository Structure

```bash
sukoon-backend/
sukoon-frontend-v2/
