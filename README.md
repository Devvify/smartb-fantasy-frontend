# SmartB Fantasy Frontend

A production-ready Next.js 16 application for SmartB fantasy sports competitions with real API integration, dynamic sports filtering, responsive design, and optimal performance using Turbopack.

## 🚀 Live Demo

**Production URL**: [fantasy.devvify.dev](https://fantasy.devvify.dev)  

**Staging URL**: [au.testing.smartb.com.au/fantasy](https://au.testing.smartb.com.au/fantasy)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Integration](#api-integration)
- [Architecture](#architecture)
- [Performance Optimizations](#performance-optimizations)
- [Known Limitations](#known-limitations)
- [TODO & Future Improvements](#todo--future-improvements)

## 🎯 Overview

This project is a feature-rich fantasy sports platform built with Next.js 16 and React 19, featuring:

- **Dynamic Sports Integration**: Fetches sports from SmartB API (sportTypeId=2)
- **Real API Integration**: Connected to SmartB Fantasy MS API for live competition data
- **Advanced Filtering**: Multi-level filters for tournaments, teams, dates, and competition types
- **Responsive Design**: Mobile-first approach with seamless cross-device experience
- **Next.js 16 Turbopack**: Utilizing the latest build system for faster development and builds

## ✨ Features

### Core Functionality

- ✅ **Dynamic Sports Loading**: Fetches sports from API (`/api/sports/sport?sportTypeId=2`)
    - Cricket, Soccer, Basketball, Australian Rules, Rugby League
    - Displays upcoming fixtures count per sport
    - Automatic sport ID mapping (API ID ↔ route ID)
- ✅ **Status Filtering**: View Upcoming, Live, or Completed competitions
- ✅ **Contest Type Toggle**: Switch between paid SmartCoins competitions and free competitions
- ✅ **Advanced Filters Accordion**: 
    - Dynamic filter options based on status
    - Tournament selection
    - Team filtering
    - Date range picker (month/year)
    - Competition type filters
    - Caching system for filter options
- ✅ **Pagination**: Navigate through multiple pages with adjustable results per page (10/20/50)
- ✅ **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- ✅ **Competition Cards**: Display team matchups, match times, prize pools, and entry costs
- ✅ **Loading States**: Skeleton loaders and spinners for better UX
- ✅ **Error Handling**: Graceful error states with retry functionality
- ✅ **URL State Management**: Filter states reflected in URL for shareable links

### UI/UX Features

- Clean, dark-themed interface matching SmartB design system
- SVG icon support with @svgr/webpack integration
- Smooth transitions and hover effects
- Accessible navigation with proper ARIA labels
- Mobile-optimized carousel for next events
- Collapsible filter accordion with smooth animations
- Real-time visual feedback for all interactions

## 🛠 Tech Stack

- **Framework**: Next.js 16.0.10 (with Turbopack)
- **Runtime**: React 19.2.1
- **Build System**: Turbopack (default in Next.js 16) with Webpack fallback
- **Styling**: CSS Modules with CSS Variables
- **Language**: JavaScript (ES6+)
- **Package Manager**: npm
- **Icons**: SVG with @svgr/webpack for React component conversion

### Key Dependencies

- `next`: ^16.0.10 - Next.js framework with App Router
- `react`: ^19.2.1 - React library
- `react-dom`: ^19.2.1 - React DOM renderer
- `clsx`: ^2.1.1 - Utility for conditional className handling
- `@svgr/webpack`: ^8.1.0 - SVG to React component loader

### Development Tools

- `eslint`: ^9 - Code linting
- `eslint-config-next`: ^16.0.10 - Next.js ESLint configuration

## 🏁 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Devvify/smartb-fantasy-frontend.git
   cd smartb-fantasy-frontend
   ```
1. **Install dependencies**

   ```bash
   npm install
   ```
1. **Run the development server**

   ```bash
   npm run dev
   ```
1. **Open your browser**

   Navigate to [http://localhost:3000/fantasy](http://localhost:3000/fantasy)

### Build for Production

```bash
npm run build
npm start
```

The production build will be optimized with:

- Server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- CSS minification

## 🔌 API Integration

### API Endpoints Used

The application integrates with multiple SmartB API endpoints:

#### 1. Sports Data Endpoint

```
GET https://au.testing.smartb.com.au/api/sports/sport?sportTypeId=2
```

**Purpose**: Fetch available sports for tab navigation

**Response Structure**:

```json
{
  "status": true,
  "result": [
    {
      "id": 4,
      "sportName": "Cricket",
      "sportTypeId": 2,
      "upcomingFixturesCount": 2,
      "status": "active",
      "isFeatured": true,
      "sortOrder": 3
    }
  ]
}
```

#### 2. Competition Events List

```
GET https://au.testing.smartb.com.au/fantasy-ms/api/v1/fantasy/event-list
```

**Query Parameters**:

- `perPage`: Results per page (10, 20, 50)
- `page`: Page number for pagination
- `compType`: Competition type (paid/free)
- `SportId`: Sport API ID (e.g., 4 for Cricket) - from sports endpoint
- `eventType`: Event type filter
- `status`: Status filter (upcoming/live/completed)
- `comp_id`: Competition ID (1 for paid, 2 for free)
- `timezone`: User's timezone (e.g., "Australia/Sydney")

**Example Request**:

```
GET /fantasy-ms/api/v1/fantasy/event-list?perPage=10&page=1&SportId=4&status=upcoming&comp_id=1&timezone=Australia%2FSydney
```

#### 3. Filter Options Endpoint

```
GET https://au.testing.smartb.com.au/fantasy-ms/api/v1/fantasy/event-list/filters
```

**Query Parameters**:

- `status`: Status filter (upcoming/live/completed)
- `tournament_id`: Filter by specific tournament (optional)
- `team_id`: Filter by specific team (optional)
- `start_time`: Filter by date (optional)
- `month`, `year`: Filter by month/year (optional)
- `timezone`: User's timezone (conditional, based on filters)

**Purpose**: Fetch dynamic filter options (tournaments, teams, dates) based on current status

### API Integration Features

- ✅ **Dynamic Sport Mapping**: API IDs (e.g., 4) mapped to route IDs (e.g., "cricket")
- ✅ **Smart Caching**: Filter options cached in-memory with Map structure
- ✅ **Timezone Awareness**: Automatic timezone detection and conversion
- ✅ **Abort Controller**: Prevents race conditions in rapid filter changes
- ✅ **Error Boundaries**: Graceful fallback for API failures

### Data Flow

```
Client Component → Direct API Call → SmartB Fantasy MS API → Response
                        ↓
                Sport ID Mapping
                        ↓
              activeSport (route ID)
              activeSportApiId (API ID)
                        ↓
                  URL Updates
```

### API Configuration (next.config.mjs)

```javascript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "au.testing.smartb.com.au",
    },
    {
      protocol: "http",
      hostname: "media.smartb.com.au",
    },
    {
      protocol: "https",
      hostname: "media.smartb.com.au",
    },
  ],
}
```

## 🏗 Architecture

### Project Structure

```
smartb-fantasy-frontend/
├── public/
│   ├── fonts/                      # Custom fonts
│   ├── images/
│   │   └── default-team.png.txt    # Team logo placeholder
│   └── league-icons/               # League/competition icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── competitions/
│   │   │       └── route.js        # API route (if needed for proxy)
│   │   ├── fantasy/
│   │   │   ├── page.js             # Main fantasy page (Client Component)
│   │   │   ├── page.module.css     # Page-specific styles
│   │   │   ├── fantasy.css         # Additional fantasy styles
│   │   │   ├── loading.js          # Loading state component
│   │   │   ├── error.js            # Error boundary component
│   │   │   └── _components/        # Fantasy-specific components
│   │   │       ├── CompetitionCard/
│   │   │       │   ├── CompetitionCard.js
│   │   │       │   └── CompetitionCard.module.css
│   │   │       ├── Fields/
│   │   │       │   ├── DatePicker.js
│   │   │       │   ├── MultiSelectField.jsx
│   │   │       │   └── SelectField.jsx
│   │   │       ├── FiltersAccordion/
│   │   │       │   ├── FiltersAccordion.jsx
│   │   │       │   ├── FiltersAccordion.module.css
│   │   │       │   └── useEventListFilters.js  # Custom hook for filter API
│   │   │       ├── Footer/
│   │   │       │   ├── Footer.js
│   │   │       │   └── Footer.module.css
│   │   │       ├── Header/
│   │   │       │   ├── Header.js
│   │   │       │   └── Header.module.css
│   │   │       ├── NextEventsCarousel/
│   │   │       │   ├── NextEventsCarousel.js
│   │   │       │   └── NextEventsCarousel.module.css
│   │   │       ├── PageHeader/
│   │   │       │   ├── PageHeader.js
│   │   │       │   └── PageHeader.module.css
│   │   │       ├── Pagination.js
│   │   │       ├── SportTabs/
│   │   │       │   ├── SportTabs.js          # Dynamic sports from API
│   │   │       │   └── SportTabs.module.css
│   │   │       └── StatusTabs/
│   │   │           ├── StatusTabs.jsx
│   │   │           └── StatusTabs.module.css
│   │   ├── globals.css             # Global styles & CSS variables
│   │   ├── layout.js               # Root layout
│   │   ├── page.js                 # Home page
│   │   └── page.module.css         # Home page styles
│   ├── assets/
│   │   ├── icons/                  # SVG icons
│   │   └── tab-icons/              # Sport tab SVG icons
│   └── lib/
│       ├── api.js                  # API utility functions
│       └── api/
│           └── nextJumpSport.js    # Additional API utilities
├── .env.local                      # Environment variables (not in repo)
├── eslint.config.mjs               # ESLint configuration
├── jsconfig.json                   # JavaScript configuration
├── next.config.mjs                 # Next.js configuration (Turbopack + Webpack)
├── package.json                    # Dependencies
└── README.md                       # This file
```

### Component Architecture

**Client Components** (Interactive):

- `FantasyPage` (`page.js`): Main page with comprehensive state management
    - `activeSport`: Current sport ID for routing (e.g., "cricket")
    - `activeSportApiId`: API ID for API calls (e.g., 4)
    - `activeStatus`: Competition status (upcoming/live/completed)
    - `competitionType`: Paid or free competitions
    - `sportData`: Fetched sports from API
    - `filterOptions`: Dynamic filter data
- `SportTabs`: Dynamic sport tabs loaded from API with icon mapping
- `StatusTabs`: Status filter tabs (Upcoming/Live/Completed)
- `FiltersAccordion`: Collapsible advanced filters with custom hook
- `Pagination`: Page navigation with items per page control

**Server Components** (Static/Optimized):

- `Header`, `Footer`: Layout components
- `CompetitionCard`: Display component for competitions
- `PageHeader`: Breadcrumb and title component

**Custom Hooks**:

- `useEventListFilters`: Advanced filter management with caching
    - Handles abort controllers for race condition prevention
    - In-memory caching with Map structure
    - Smart merge logic for scoped vs. unscoped filters
    - Dynamic timezone handling

### State Management Strategy

The application uses React's built-in state management with strategic patterns:

1. **Component-Level State** (`useState`):

   - UI state (loading, error, isFiltersOpen)
   - Pagination state (currentPage, itemsPerPage, totalPages)
   - Filter state (activeSport, activeStatus, competitionType)
1. **Dual ID System**:

   - `activeSport`: Used for URL routing and UI state ("cricket", "football")
   - `activeSportApiId`: Used for API calls (4, 8, 9, etc.)
   - Mapping handled in SportTabs component
1. **Side Effects** (`useEffect`, `useCallback`):

   - Data fetching with dependency tracking
   - URL synchronization with router.push
   - Abort controller cleanup
1. **Props Flow**:

   - Unidirectional data flow
   - Callback props for child → parent communication
   - Minimal prop drilling (2-3 levels max)

### Styling Approach

- **CSS Variables**: Comprehensive theming system in globals.css
- **CSS Modules**: Scoped styles per component (`.module.css`)
- **Responsive Design**: Mobile-first with min-width media queries
- **BEM-like naming**: Clear, semantic class names (e.g., `tab`, `tabActive`, `tabDisabled`)
- **No External CSS Frameworks**: Lightweight, custom CSS only
- **SVG Icons**: Loaded as React components via @svgr/webpack

## ⚡ Performance Optimizations

### 1. **Next.js 16 with Turbopack**

- Lightning-fast HMR (Hot Module Replacement) in development
- Optimized production builds with automatic code splitting
- Fallback webpack configuration for production compatibility

### 2. **SVG Optimization**

- SVGs loaded as React components (tree-shakeable)
- Inline SVGs reduce network requests
- Automatic optimization with @svgr/webpack

### 3. **Client-Side Caching**

- Filter options cached in-memory with Map structure
- Prevents redundant API calls
- Smart cache invalidation based on filter parameters

### 4. **Abort Controllers**

- Race condition prevention in rapid filter changes
- Automatic cleanup of pending requests
- Improved responsiveness and reduced server load

### 5. **Image Optimization**

- Next.js Image component for automatic optimization
- Multiple remote patterns configured for SmartB media
- WebP format with fallbacks
- Lazy loading for below-the-fold images

### 6. **Code Splitting**

- Automatic route-based code splitting by Next.js
- Dynamic imports for heavy components (if needed)
- Optimized bundle sizes

### 7. **CSS Optimization**

- Minimal CSS bundle size with CSS Modules
- CSS variables for reduced duplication
- No external CSS frameworks = smaller bundle

### 8. **State Management Optimizations**

- `useCallback` for memoized functions
- Dependency arrays for controlled re-renders
- Optimistic UI updates where applicable

### 9. **API Request Optimization**

- Timezone calculated once, reused across requests
- Query parameter encoding for URL safety
- Conditional timezone parameter (only when needed)

### Performance Metrics Target

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.5s
- **Total Bundle Size**: < 200KB (gzipped)

## ⚠️ Known Limitations

### 1. **Authentication & User Features**

- No user authentication implemented
- "Sign Up" and "Log In" buttons are placeholders
- Cannot actually enter competitions
- User profile and history not available

### 2. **Team Logos & Media**

- Using placeholder images for team logos
- Real team logos require SmartB media CDN integration
- Competition images may not display correctly

### 3. **Real-Time Updates**

- Competition status not updated in real-time
- No WebSocket or polling implementation
- Requires manual refresh for live updates

### 4. **Filter Functionality**

- Advanced filters partially implemented
- Some filter combinations may not work as expected
- Date range filtering needs additional testing

### 5. **Mobile Optimization**

- Mobile carousel needs improvement
- Some touch interactions could be enhanced
- Horizontal scrolling in tables could be smoother

### 6. **Browser Compatibility**

- Optimized for modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported
- Some CSS features may not work in older browsers

### 7. **API Dependency**

- Fully dependent on SmartB API availability
- No offline mode or service worker
- Limited error recovery options

### 8. **Coming Soon Sports**

- Baseball, American Football, Ice Hockey tabs are disabled
- No API data available for these sports yet
- Icons display but functionality is blocked

## 🔮 TODO & Future Improvements

### Immediate Priorities
- [ ] Complete filter implementation (apply/reset logic, URL state persistence)
- [ ] Add competition detail pages with full information
- [ ] Implement user authentication and authorization
- [ ] Improve mobile experience (carousel, touch interactions)
- [ ] Add skeleton loaders for better loading states

### Planned Features
- [ ] User profile and competition history
- [ ] Real-time updates via WebSocket
- [ ] Team logo integration from SmartB CDN
- [ ] Search and advanced filtering
- [ ] TypeScript migration
- [ ] Testing suite (Jest, Playwright)

### Technical Improvements
- [ ] Setup CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Implement analytics
- [ ] PWA features for offline support
- [ ] Accessibility improvements (WCAG 2.1 AA)
- [ ] SEO optimization

## 📝 Environment Variables

Create a `.env.local` file in the root directory for environment-specific configuration:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://au.testing.smartb.com.au
NEXT_PUBLIC_FANTASY_MS_API=https://au.testing.smartb.com.au/fantasy-ms/api/v1
```

**Note**: Currently, the application doesn't require environment variables as API endpoints are hardcoded. This section is prepared for future enhancements.

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**

   ```bash
   # Push code to GitHub
   git push origin main
   ```
1. **Import in Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure build settings (auto-detected)
1. **Deploy**

   - Vercel will automatically build and deploy
   - Preview deployments for every PR
   - Production deployment on main branch

**Build Configuration**:

- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node Version: 18.x or higher

### Other Platforms

#### Netlify

```bash
# Build command
npm run build

# Publish directory
.next

# Node version
18
```

#### AWS Amplify

- Configure build settings similar to Vercel
- Ensure Node.js 18+ is selected

#### Self-Hosted with PM2

```bash
# Build the application
npm run build

# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "smartb-fantasy" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Docker

```dockerfile
# Create Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t smartb-fantasy .
docker run -p 3000:3000 smartb-fantasy
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Build successful locally
- [ ] All tests passing (when implemented)
- [ ] Performance metrics checked
- [ ] SEO tags verified
- [ ] Error tracking setup (Sentry)
- [ ] Analytics configured
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

## 📄 License

This project is created for development and demonstration purposes.

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**

   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
4. **Test your changes**

   ```bash
   npm run dev  # Test locally
   npm run build  # Ensure it builds
   ```
5. **Commit with clear messages**

   ```bash
   git commit -m "feat: add new feature description"
   ```
6. **Push and create Pull Request**

   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

- Use functional components with hooks
- Prefer named exports over default exports (except pages)
- Use CSS Modules for styling
- Keep components small and focused
- Add PropTypes or TypeScript types
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug
docs: Update documentation
style: Format code
refactor: Refactor code
test: Add tests
chore: Update dependencies
```

## 🐛 Bug Reports & Feature Requests

Please use GitHub Issues for bug reports and feature requests:

- **Bug Report**: Provide steps to reproduce, expected vs actual behavior
- **Feature Request**: Describe the feature and use case

## 📧 Contact

**Repository Owner**: Devvify  

**GitHub**: [@Devvify](https://github.com/Devvify)  

**Project**: [smartb-fantasy-frontend](https://github.com/Devvify/smartb-fantasy-frontend)

## 🙏 Acknowledgments

- **SmartB Team** for API access and design inspiration
- **Next.js Team** for the amazing framework
- **React Team** for the React library
- **Vercel** for hosting and deployment platform

---

**Note**: This project is built for development purposes and is not officially affiliated with or endorsed by SmartB Pty Ltd. All SmartB branding, logos, and content belong to their respective owners.

---

## 📊 Project Stats

![Next.js](https://img.shields.io/badge/Next.js-16.0.10-black?style=flat&logo=next.js)

![React](https://img.shields.io/badge/React-19.2.1-blue?style=flat&logo=react)

![License](https://img.shields.io/badge/License-MIT-green?style=flat)

**Last Updated**: December 29, 2025