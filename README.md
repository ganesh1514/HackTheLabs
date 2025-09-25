# LabURL

## 🚀 About the Project  
**LabURL** is a web-based application that allows users to **shorten URLs, manage them efficiently, and analyze usage statistics**. It provides features like:  
- Creating and sharing shortened links.  
- Tracking clicks and analytics (device stats, city stats, etc.).  
- User authentication with login/signup and password reset.  
- Dashboard to manage and monitor all links in one place.  

This project was built during **HackTheLabs** hackathon to make link management simple, secure, and insightful.  

---

## 🛠️ Tech Stack  
- **Frontend:** React (Vite), JSX, Tailwind CSS  
- **Backend & Database:** Supabase (for auth, database, and API integration)  
- **Deployment:** Vercel  
- **Other Tools:** ShadCN UI components, Context API (state management), Custom Hooks  

---

## 🌱 Contribution & Impact  
This project contributes by providing:  
- A **developer-friendly solution** for secure and scalable link management.  
- Secure authentication flows with **Supabase Auth**.  
- Analytics-driven insights into link usage patterns.  
- A modular, component-driven architecture making it easy to extend.  

---

## 📂 Project Structure  
```bash
├── .gitignore
├── README.md
├── components.json
├── eslint.config.js
├── index.html
├── jsconfig.json
├── package-lock.json
├── package.json
├── public
│   └── logo.svg
├── src
│   ├── App.jsx
│   ├── Hooks/
│   │   └── useFetch.jsx
│   ├── components/
│   │   ├── LoadingSpinner.jsx
│   │   └── ui/...
│   ├── constants/
│   │   └── faq.js
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── db/ (APIs & Supabase integration)
│   ├── layouts/
│   │   └── AppLayout.jsx
│   ├── lib/ (utility functions)
│   ├── pages/ (App pages & routing)
│   ├── index.css
│   └── main.jsx
├── vercel.json
└── vite.config.js
```

## ⚙️ Run it Locally

Follow these steps to run the project on your local machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/ganesh1514/HackTheLabs.git
   cd HackTheLabs
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   - Create a ```.env``` file in the project root.
   - Add the required environment variable (Supabase URL, Anon/Public Key, etc).
   Example:
   ```env
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Start the dev server**
   ```bash
   npm run dev
   ```
5. **Open in browser**
   ```bash
   http://localhost:5173
   ```
> Note: make sure you also configure the google OAuth settings when adding the OAuth provider on Supabase.


