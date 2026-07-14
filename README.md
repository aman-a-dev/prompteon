# Prompteon

A social media platform for AI prompts where users can discover, share, and collaborate on high-quality prompts for AI models.

## 🚀 Features

- **Prompt Discovery**: Browse and search a curated collection of AI prompts
- **Prompt Sharing**: Share your own prompts with the community
- **User Authentication**: Secure authentication with better-auth
- **Real-time Updates**: Stay updated with the latest prompts and community activity
- **Modern UI**: Beautiful and responsive interface built with shadcn/ui components
- **3D Visualization**: Interactive 3D elements powered by Three.js and React Three Fiber

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) 16.2.7 - React framework with SSR
- **React**: 19.2.4 - UI library
- **TypeScript**: 5.x - Type-safe development
- **Styling**: 
  - [TailwindCSS](https://tailwindcss.com/) 4.x - Utility-first CSS
  - [CSS Modules](https://github.com/css-modules/css-modules) - Scoped styling
- **UI Components**: 
  - [shadcn/ui](https://ui.shadcn.com/) - High-quality component library
  - [Base UI](https://base-ui.com/) - Unstyled components
  - [Lucide React](https://lucide.dev/) - Icon library
  - [Tabler Icons](https://tabler.io/icons) - Additional icons

### Backend & Database
- **Authentication**: [better-auth](https://github.com/better-auth/better-auth) 1.6.13
- **Database**: PostgreSQL with [Prisma](https://www.prisma.io/)
- **ORM**: [@prisma/client](https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma) 7.8.0
- **Database Adapter**: [@prisma/adapter-pg](https://www.prisma.io/docs/orm/overview/databases/postgresql) 7.8.0

### 3D & Graphics
- [Three.js](https://threejs.org/) 0.184.0 - 3D graphics library
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) 9.6.1 - React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) 10.7.7 - Useful helpers for React Three Fiber

### Animations & Motion
- [Motion](https://motion.dev/) 12.40.0 - Animation library
- [Lenis](https://lenis.darkroom.engineering/) 1.3.23 - Smooth scrolling
- [Embla Carousel](https://www.embla-carousel.com/) 8.6.0 - Carousel component
- [tw-animate-css](https://github.com/themaxdavitt/tw-animate-css) 1.4.0 - Tailwind animations

### Utilities & Tools
- [Zod](https://zod.dev/) 4.4.3 - TypeScript-first schema validation
- [date-fns](https://date-fns.org/) 4.4.0 - Date utilities
- [Sonner](https://sonner.emilkowal.ski/) 2.0.7 - Toast notifications
- [React Dropzone](https://react-dropzone.js.org/) 17.0.0 - File upload handling
- [React Resizable Panels](https://github.com/bvaughn/react-resizable-panels) 4.11.2 - Resizable UI panels
- [Recharts](https://recharts.org/) 3.8.0 - Charting library
- [Vaul](https://vaul.emilkowal.ski/) 1.1.2 - Drawer component
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) 2.6.1 - File storage
- [Command Menu](https://cmdk.paco.sh/) 1.1.1 - Command palette
- [Input OTP](https://input-otp.rodz.dev/) 1.4.2 - OTP input component

### Development Tools
- **ESLint**: 9.x - Code linting
- **Babel React Compiler**: 1.0.0 - React code compilation
- **tsx**: 4.22.4 - TypeScript execution
- **PostCSS**: 4.x - CSS processing

## 📦 Language Composition

- **TypeScript**: 95.8%
- **CSS**: 3.7%
- **JavaScript**: 0.5%

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aman-a-dev/prompteon.git
   cd prompteon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/prompteon
   # Add other required environment variables
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📝 Available Scripts

```bash
# Development server with webpack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## 📂 Project Structure

```
prompteon/
├── src/              # Source code
├── public/           # Static assets
├── prisma/           # Database schema and migrations
├── components.json   # shadcn/ui configuration
├── next.config.ts    # Next.js configuration
├── tsconfig.json     # TypeScript configuration
└── tailwind.config.* # Tailwind CSS configuration
```

## 🔐 Authentication

Prompteon uses [better-auth](https://www.better-auth.com/) for secure user authentication. This provides:
- Email/password authentication
- OAuth integration support
- Session management
- User profile management

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. Key features:
- Type-safe database queries
- Automatic migrations
- Schema validation
- PostgreSQL adapter for optimal performance

## 🎨 UI Framework

Built with [shadcn/ui](https://ui.shadcn.com/) components on top of Tailwind CSS, providing:
- Accessible components
- Customizable themes
- Dark mode support
- Responsive design

## 🔗 API Integration

- **File Storage**: Vercel Blob for storing and managing files
- **Real-time Features**: Ready for WebSocket integration
- **Data Validation**: Zod for runtime type checking

## 📱 Responsive Design

The platform is fully responsive and works across:
- Desktop browsers
- Tablets
- Mobile devices

## 🌙 Theme Support

Built-in theme support with [next-themes](https://github.com/pacocoursey/next-themes):
- Light mode
- Dark mode
- System preference detection

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source. Check the repository for license details.

## 👥 Author

Created by [aman-a-dev](https://github.com/aman-a-dev)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Authentication via [better-auth](https://www.better-auth.com/)
- 3D graphics with [Three.js](https://threejs.org/)

## 📞 Support

For issues, questions, or suggestions, please open an issue on the [GitHub repository](https://github.com/aman-a-dev/prompteon/issues).

---

**Happy prompting!** 🚀✨
