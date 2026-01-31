# SahajDesk — Project Structure

Quick map of the codebase so you can see how the rest of the project is organized.

## Routes

| Path | Who sees it | What |
|------|-------------|------|
| `/` | Guests → **Landing**. Logged-in → **Dashboard** | Landing page (modern SaaS) or app home |
| `/login` | Guests only | Login form (EN/हिंदी) |
| `/signup` | Guests only | Signup form (EN/हिंदी) |
| `/appointments` | Logged-in | Appointments list (filters, date groups, Edit/WhatsApp/Delete) |
| `/appointments/new` | Logged-in | New appointment form |
| `/appointments/:id` | Logged-in | Edit appointment form |
| `/customers` | Logged-in | Customers list (search, Add Customer modal) |
| `/bills` | Logged-in | Bills / GST invoices (list, Create bill, View/Print) |

## Folder structure

```
src/
├── App.jsx                 # Routes + LocaleProvider, AuthProvider, ToastProvider
├── main.jsx                # React root + index.css
├── index.css                # Design tokens, Tailwind, base styles
├── components/
│   ├── Layout.jsx           # App shell: header, sidebar (desktop), bottom nav (mobile), EN/हिंदी, Logout
│   ├── LanguageSwitcher.jsx # EN | हिंदी for Login/Signup
│   ├── ProtectedRoute.jsx   # Redirect to /login if not logged in
│   └── ui/                  # Reusable UI
│       ├── Button.jsx       # primary, success, secondary, danger, ghost
│       ├── Card.jsx
│       ├── Modal.jsx
│       ├── ConfirmModal.jsx # Delete confirmation
│       ├── Input.jsx        # Input, Select, Textarea
│       ├── Skeleton.jsx     # CardSkeleton, ListItemSkeleton
│       └── index.js
├── contexts/
│   ├── AuthContext.jsx      # user, login, signup, logout (Firestore-backed auth)
│   ├── LocaleContext.jsx    # locale (en/hi), setLocale, t()
│   └── ToastContext.jsx     # success/error toasts
├── hooks/
│   └── useAuth.js           # useAuth()
├── lib/
│   ├── firebase.js          # Firebase app
│   ├── firestore.js         # CRUD: users, customers, appointments
│   └── auth.js              # password hash/salt (custom auth)
├── locales/
│   └── translations.js      # en / hi strings (dot keys)
├── pages/
│   ├── Landing.jsx          # Public landing (Hero, Trust, Problem/Solution, Features, How it works, Pricing, CTA, Footer)
│   ├── Login.jsx            # Login form + LanguageSwitcher
│   ├── Signup.jsx           # Signup form + LanguageSwitcher
│   ├── Dashboard.jsx        # Summary cards + today’s appointments + Add Appointment
│   ├── Appointments.jsx     # Filters, list by date, Edit/WhatsApp/Delete + confirm modal
│   ├── AppointmentForm.jsx  # New/edit appointment form
│   ├── Customers.jsx       # Search, list, Add Customer modal
│   └── Bills.jsx           # GST invoices list, Create bill modal, View/Print
└── utils/
    └── whatsapp.js          # WhatsApp reminder link helper
```

## Design tokens (index.css)

- **Unified:** App and landing share the same palette and fonts.
- **Colors:** `--color-primary` (indigo), `--color-success` (emerald), `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--radius`, `--radius-lg`.
- **Landing:** Same tokens plus `--landing-*` aliases and gradient usage.
- **Fonts:** `--font-heading` (Plus Jakarta Sans), `--font-body` (Inter). Body uses Inter globally; use class `font-heading` for titles.

## Data (Firestore)

- **users** — email, passwordHash, salt, name, businessName (custom auth).
- **customers** — userId, name, phone.
- **appointments** — userId, customerId, customerName, phone, date, time, notes, status.
- **invoices** — userId, invoiceNumber (INV-YYYYMM-001), date, seller/buyer details, place of supply, item (description, SAC, qty, rate), GST (CGST/SGST/IGST), totalAmount, appointmentId (optional).

## How to “see” other parts

- **Landing:** Open `/` when logged out.
- **Login/Signup:** Click “Log in” or “Sign up” on landing; use EN/हिंदी switcher.
- **Dashboard:** Log in → you’re on `/` (Dashboard).
- **Appointments:** Sidebar or bottom nav → Appointments.
- **Customers:** Sidebar or bottom nav → Customers.
- **Bills:** Sidebar or bottom nav → Bills; or from Appointments → "Generate bill" on an appointment (opens Create bill with customer pre-filled).
- **Demo modal:** “Book a Free Demo” on landing (or sticky CTA on mobile).
