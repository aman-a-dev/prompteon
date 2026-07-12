# Next.js Full Stack Template

A production-ready full-stack **Next.js 16** starter template featuring **Better Auth**, **Prisma ORM v7**, **PostgreSQL**, **Shadcn UI**, **TypeScript**, and a scalable project structure for building modern web applications.

## ✨ Features

- ⚡ Next.js 16 (App Router)
- 🔒 Better Auth
- 🗄️ Prisma ORM v7
- 🐘 PostgreSQL
- 🎨 Shadcn UI
- 📘 TypeScript
- 🎨 Tailwind CSS
- 🧩 Scalable project structure
- 🌙 Dark mode support
- 📱 Responsive design
- 🚀 Production-ready configuration
- 🔥 Server Actions
- 📦 Environment variable support

## 🛠 Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma ORM v7
- PostgreSQL
- Better Auth
- Shadcn UI
- Tailwind CSS

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextjs-fullstack-template.git
cd nextjs-fullstack-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root.

```env
DATABASE_URL="postgresql://..."
BETTER_AUTH_SECRET="your-secret"
BETTER_AUTH_URL="http://localhost:3000"
```

### 4. Generate the Prisma Client

```bash
npx prisma generate
```

### 5. Run database migrations

```bash
npx prisma migrate dev
```

### 6. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 📂 Project Structure

```text
NEXTJS/
├── .git/                     # Git version control files
├── node_modules/            # Installed npm packages
├── prisma/                  # Database schema and migrations
│   └── schema.prisma        # Prisma schema definition
├── src/                     # Main source code directory
│   ├── app/                 # Application routes and layouts
│   │   ├── (auth)/          # Authentication-related routes
│   │   │   └── api/         # API endpoints for auth
│   │   │       └── auth/    # Auth-related API
│   │   │           └── [...all]/  # Catch-all route for auth
│   │   │               └── route.ts  # Auth route handler
│   │   ├── (main)/          # Main application layout
│   │   │   └── layout.tsx   # Main layout component
│   │   ├── (marketing)/     # Marketing-related pages
│   │   │   ├── layout.tsx   # Marketing layout component
│   │   │   └── page.tsx     # Marketing landing page
│   │   ├── favicon.ico       # Favicon for the app
│   │   ├── globals.css       # Global CSS styles
│   │   ├── layout.tsx        # General layout component
│   │   └── layout.tsx        # Duplicate? (check for redundancy)
│   ├── components/           # Reusable components directory
│   │   ├── common/           # Commonly used components
│   │   ├── custom/           # Custom components specific to the app
│   │   ├── layout/           # Layout-specific components
│   │   ├── ui/               # UI components (buttons, forms, etc.)
│   │   └── vendor/           # Third-party or vendor components
│   ├── fonts/                # Font definitions and styles
│   │   └── font.ts           # Font configuration file
│   ├── hooks/                # Custom React hooks
│   │   └── use-mobile.ts     # Hook for mobile responsiveness
│   ├── lib/                  # Library functions and utilities
│   │   ├── auth-client.ts    # Client-side authentication logic
│   │   ├── auth.ts           # Authentication utilities
│   │   ├── prisma.ts         # Prisma client setup
│   │   └── utils.ts          # General utility functions
│   └── providers/            # Context providers for state management
│       └── theme-provider.tsx  # Theme context provider component
├── .gitignore                # Files and directories to ignore in Git
├── AGENTS.md                 # Documentation related to agents
├── CLAUDE.md                 # Documentation related to Claude project
├── components.json           # Configuration or metadata for components
├── eslint.config.mjs         # ESLint configuration file
├── next.config.ts            # Next.js configuration file
├── package-lock.json         # Lockfile for npm dependencies
├── package.json              # Project metadata and dependencies
├── postcss.config.mjs        # PostCSS configuration file
├── prisma.config.ts          # Configuration for Prisma setup
├── README.md                 # Project overview and instructions
└── tsconfig.json             # TypeScript configuration file
```

## 📜 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📦 Included

- Authentication with Better Auth
- Prisma ORM configured with PostgreSQL
- Shadcn UI components
- TypeScript configuration
- Tailwind CSS setup
- App Router architecture
- Server Actions support
- Scalable folder structure

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, open an issue, or submit a pull request.

## 📄 License

This project is licensed under the MIT License.
