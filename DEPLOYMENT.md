# Website Deployment Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   cd CivilAviationMockExam-Website
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Deployment Options

### Vercel (Recommended - Free)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy automatically

### Netlify

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build: `npm run build`
3. Deploy: `netlify deploy --prod`

### Custom Domain

1. Update `sitemap.xml` with your domain
2. Update `robots.txt` with your domain
3. Add your domain in hosting provider
4. Update metadata in `app/layout.tsx` if needed

## SEO Checklist

- [x] Meta tags configured
- [x] Open Graph tags
- [x] Semantic HTML
- [x] Alt text for images
- [x] robots.txt
- [x] sitemap.xml
- [ ] Google Analytics (add if needed)
- [ ] Google Search Console verification

## Customization

### Update Images

Replace Unsplash image URLs with your own:
- Hero section: `components/Hero.tsx`
- PPL Info: `components/PPLInfo.tsx`
- Sections: `components/Sections.tsx`

### Update Colors

Edit `tailwind.config.js` to change color scheme.

### Update Content

Edit component files in `components/` directory.

## Performance

- Images are optimized automatically
- Next.js provides automatic code splitting
- Static generation for fast loading
- SEO-friendly URLs

