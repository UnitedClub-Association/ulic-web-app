Directory Structure Suggestion for ULIC App
This document suggests a directory structure for the ULIC cross-platform app, optimized for Web, Desktop, Android, and iOS platforms using Supabase, PWA, and Capacitor.
Suggested Directory Structure
.
├── android/                            # Capacitor-generated Android project
├── ios/                               # Capacitor-generated iOS project
├── desktop/                           # Desktop app files
│   └── electron/                      # Electron app for Windows, Linux, macOS
│       ├── main.js                    # Electron main process
│       ├── package.json               # Electron project config
│       └── preload.js                 # Electron preload script
├── web/                               # Web app source (PWA root)
│   ├── pages/                        # Page-specific HTML files
│   │   ├── login.html                # Login/Sign Up page
│   │   ├── home.html                 # Home page
│   │   ├── calendar.html             # Calendar page
│   │   ├── events.html               # Events page
│   │   ├── projects.html             # Projects page
│   │   ├── profile.html              # Profile page
│   │   ├── admin.html                # Admin page for event management
│   │   └── lessons.html              # Lessons page for Learn and Build
│   ├── components/                   # Reusable components
│   │   └── sidebar.js                # Side navigation bar component
│   ├── styles/                       # CSS files
│   │   ├── main.css                  # Main styles (renamed from styles.css)
│   │   └── theme.css                 # Light/dark mode styles
│   ├── scripts/                      # JavaScript files
│   │   ├── app.js                    # Supabase integration and main logic
│   │   ├── auth.js                   # Authentication logic
│   │   ├── events.js                 # Event-related logic
│   │   ├── profile.js                # Profile-related logic
│   │   └── search.js                 # Search functionality
│   ├── serviceworker.js              # Service worker for PWA
│   └── manifest.json                 # PWA manifest
├── assets/                            # Shared assets
│   ├── images/                       # Image assets
│   │   ├── ulic-hero-banner.jpg      # Header background
│   │   ├── ulic-logo.ico             # Favicon
│   │   ├── ulic-logo.jpg             # Logo
│   │   ├── ulic-favicon.jpg          # Fallback favicon
│   │   ├── uca_logo.png              # UCA logo
│   │   ├── build-your-portfolio-banner.png # Banner image
│   │   ├── ulic-favicon-192.png      # PWA icon (192x192)
│   │   ├── ulic-favicon-512.png      # PWA icon (512x512)
│   │   ├── screenshot1.png           # PWA screenshot (600x400)
│   │   ├── screenshot2.png           # PWA screenshot (600x400)
│   │   ├── shortcut1_icon.png        # Shortcut icon (192x192)
│   │   ├── home_icon.png             # Home nav icon
│   │   ├── calendar_icon.png         # Calendar nav icon
│   │   ├── events_icon.png           # Events nav icon
│   │   ├── projects_icon.png         # Projects nav icon
│   │   └── profile_icon.png          # Profile nav icon
│   └── fonts/                        # Custom fonts
│       └── Blanka.otf                # Blanka font
├── scripts/                           # Utility scripts
│   └── print_directory_tree.ps1      # Directory tree generator
├── capacitor.config.json              # Capacitor configuration
├── package.json                       # Node.js dependencies
├── README.md                         # Project documentation
├── roadmap.md                         # Development roadmap
├── .gitattributes                    # Git configuration
└── directory_tree.txt                 # Generated directory tree

Notes on Directory Structure

Web Directory:
pages/: Separate HTML files for each page (login, home, calendar, etc.) to support single-page navigation or multi-page routing.
components/: Reusable sidebar component for navigation.
styles/: Split CSS into main.css (core styles) and theme.css (light/dark mode).
scripts/: Modular JavaScript files for specific features (auth, events, profile, search).
serviceworker.js and manifest.json: Ensure PWA functionality.


Assets:
Added navigation icons (home_icon.png, etc.) for sidebar.
Included missing PWA assets (screenshot1.png, screenshot2.png, shortcut1_icon.png).


Root Files:
package.json includes dependencies for Capacitor, Electron, and Supabase.
roadmap.md and README.md provide documentation.
capacitor.config.json points to web/ as webDir.



Next Steps

Implement web app features as per requirements (Login/Sign Up, Home, Calendar, Events, Projects, Profile, Admin, Search).
Test PWA functionality with PWABuilder.
Prepare for Phase 2 (Desktop) by configuring Electron.
