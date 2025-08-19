ULIC Web App: Project Overview
Welcome to the ULIC Web App! This document outlines the modern and powerful technology stack we have chosen to build a fast, reliable, and scalable application.

Core Technology Stack
Our application is built on a foundation of industry-leading, production-ready technologies to ensure the best possible performance and developer experience.

Framework: Next.js (with App Router) 🚀
We are using Next.js, a comprehensive React framework for building full-stack web applications. It provides a robust structure for creating everything from simple static pages to complex, dynamic applications that fetch data from a server.

Why Next.js? It offers an incredible balance of power and simplicity, with features like server-side rendering (for fast initial page loads) and a file-based routing system that makes organizing the application intuitive.

App Router: We are using the latest App Router paradigm. This is the recommended approach for all new Next.js applications, enabling more advanced layouts, loading states, and a cleaner project structure.

Language: TypeScript
The entire project is written in TypeScript. TypeScript is a superset of JavaScript that adds static types, which helps us catch errors early in the development process before they ever reach the user.

Why TypeScript? It makes the code more readable, predictable, and easier to refactor as the application grows. It's the modern standard for professional web development.

Code Quality: ESLint
To maintain a clean and consistent codebase, we have integrated ESLint. This tool automatically analyzes the code to find problems, suggest improvements, and enforce a consistent coding style.

Why ESLint? It helps prevent common bugs and ensures that the project remains easy to read and maintain, which is crucial for long-term success.

Styling: Standard CSS
We have opted out of using a CSS framework like Tailwind. This gives us complete control over the application's visual style. All styling will be handled with standard CSS files, likely using a modular approach to keep styles organized and specific to the components they belong to.

Development Server: Turbopack
For the best possible development experience, we've enabled Turbopack. Developed by the creators of Vercel and Next.js, Turbopack is a new, high-speed development server written in Rust.

Why Turbopack? It is significantly faster than traditional JavaScript-based servers, meaning changes to the code will be reflected in the browser almost instantly. This creates a much smoother and more efficient development workflow, especially on hardware with limited resources.