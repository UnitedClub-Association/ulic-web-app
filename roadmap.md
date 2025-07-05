ULIC App Development Roadmap
This roadmap outlines the development phases for the ULIC cross-platform app, covering Web, Desktop, Android, and iOS platforms, built with Supabase, PWA, and Capacitor, and styled with the Neon Glow / Tech theme.
Phase 1: Web App

Goal: Complete a fully functional Progressive Web App (PWA) with all specified features.
Tasks:
Implement Login/Sign Up page with email and OAuth (Google, Facebook) using Supabase Authentication.
Create a side navigation bar with Home, Calendar, Events, Projects, Profile, and light/dark mode toggler.
Develop Home page with Welcome, Live Events, Upcoming Events, and Badges/Games sections.
Build Calendar page with events/sessions from October 2024 to December 2050.
Create Events page with Live, Upcoming, and All Events sections.
Develop Projects page with Learn and Build and Featured Projects sections.
Implement Profile page with editable fields, requestable fields, and admin status display.
Add search functionality for users by username/name, with follow/like features.
Create Admin page for event/session creation/deletion with GitHub banner uploads.
Ensure PWA functionality with manifest.json上网



System: - Testing: Test PWA functionality using PWABuilder.

Styling: Apply Neon Glow / Tech theme (Blanka titles, Iceberg body, #ffbd59 text, #4B0082/#2E003E background, #FFA500/#FF8C00 accents).
Timeline: Complete by [insert target date].

Phase 2: Desktop App

Goal: Build a cross-platform desktop app using Electron for Windows, Linux, and macOS.
Tasks:
Configure Electron to load the web app (web/index.html).
Implement side navigation bar for desktop, matching web design.
Ensure light/dark mode toggler works seamlessly.
Test on Windows, Linux, and macOS.
Package and distribute executables (e.g., .exe, .AppImage, .dmg).


Timeline: Complete by [insert target date].

Phase 3: Android App

Goal: Build a native Android app using Capacitor.
Tasks:
Implement bottom navigation bar for mobile (Home, Calendar, Events, Projects, Profile).
Sync web app with Android project (android/).
Test on Android devices/emulators.
Publish to Google Play Store (com.ulic.app).


Timeline: Complete by [insert target date].

Phase 4: iOS App

Goal: Build a native iOS app using Capacitor.
Tasks:
Implement bottom navigation bar for mobile, matching Android.
Sync web app with iOS project (ios/).
Test on iOS devices/simulators.
Publish to Apple App Store (com.ulic.app).


Timeline: Complete by [insert target date].

General Notes

Supabase Integration: Ensure all features (events, users, projects, etc.) integrate with Supabase tables within the 500MB limit.
Closed-Source: Maintain private GitHub repository (https://github.com/UnitedClub-Association/ulic-app).
Assets: Add missing images (screenshot1.png, screenshot2.png, shortcut1_icon.png) to assets/images/.
Testing: Test across all platforms for consistent UI/UX and performance.
