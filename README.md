# Shortnrr — URL Shortener

Shortnrr is a web-based URL shortener that lets users create and manage short links, generate QR codes, and view basic click analytics.

**Live Demo:** https://shortnrr-omega.vercel.app/  
**Repository:** https://github.com/Taha-devx/Shortnrr-URL-Shortner-

![Shortnrr banner](public/banner.png)

## Features

- **User authentication** — Sign up and log in with Supabase Auth.
- **Profile pictures** — Upload and display a profile picture.
- **Short link creation** — Turn long URLs into shorter links.
- **Custom aliases** — Optionally choose a custom short URL.
- **QR code generation** — Generate a QR code for each short link.
- **Link management** — View, search, copy, download QR codes, and delete links.
- **Click analytics** — Track total clicks for each link.
- **Location analytics** — Display available city information for clicks.
- **Device analytics** — View clicks grouped by device type.
- **Responsive interface** — Built with React and Tailwind CSS.

## Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development server and build tool |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| shadcn/ui components | UI components |
| Supabase | Authentication, database, and file storage |
| Recharts | Analytics charts |
| `react-qrcode-logo` | QR code generation |
| `ua-parser-js` | Device type detection |
| Yup | Form validation |
| Lucide React | Icons |
| Vercel | Deployment |

## Getting Started

Follow these steps to run Shortnrr locally.

### Prerequisites

- Node.js (a current LTS version is recommended)
- npm
- A Supabase project

### 1. Clone the repository

```bash
git clone https://github.com/Taha-devx/Shortnrr-URL-Shortner-.git
cd Shortnrr-URL-Shortner-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_or_publishable_key
```

Get these values from your Supabase project's API settings.

> Never put your Supabase service-role key or other server-side secrets in frontend environment variables. Vite exposes variables prefixed with `VITE_` to the browser.

### 4. Configure Supabase

Shortnrr uses Supabase for authentication, database operations, and image storage.

Before running the application, configure your Supabase project:

1. Enable the Email provider under **Authentication → Sign In / Providers**.
2. Configure the authentication Site URL and redirect URLs for your local and deployed app.
3. Create the database tables and columns used by the application:
   - `urls` — stores link details, ownership, short codes, QR image URL, and creation time.
   - `clicks` — stores click records, the associated URL, city, country, and device type.
4. Create the public storage buckets used by the application:
   - `Qrs` — stores generated QR code images.
   - `profile_pic` — stores user profile pictures.
5. Configure appropriate Row Level Security (RLS) policies and storage policies before allowing public use.

The application expects the `urls` and `clicks` tables and storage buckets to use the names above. Review the database calls in `src/db/` when setting up your schema and policies.

### 5. Start the development server

```bash
npm run dev
```

Open the local URL printed in your terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates a production build |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs Oxlint |

## Project Structure

```text
Shortnrr-URL-Shortner-/
├── public/                 # Static assets and images
├── src/
│   ├── components/         # Reusable UI and feature components
│   │   └── ui/             # UI primitives
│   ├── context.jsx         # Authentication and user context
│   ├── db/                 # Supabase client and data operations
│   ├── hooks/              # Custom React hooks
│   ├── layout/             # Shared application layout
│   ├── pages/              # Landing, auth, dashboard, link and redirect pages
│   ├── App.jsx             # Application routes
│   └── main.jsx            # Application entry point
├── index.html
├── vercel.json             # SPA route rewrite for Vercel
├── vite.config.js
└── package.json
```

## How It Works

1. A user signs in to Shortnrr.
2. The user enters a destination URL and gives the link a title.
3. Shortnrr generates a short code, or uses the optional custom alias.
4. A QR code is generated for the short URL and stored in Supabase Storage.
5. The link record is saved in the Supabase database.
6. When someone opens the short URL, the app looks up the destination and redirects the visitor.
7. Click information is stored in the `clicks` table and displayed in the link analytics page.

## Deployment

The frontend is deployed on Vercel and uses Supabase for backend services.

For your own deployment:

1. Import the repository into Vercel.
2. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY` under the project's Environment Variables.
3. Deploy the project.
4. Add your Vercel deployment URL to the Supabase authentication Site URL and allowed redirect URLs.

The included `vercel.json` rewrites application routes to `index.html`, allowing client-side routes and short-link paths to work on Vercel.

## Notes

- Location information depends on the availability and accuracy of the IP geolocation service. Some clicks may have an unknown location.
- Device analytics depend on browser user-agent information and may not identify every device perfectly.
- Do not commit your `.env` file. It is excluded through `.gitignore`.
- Configure and test Supabase RLS and storage policies before using the application with real users.

## Future Improvements

Potential areas for future development:

- More robust server-side redirect and click tracking.
- Improved email verification and account flows.
- Link expiration and advanced link controls.
- More detailed analytics and filtering.
- Automated tests and stronger error handling.

## Author

**Taha Ansari**

- GitHub: [@Taha-devx](https://github.com/Taha-devx)
- Project: [Shortnrr](https://shortnrr-omega.vercel.app/)
