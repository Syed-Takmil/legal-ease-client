


# ⚖️ LegalEase – Online Lawyer Hiring Platform (Frontend)

LegalEase is a digital marketplace platform that connects clients, businesses, and legal seekers with talented lawyers. It streamlines the traditional legal consultation process by providing a modern, online space to browse, search, and securely contract legal professionals. 

This repository contains the full **Frontend codebase** built using Next.js, optimized for role-based flows, clean user state management, and an excellent user experience.

🌐 **Live Deployment:** [https://legal-ease-client-seven.vercel.app/](https://legal-ease-client-seven.vercel.app/)

---

## 💻 Tech Stack & Client UI Tools

* **Core Framework:** Next.js (App Router) for robust routing, static optimization, and performance.
* **Styling & Layout:** Tailwind CSS coupled with **DaisyUI** for clean, modern components.
* **Theme Management:** `next-themes` powering a fully functional, persistent dark and light mode toggle.
* **Iconography:** **Gravity UI Icons** for crisp, professional legal and platform visuals.
* **State & Feedback:** **React Toastify** for instant interactive alerts and API exception notifications.
* **Micro-interactions:** **Framer Motion** for sleek, staggered scroll reveals and button animations.

---

## 🎨 Layout & Core UI Structure

### 1. Unified Navbar & Global Header
* **Global Search Integration:** Built-in omni-search input right in the navbar to query lawyers immediately by name or specialization from any route.
* **Dynamic Role Dropdown:** Displays conditional route links ("Dashboard") depending on the logged-in user's role.
* **Responsive Control:** Uses a smooth mobile hamburger menu with persistent active-route highlighting.

### 2. Immersive Home Page Experience
* **Hero Banner:** Large professional layout with a focus-driven tagline and an instant call-to-action ("Browse Lawyers") utilizing Framer Motion text fades.
* **Featured Lawyers Section:** Display grid fetching the latest 6 active legal professionals from the database on page reload.
* **Specialized Category Maps:** Visual categories grid (Criminal, Corporate, Family, etc.) mapping direct filter parameters directly to the browsing index.
* **Top Performers Spotlight:** Dedicated showcase component featuring the 3 most highly hired legal experts on the platform.

### 3. Advanced Explorer & Browse Directory
* **Comprehensive Filtering Suite:** Live client-side filters targeting legal specialization, availability statuses, and slider-driven fee parameters.
* **Performance UX:** Integrated skeleton loading cards to mask API data fetching and fallback layouts when zero results match filter matrices.
* **Granular Pagination:** Clean pagination layout restricting views between 6 to 12 lawyer item cards per view page.

### 4. Interactive Details Hub
* **Public Read-Only Mode:** Guests and clients can examine lawyer biographies, transparent consultation hourly fees, sign-up timelines, and availability states.
* **Secure Actions Block:** Contextual modal windows prompting authenticated users to confirm hiring requests safely.

---

## 🔑 Role-Specific Client Dashboards (`/dashboard`)

The application automatically resolves user roles to parse customized layout panels containing individual side-navigation links:

### 👤 User (Client) Panel
* **Hiring History Ledger:** Tracks lawyer name, niche details, cost matrices, and active status updates (`Pending`, `Accepted`, or `Rejected`).
* **Interactive Payments System:** Fully working **Stripe payment integration** triggered from the dashboard row when a lawyer accepts a request. Successfully paid states disable the CTA and lock to a **"Paid"** text badge.
* **Comment Hub:** Dedicated review workspace where users can review, **Edit**, or **Delete** comments they've made on profiles.

### 💼 Lawyer Panel
* **Service Configurations:** Dedicated profile management form supporting text updates, bios, hourly fees, and direct media sync to **imgBB API** for high-resolution profile pictures.
* **Request Processing Center:** Clean interface allowing individual specialists to accept or decline inbound user consultation workflows.

### 🛠️ Administrative Suite
* **User Matrix Board:** List layout supporting real-time account deletion or instant structural privilege changes (User ↔ Lawyer ↔ Admin).
* **Financial Auditing Log:** Unified transaction ledger parsing Stripe unique identifiers, client profiles, processing dates, and amounts.
* **Analytical Engine:** Graphic statistical widgets mapping total users, active lawyers, completed contracts, and gross income calculations.

---

## 🛡️ Robust Security & Route Integrity

* **Authentication Ecosystem:** Combines standard credential fields with secure Google Login (OAuth) using structured JWT tokens.
* **State Rehydration Guard:** Implements state token persistence. **Refreshing any private dashboard route will not redirect the authenticated user back to the login screen.**
* **Client-Side Validation:** Form handlers feature strict entry constraints matching unique mail conditions and dual password confirmation matches.

---

## 🛠️ Local Setup & Environment Templates

To replicate this client build locally, construct a `.env.local` configuration sheet within the frontend directory root folder:

