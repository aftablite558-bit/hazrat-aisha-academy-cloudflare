# Hazrat Aisha Academy ERP

A premium, professionally designed Islamic school platform designed for Chak Rajopatti, Sitamarhi, Bihar.

## Project Overview
Hazrat Aisha Academy ERP is a comprehensive digital platform that blends CBSE-aligned modern academic excellence with authentic Islamic values.

## Key Features
- **Academic Management**: Attendance, Homework, Results, Timetable, Report Cards.
- **Enterprise Modules**: Admissions, Fee Management, Audit Logs, Settings.
- **Content Management**: Academic Calendar, Notices, Gallery, Documents.
- **User Management**: Secure authentication for Principal, Teachers, Staff, and Students.
- **Data Integrity**: Centralized Academic Session management, Backup & Restore functionality.

## Architecture
- **Frontend**: React 19, Tailwind CSS, Vite.
- **Backend**: Cloudflare Workers (Hono).
- **Database**: Cloudflare D1 (SQLite).
- **Authentication**: Firebase Authentication.

## Setup Instructions
1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure environment variables in `.env` (refer to `.env.example`).
4. Run development server: `npm run dev`

## Deployment Steps
1. Push code to the GitHub repository.
2. Configure Cloudflare Pages for automatic deployment.
3. Apply D1 migrations: `wrangler d1 migrations apply <database-name>`
4. Set required secrets in Cloudflare dashboard.
