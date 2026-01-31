# Appointment Manager

A simple, production-ready web app for small local businesses (clinics, coaching centers). Manage appointments, customers, and send WhatsApp reminders—no paid API required.

## Features

- **Auth** – Login / Signup with email & password
- **Dashboard** – Today's appointments, total customers, quick add
- **Appointments** – Create, edit, delete; filter by today / upcoming / all
- **Customers** – Add customers, auto-link to appointments
- **WhatsApp Reminders** – One-click wa.me link with pre-filled message (opens WhatsApp app or web)

## Tech Stack

- React (Vite)
- Firebase Firestore, Hosting (no Firebase Auth - custom auth stored in Firestore)
- Password hashing via Web Crypto API (PBKDF2)
- Mobile-first CSS (no heavy libraries)

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Firebase setup

1. Create a project at [Firebase Console](https://console.firebase.google.com)
2. Create a **Firestore Database** (no Firebase Auth needed - users stored in Firestore)
4. Go to Project Settings → Your apps → Add web app → Copy config

### 3. Environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase config:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Deploy to Firebase Hosting

```bash
# Update .firebaserc with your project ID
npm run build
firebase deploy
```

## Folder Structure

```
src/
  components/     Layout, ProtectedRoute
  pages/          Login, Signup, Dashboard, Appointments, Customers, AppointmentForm
  hooks/          useAuth
  lib/            firebase.js, firestore.js
  utils/          whatsapp.js
firebase.json
firestore.rules
```

## Firestore Schema

- **users** – `userId` → email, passwordHash, salt, name, businessName, createdAt (custom auth)
- **customers** – `customerId` → userId, name, phone, createdAt
- **appointments** – `appointmentId` → userId, customerId, customerName, phone, date, time, status, notes, createdAt

## WhatsApp Reminder

Uses `wa.me/{phone}?text={encoded_message}`. No API key. Opens WhatsApp (app or web) with pre-filled message. Phone format: digits only, include country code (e.g. 919876543210 for India).
# simple-appintment
