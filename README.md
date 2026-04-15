# Karan Pargaien - Modern Portfolio

A modern, responsive portfolio website for Karan Pargaien, a .NET Engineer & Full-Stack Developer. Built with pure HTML, CSS, and Vanilla JavaScript with GitHub API integration.

## 🎨 Design Features

- **Dark Premium Aesthetic** - Modern dark theme with violet (#6C63FF) and teal (#00D4AA) accent colors
- **Responsive Design** - Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations** - Fluid transitions and scroll effects
- **Performance Optimized** - Lightweight, no heavy frameworks
- **Accessible** - WCAG compliant with semantic HTML

## 📋 Sections

1. **Hero Section** - Eye-catching introduction with animated code window
2. **About Me** - Professional bio with social links
3. **Technical Skills** - Organized by category (Backend, DevOps, Frontend, Database, Architecture)
4. **Work Experience** - Timeline-style experience display
5. **Featured Projects** - GitHub project cards with dynamic loading
6. **GitHub Stats** - Live GitHub activity and language statistics
7. **Contact** - Contact form and social links with gradient background effects

## 🛠 Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables and Grid/Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **GitHub API** - Real-time project and stats data

## 🎯 Key Features

- ✅ Live GitHub stats (repos, followers, stars)
- ✅ Dynamic project loading from GitHub
- ✅ Language statistics from user repositories
- ✅ Smooth scroll navigation with active link highlighting
- ✅ Contact form with email integration
- ✅ Keyboard shortcuts (J, C, A for quick navigation)
- ✅ Easter eggs and console messages
- ✅ Intersection Observer for scroll animations
- ✅ Mobile-friendly navigation
- ✅ Performance optimized (no external dependencies)

## 📱 Responsive Breakpoints

- Desktop: 1440px+
- Tablet: 1024px - 1439px
- Mobile: < 1024px

## 🚀 Getting Started

### Local Development

1. Clone/download the repository
2. Open `index.html` in your browser
3. No build process required - it's a static site!

### Customization

All colors are defined in CSS variables at the top of `css/styles.css`:

```css
:root {
    --bg-primary: #0A0A0F;
    --primary-accent: #6C63FF;
    --secondary-accent: #00D4AA;
    /* ... more variables */
}
```

### GitHub Integration

Update the username in `js/main.js`:

```javascript
const GITHUB_USERNAME = 'your-username';
```

## 🎨 Color Palette

| Variable | Color | Usage |
|----------|-------|-------|
| `--bg-primary` | #0A0A0F | Primary background |
| `--bg-secondary` | #111118 | Secondary background |
| `--border-color` | #1E1E2E | Borders and dividers |
| `--primary-accent` | #6C63FF | Violet accent (main CTA) |
| `--secondary-accent` | #00D4AA | Teal accent (highlights) |
| `--text-primary` | #F0F0FF | Primary text |
| `--text-secondary` | #6B7280 | Muted text |

## 📦 File Structure

```
portfolio/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # All styling (5000+ lines)
├── js/
│   └── main.js          # JavaScript functionality
├── assets/
│   └── images/          # Portfolio images
├── raw-designs/
│   └── portfolio-design.pen  # Pencil design files
├── data/
│   └── profile.json     # Profile data (for reference)
└── terminal-view/       # Archive of old terminal portfolio
```

## 🔄 GitHub API Integration

The portfolio automatically fetches:
- User profile data (followers, public repos)
- Repository list with stars and language info
- Language statistics
- Project descriptions

No API key required for public data!

## ♿ Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- ARIA-compliant forms
- Keyboard navigation support
- High contrast color scheme
- Focus indicators on interactive elements

## 🎯 Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## 📊 Performance

- Zero external JavaScript libraries (Vanilla JS only)
- Optimized CSS (single file, ~5000 lines)
- Lazy loading for images
- Efficient event handling
- Smooth 60fps animations

## 🚀 Deployment

### GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select `main` branch as source
4. Your portfolio is live!

### Other Platforms

- Netlify
- Vercel
- Any static hosting service

## 🔧 Customization Guide

### Change Colors

Edit `/css/styles.css` `:root` section:

```css
--primary-accent: #YOUR_COLOR;
--secondary-accent: #YOUR_COLOR;
```

### Update Content

- **profile.json**: User information (optional reference)
- **index.html**: Edit sections directly
- **js/main.js**: GitHub username configuration

### Add New Sections

1. Add section to HTML
2. Style with CSS using existing variables
3. Add interactions with JavaScript if needed

## 🤝 Contributing

Feel free to fork and customize this portfolio for your own use!

## 📄 License

This portfolio design is provided as-is for personal use.

## 📞 Contact

- Email: thekaranpargaien@gmail.com
- GitHub: https://github.com/thekaranpargaie
- LinkedIn: https://linkedin.com/in/thekaranpargaie

---

**Built with intention** • 2025
