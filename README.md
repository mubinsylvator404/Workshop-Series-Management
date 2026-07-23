
> **The official platform of the Elite Debate Workshop Series 2026, organized by Moulvibazar Debating Society.**

A premium full-stack debate workshop management platform designed to deliver a modern learning experience for aspiring debaters. Built with a cinematic **Dark Academia / Wizarding-inspired** interface, the platform combines secure authentication, participant management, administrative tools, and an immersive user experience into a single application.

*Live Website:* https://mds-workshop.vercel.app

##  Overview

The **Elite Debate Workshop Series 2026** is a structured 10-session training program focused on developing high-level competitive debating skills for:

- Asian Parliamentary (AP)
- British Parliamentary (BP)
- World Universities Debating Championship (WUDC)
- National Debate Championships

The platform enables participants to register, complete workshop formalities, access learning resources, and interact with the workshop ecosystem through a secure dashboard.


# Features

## Student Portal

- Secure authentication with Supabase Auth
- Online registration system
- Application status tracking
- Personal Dashboard (My Chamber)
- Workshop curriculum access
- Speaker information
- Certificate management
- Session progress tracking
- Responsive mobile experience


## Admin Dashboard

- Registration management
- Approve / Reject / Suspend applicants
- Participant management
- CMS management
- Workshop management
- Media management
- Speaker management
- User profile management
- Secure role-based access

## Workshop Features

- 10-session curriculum
- Google Meet integration
- Speaker showcase
- Curriculum overview
- Workshop timeline
- Progress tracking
- Certificate support

## Design

- Harry Potter-inspired visual identity
- Dark Academia theme
- Cinematic UI
- Premium typography
- Glassmorphism components
- Responsive layout
- Modern animations
- Accessible interface

# Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Motion

### Backend & Database

- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage

### Deployment

- Vercel

# Project Structure

```
src/
 ├── components/
 ├── pages/
 ├── context/
 ├── hooks/
 ├── services/
 ├── lib/
 ├── utils/
 └── assets/
```


# Authentication Flow

```
Register
        │
        ▼
Supabase Authentication
        │
        ▼
Email Verification
        │
        ▼
Login
        │
        ▼
Registration Form
        │
        ▼
Pending Review
        │
        ▼
Admin Approval
        │
        ▼
Dashboard Access
```


# Workshop Curriculum

1. Motion Analysis & Strategic Case Building
2. Framing, Burdens & Comparative Analysis
3. Characterization, Modeling & Mechanism Design
4. Advanced Argumentation & Impact Calculus
5. Rebuttal, Engagement & POI Strategy
6. Extension Theory & Narrative Control
7. Speech Architecture & Strategic Prioritization
8. Inside the Judge's Mind: Adjudication & Ballot Writing
9. Motion Preparation, Research & Prep Room Dynamics
10. Championship Strategy: Winning at the Highest Level


# Installation

Clone the repository

```bash
git clone https://github.com/mubinsylvator404/Workshop-Series-Management
```

Move into the project

```bash
cd MDS-Workshop
```

Install dependencies

```bash
npm install
```

Create an environment file

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

# Deployment

This project is optimized for deployment on **Vercel**.

```bash
npm run build
```

Deploy directly from GitHub or using the Vercel CLI.

---

# Screenshots

### Home Page

Visit the live application:

https://mds-workshop.vercel.app


# Organization

**Moulvibazar Debating Society (MDS)**

Founded in 2018, Moulvibazar Debating Society is committed to promoting critical thinking, public speaking, and competitive debating by organizing workshops, training sessions, and national-level debate events.


# License

This project is developed exclusively for the **Elite Debate Workshop Series 2026**.

© 2026 Moulvibazar Debating Society. All Rights Reserved.
