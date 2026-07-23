# Elite Debate Workshop Series 2026

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss\&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase\&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel\&logoColor=white)

> **The official platform of the Elite Debate Workshop Series 2026, organized by Moulvibazar Debating Society.**

A premium full-stack debate workshop management platform designed to deliver a modern learning experience for aspiring debaters. Built with a cinematic **Dark Academia / Wizarding-inspired** interface, the platform combines secure authentication, participant management, administrative tools, and an immersive user experience into a single application.

---

## Live Demo

https://mds-workshop.vercel.app

---

## Overview

The **Elite Debate Workshop Series 2026** is a structured **10-session** training program focused on developing high-level competitive debating skills for:

* Asian Parliamentary (AP)
* British Parliamentary (BP)
* World Universities Debating Championship (WUDC)
* National Debate Championships

The platform enables participants to:

* Register online
* Complete workshop formalities
* Access learning resources
* Track application progress
* Manage workshop activities through a secure dashboard

---

## Features

### Student Portal

* Secure authentication with Supabase Auth
* Online registration
* Application status tracking
* Personal Dashboard (My Chamber)
* Workshop curriculum
* Speaker information
* Certificate management
* Session progress tracking
* Responsive mobile experience

### Admin Dashboard

* Registration management
* Approve, Reject, and Suspend participants
* Participant management
* CMS management
* Workshop management
* Media management
* Speaker management
* User profile management
* Secure role-based access

### Workshop Features

* 10-session curriculum
* Google Meet integration
* Speaker showcase
* Curriculum overview
* Workshop timeline
* Progress tracking
* Certificate generation

### Design

* Harry Potter-inspired visual identity
* Dark Academia aesthetic
* Cinematic UI
* Premium typography
* Glassmorphism components
* Responsive layout
* Smooth animations
* Accessible interface

---

## Tech Stack

### Frontend

* React 19
* TypeScript
* Vite
* Tailwind CSS
* Motion

### Backend & Database

* Supabase Auth
* Supabase PostgreSQL
* Supabase Storage

### Deployment

* Vercel

---

## Project Structure

```text
src/
├── assets/
├── components/
├── context/
├── hooks/
├── lib/
├── pages/
├── services/
├── utils/
└── App.tsx
```

---

## Authentication Flow

```text
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

---

## Workshop Curriculum

| Session | Topic                                                  |
| ------- | ------------------------------------------------------ |
| 1       | Motion Analysis & Strategic Case Building              |
| 2       | Framing, Burdens & Comparative Analysis                |
| 3       | Characterization, Modeling & Mechanism Design          |
| 4       | Advanced Argumentation & Impact Calculus               |
| 5       | Rebuttal, Engagement & POI Strategy                    |
| 6       | Extension Theory & Narrative Control                   |
| 7       | Speech Architecture & Strategic Prioritization         |
| 8       | Inside the Judge's Mind: Adjudication & Ballot Writing |
| 9       | Motion Preparation, Research & Prep Room Dynamics      |
| 10      | Championship Strategy: Winning at the Highest Level    |

---

## Installation

Clone the repository:

```bash
git clone https://github.com/mubinsylvator404/Workshop-Series-Management.git
```

Move into the project:

```bash
cd Workshop-Series-Management
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Deployment

This project is optimized for deployment on **Vercel**.

```bash
npm run build
```

Deploy directly from GitHub or through the Vercel Dashboard.

---

## Screenshots

### Home Page

Add your homepage screenshot here.

```text
docs/home.png
```

### Student Dashboard

```text
docs/dashboard.png
```

### Registration Page

```text
docs/register.png
```

---

## Live Website

https://mds-workshop.vercel.app

---

## Organization

**Moulvibazar Debating Society (MDS)**

Founded in **2018**, Moulvibazar Debating Society is committed to promoting critical thinking, public speaking, and competitive debating through workshops, training programs, and national-level debate competitions.



## License

This project is developed exclusively for the **Elite Debate Workshop Series 2026**.

© 2026 Moulvibazar Debating Society. All Rights Reserved.
