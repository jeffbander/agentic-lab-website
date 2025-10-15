# Agentic Laboratory Website

An interactive, engaging showcase of the Mount Sinai West Agentic Laboratory's groundbreaking work in AI-driven healthcare software development.

## 🚀 What's Been Built

### ✅ Completed Features

1. **Project Structure**
   - React 19 + Vite + TypeScript
   - Tailwind CSS with official Mount Sinai brand colors
   - Organized component architecture with lazy loading
   - Netlify serverless functions integration

2. **Core Sections**
   - **Hero Section**: Animated statistics with counter animations
   - **Overview Section**: Mission, problem/solution, key highlights, stats
   - **Projects Section**: Interactive cards for all 5 healthcare applications
   - **Approach Section**: 6-phase methodology, tech stack, guiding principles
   - **Impact Section**: Clinical outcomes, financial metrics, operational efficiency
   - **Video Generator** 🎬 NEW: AI-powered video generation with Sora 2
   - **Contact Section**: Working contact form with validation

3. **Interactive Visualizations**
   - Workflow diagram (6-phase development process)
   - MCP architecture diagram with data flow
   - Voice biomarker detection flow
   - Clinical impact dashboard with charts
   - ROI calculator with real-time calculations

4. **AI Video Generator** 🎥 NEW
   - OpenAI Sora 2 integration
   - 4 preset prompts from SORA_VIDEO_GUIDE.md
   - Custom prompt support
   - Real-time video generation (2-5 minutes)
   - Video gallery with download functionality
   - Netlify serverless backend

5. **Animation Features**
   - Animated counter component with scroll triggers
   - Scroll reveal animations
   - Smooth transitions and hover effects
   - Framer Motion integration
   - Reduced motion accessibility support

## 🎯 Current Status

**Development Server**: Running at `http://localhost:5173/`

The website currently features:
- ✅ Beautiful, responsive hero section
- ✅ Animated statistics that count up on scroll
- ✅ Professional navigation with Mount Sinai branding
- ✅ Project showcase with all 5 healthcare applications
- ✅ Interactive project cards with tech stacks and metrics
- ✅ Mobile-responsive design
- ✅ Smooth animations and transitions

## 📋 Next Steps (Per PRD)

### Phase 2: Interactive Diagrams (Week 2)
- [ ] Build animated workflow diagram (6-phase development process)
- [ ] Create MCP architecture diagram with data flow
- [ ] Build voice biomarker detection flow visualization
- [ ] Add click interactions and tooltips

### Phase 3: Data Visualizations (Week 3)
- [ ] Build clinical impact dashboard with charts
- [ ] Implement ROI calculator
- [ ] Create project comparison matrix
- [ ] Add GitHub stats integration

### Phase 4: Project Deep Dives (Week 4)
- [ ] Create detailed project pages
- [ ] Add code examples with syntax highlighting
- [ ] Build screenshot galleries
- [ ] Add before/after comparisons

### Phase 5: Engagement Features (Week 5)
- [ ] Build contact form
- [ ] Add video backgrounds
- [ ] Implement "What is Agentic Coding?" tutorial
- [ ] Add micro-interactions throughout

### Phase 6: Testing & Optimization (Week 6)
- [ ] Performance optimization
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing
- [ ] SEO optimization

## 🛠️ Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with official Mount Sinai brand colors
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Diagrams**: React Flow
- **Icons**: Lucide React
- **Serverless**: Netlify Functions
- **AI Integration**: Azure OpenAI (Sora 2 for video generation)

## 📦 Dependencies Installed

```json
{
  "framer-motion": "^12.23.24",
  "recharts": "^3.2.1",
  "reactflow": "^11.11.4",
  "lucide-react": "^0.545.0",
  "react-intersection-observer": "^9.16.0",
  "tailwindcss": "^4.1.14"
}
```

## 🎨 Design System

### Colors
- **Sinai Blue**: Primary brand color (various shades)
- **Sinai Maroon**: Secondary brand color
- **Gray Scale**: For text and backgrounds

### Typography
- **Font Family**: Inter (sans-serif)
- **Responsive scales**: Mobile-first approach

### Animations
- Smooth fade-ins on scroll
- Counter animations for statistics
- Hover effects on cards and buttons
- Mobile-optimized performance

## 🚀 Getting Started

### Basic Setup

```bash
# Navigate to project
cd agentic-lab-website

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Video Generator Setup

To enable the AI Video Generator feature:

1. **Get Azure OpenAI Access**:
   - Create account at https://portal.azure.com
   - Apply for Azure OpenAI access
   - Deploy Sora 2 model

2. **Configure Environment Variables**:
   ```bash
   # Copy example env file
   cp .env.example .env

   # Edit .env with your credentials
   VITE_AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
   VITE_AZURE_OPENAI_API_KEY=your-api-key-here
   VITE_AZURE_OPENAI_API_VERSION=preview
   VITE_AZURE_OPENAI_MODEL=sora
   ```

3. **Deploy to Netlify**:
   - Add environment variables in Netlify Dashboard
   - See `VIDEO_GENERATOR_SETUP.md` for detailed instructions

📖 **Full Setup Guide**: See [VIDEO_GENERATOR_SETUP.md](./VIDEO_GENERATOR_SETUP.md)

## 📁 Project Structure

```
agentic-lab-website/
├── src/
│   ├── components/
│   │   ├── animations/
│   │   │   ├── AnimatedCounter.tsx
│   │   │   └── ScrollReveal.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectsSection.tsx
│   │   ├── Hero.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── data/
│   │   └── projects.ts
│   ├── hooks/
│   │   └── useScrollAnimation.ts
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   └── index.css
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎯 Key Features

1. **Animated Statistics**: Count-up animations for key metrics
2. **Responsive Design**: Mobile-first, works on all devices
3. **Interactive Cards**: Hover effects and smooth transitions
4. **Type-Safe**: Full TypeScript support
5. **Performance**: Optimized with Vite and lazy loading
6. **Accessible**: Semantic HTML and ARIA labels

## 📊 Current Metrics (Per PRD)

- **PR Acceptance Rate**: 83.8%
- **Time Reduction**: 60-80%
- **Annual Cost Savings**: $50k-200k per project
- **Early Detection**: 2-3 weeks before symptoms
- **Projects Completed**: 5 production applications
- **Development Speed**: 4-8 weeks per project

## 🔗 Links

- **GitHub**: https://github.com/jeffbander
- **Mount Sinai West**: Agentic Laboratory
- **Live Site**: (Coming soon after deployment)

## 📝 Notes for Continued Development

The foundation is complete and running successfully. The next priority items from the PRD are:

1. **Interactive Workflow Diagram** - HIGH PRIORITY
   - 6-phase development process
   - Click-to-expand details
   - Animated transitions

2. **MCP Architecture Visualization** - HIGH PRIORITY
   - Show data flow from AI agents through MCP to EHR
   - Animated data packets
   - Security layer highlights

3. **Clinical Impact Dashboard** - HIGH PRIORITY
   - Charts showing outcomes across projects
   - Interactive data visualizations
   - Real-time metrics

---

**Built with Claude Code following the comprehensive PRD**
**Mount Sinai West - Agentic Laboratory**
**October 2025**
