# VetPet 🐾

A warm, friendly pet veterinary platform — 100% frontend-only (React + Tailwind + Zustand).

## Features

- 🔐 Auth (Pet Owner & Veterinarian roles, Google demo login)
- 🐾 Pet profiles with health tracking
- 🗺️ Nearby vets map (Ahmedabad, Gujarat)
- 📅 Appointment booking & ticket system
- 💬 In-app chat with vets
- 📞 Fake video call UI
- 🏥 Doctor dashboard
- 🛒 Pet store with cart (localStorage)
- 🔍 Lost & Found board
- 🩺 AI symptom checker (keyword-based)
- ❤️ Pet dating & meetup
- 📍 Nearby pet-friendly places

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Demo Login

- Pet Owner: click "Continue with Google (Demo)" on login page
- Veterinarian: toggle to Veterinarian tab, then "Continue with Google (Demo)"

## Deploy

**Vercel / Netlify:**
- Build command: `npm run build`
- Output directory: `dist`
- No environment variables needed (fully frontend)

## Tech Stack

- React 19 + Vite 8
- Tailwind CSS v4
- Zustand (state + localStorage persistence)
- Framer Motion (animations)
- React Router v6
- Lucide React (icons)
- date-fns

## Notes

- All data is stored in localStorage — no backend required
- Map views are simulated (SVG pins). To use real Google Maps, install `@react-google-maps/api` and replace the `MapView` components with `GoogleMap` + `Marker` components, using your API key.
