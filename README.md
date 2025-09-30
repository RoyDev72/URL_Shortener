A modern, full-stack URL shortener built with React and Supabase.

## Features

- 🔗 Shorten long URLs instantly
- ✏️ Custom short URLs
- 📊 Click analytics (location, device, total clicks)
- 📦 QR code generation and download
- 🧑 User authentication (Supabase Auth)
- 🗑️ Delete and manage your links

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (Database, Auth, Storage)
- **Deployment:** Vercel

## Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your Supabase project details:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run locally:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Deployment

- Deploy instantly to [Vercel](https://vercel.com/) (recommended).
- Add your environment variables in the Vercel dashboard.

## Screenshots

_Add screenshots of your app here!_

## License

MIT

---

**Made with ❤️ using React & Supabase**