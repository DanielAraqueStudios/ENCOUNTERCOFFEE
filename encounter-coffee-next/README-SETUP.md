# Encounter Coffee - Next.js Setup

## ✅ Installed Stack

### Core Framework
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**

### Animation Library
- **GSAP 3.x** - Professional animation library
- **@gsap/react** - React hooks for GSAP

### Styling
- **Tailwind CSS** - Utility-first CSS
- **Custom CSS modules** - For component-specific styles

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type safety

## 🚀 Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📁 Project Structure

```
encounter-coffee-next/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── HeroSection.tsx     # Hero with carousel
│   │   ├── BrandStatement.tsx  # Interactive circular animation
│   │   ├── Navigation.tsx      # Navbar
│   │   └── ...
│   ├── lib/
│   │   └── gsap-config.ts      # GSAP configuration
│   └── styles/
│       └── encounter.css       # Brand-specific styles
├── public/
│   ├── images/                 # Static images
│   └── fonts/                  # Custom fonts
└── package.json
```

## 🎨 Next Steps

1. **Convert HTML sections to React components**
2. **Implement clock-like circular animation with GSAP**
3. **Add scroll-based animations with ScrollTrigger**
4. **Optimize images with next/image**
5. **Deploy to Vercel**

## 🔧 GSAP Features Available

- ✅ Timeline animations
- ✅ ScrollTrigger (scroll-based animations)
- ✅ SVG morphing
- ✅ Rotation with easing
- ✅ useGSAP hook for React
- ✅ Context-safe animations

## 📝 Development Server

Server runs on: http://localhost:3000

Ready to describe the clock animation! 🕐
