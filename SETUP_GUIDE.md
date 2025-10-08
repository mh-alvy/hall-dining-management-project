# Hall Dining Management System - Setup Guide

## 📁 Complete Project Structure

```
hall-dining-system/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Login.tsx
│   │   ├── Header.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TokenPurchase.tsx
│   │   ├── MealCancellation.tsx
│   │   ├── PaymentGateway.tsx
│   │   ├── Billing.tsx
│   │   ├── DiningMonthManager.tsx
│   │   └── CancellationApproval.tsx
│   ├── contexts/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── pricing.ts
│   │   └── dateUtils.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── netlify.toml
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 🚀 Quick Setup Steps

### 1. Create Project Folder
```bash
mkdir hall-dining-system
cd hall-dining-system
```

### 2. Initialize Package.json
```bash
npm init -y
```

### 3. Install Dependencies
```bash
# Production dependencies
npm install react@^18.3.1 react-dom@^18.3.1 lucide-react@^0.344.0

# Development dependencies
npm install -D @types/react@^18.3.5 @types/react-dom@^18.3.0 @vitejs/plugin-react@^4.3.1 autoprefixer@^10.4.18 eslint@^9.9.1 eslint-plugin-react-hooks@^5.1.0-rc.0 eslint-plugin-react-refresh@^0.4.11 globals@^15.9.0 postcss@^8.4.35 tailwindcss@^3.4.1 typescript@^5.5.3 typescript-eslint@^8.3.0 vite@^5.4.2 @eslint/js@^9.9.1
```

### 4. Create All Files
Copy the content from each file in the Bolt project to create the corresponding files locally.

### 5. Start Development Server
```bash
npm run dev
```

## 🔐 Demo Credentials

### Student Login
- **Email**: john.doe@university.edu
- **Password**: student123

### Manager Login
- **Email**: manager@university.edu
- **Password**: manager123

## 🌐 Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

## 📝 Important Files Content

### package.json
```json
{
  "name": "hall-dining-management-system",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "lucide-react": "^0.344.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.1",
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^9.9.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.11",
    "globals": "^15.9.0",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.5.3",
    "typescript-eslint": "^8.3.0",
    "vite": "^5.4.2"
  }
}
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hall Dining Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 🔧 Troubleshooting

### If you get dependency errors:
```bash
npm install --legacy-peer-deps
```

### If TypeScript errors occur:
```bash
npm run build
```

### If Tailwind styles don't load:
Make sure `src/index.css` contains:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 📞 Support

If you encounter any issues:
1. Check that all files are created with correct content
2. Ensure all dependencies are installed
3. Verify the file structure matches exactly
4. Run `npm install` again if needed

---

Happy coding! 🚀