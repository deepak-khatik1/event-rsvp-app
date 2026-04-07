# Event App - Frontend

React frontend for the Event Management Application. This is a modern, responsive web application built with React, Vite, and Tailwind CSS for creating, managing, and RSVPing to events.

## 🛠️ Technology Stack

- **React 19.2.4** - Modern React with hooks and functional components
- **React Router 7.14.0** - Client-side routing and navigation
- **Tailwind CSS 4.2.2** - Utility-first CSS framework for styling
- **Axios 1.14.0** - HTTP client for API communication
- **Socket.IO Client 4.8.3** - Real-time communication with server
- **Vite 8.0.4** - Fast build tool and development server

## 📁 Project Structure

```
client/
├── public/               # Static assets
│   ├── favicon.svg      # Application favicon
│   └── icons.svg        # Icon assets
├── src/
│   ├── assets/          # Project assets and images
│   ├── components/      # Reusable UI components
│   │   ├── AdminRoute.jsx      # Admin route protection
│   │   ├── EventCard.jsx       # Event card component
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── ProtectedRoute.jsx  # Authentication protection
│   │   └── RsvpButton.jsx      # RSVP functionality
│   ├── context/         # React context providers
│   ├── pages/           # Page components
│   │   ├── Events.jsx          # Events listing page
│   │   ├── EventDetail.jsx     # Event details page
│   │   ├── Login.jsx           # User login page
│   │   ├── Register.jsx        # User registration page
│   │   ├── MyEvents.jsx        # User's RSVP history
│   │   └── AdminDashboard.jsx  # Admin management panel
│   ├── App.jsx          # Main application component with routing
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles and Tailwind imports
├── .gitignore           # Git ignore configuration
├── eslint.config.js     # ESLint configuration
├── index.html           # HTML template
└── package.json         # Dependencies and scripts
```

## 🚀 Features

### User Interface
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, intuitive interface using Tailwind CSS
- **Real-time Updates**: Live RSVP counts and event updates via Socket.IO
- **Image Support**: Event image display and previews

### Pages & Components
- **Authentication Pages**: Login and registration with form validation
- **Events Listing**: Browse all available events with search and filtering
- **Event Details**: Comprehensive event information with RSVP functionality
- **My Events**: Personal RSVP history and status tracking
- **Admin Dashboard**: Event management and user administration (admin only)

### Key Features
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin-only routes and functionality
- **Real-time Communication**: Instant updates for RSVP changes
- **Form Validation**: Client-side validation for all forms
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot reload. The app will be available at `http://localhost:5173`.

### Build
```bash
npm run build
```
Builds the app for production. Creates optimized static files in the `dist` directory.

### Preview
```bash
npm run preview
```
Previews the production build locally. Useful for testing the production build before deployment.

### Lint
```bash
npm run lint
```
Runs ESLint to check for code quality and potential issues.

## 🔧 Development

### Environment Setup
The frontend expects the backend API to be running on `http://localhost:5000` during development. API endpoints are configured to use relative paths, so the proxy configuration in Vite handles the communication.

### Key Components

#### Authentication Flow
- `ProtectedRoute.jsx` - Protects routes that require authentication
- `AdminRoute.jsx` - Protects admin-only routes
- Authentication state managed through React Context

#### Real-time Features
- Socket.IO integration for live RSVP updates
- Automatic reconnection handling
- Event listeners for real-time data synchronization

#### Styling
- Tailwind CSS for utility-first styling
- Responsive design patterns
- Consistent color scheme and spacing
- Custom components for reusable UI patterns

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: < 768px - Stacked layout, full-width components
- **Tablet**: 768px - 1024px - Adjusted spacing and layout
- **Desktop**: > 1024px - Multi-column layouts, optimal spacing

## 🔒 Security Considerations

- JWT tokens stored securely in localStorage
- Automatic token refresh and expiration handling
- Protected routes with authentication checks
- Admin role verification for sensitive operations
- Input sanitization and validation

## 🚀 Deployment

### Production Build
The production build creates static files that can be served by any web server or CDN. The build process includes:
- Code minification and optimization
- Tree shaking to remove unused code
- Asset optimization and bundling
- Source map generation for debugging

### Environment Variables
Create a `.env` file in the client root for environment-specific configuration:
```env
VITE_API_URL=http://localhost:5000
```

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Ensure the backend server is running and CORS is configured properly
2. **Socket Connection Issues**: Check that the backend Socket.IO server is running
3. **Build Errors**: Clear the `node_modules` and `.vite` cache, then reinstall dependencies

### Development Tips
- Use the React Developer Tools browser extension for debugging
- Check the browser console for Socket.IO connection status
- Use the Network tab to monitor API calls and responses
- Enable hot reload for faster development cycles

## 📈 Performance

The application is optimized for performance with:
- Code splitting and lazy loading
- Optimized bundle sizes with Vite
- Efficient React rendering with proper key usage
- Image optimization and lazy loading
- Minimal re-renders with proper state management
