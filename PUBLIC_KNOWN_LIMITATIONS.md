# PUBLIC KNOWN LIMITATIONS — v1.0.0
**Hazrat Aisha Academy Platform**

## ℹ️ Overview
This document outlines minor expected operational behaviors and client limitations for the Public Website v1.0.0.

---

## 📋 Operational Considerations

1. **Student Search Exact Match**:
   - The Public Attendance, Homework, Exam Schedule, and Results search engines require an exact match for **Student Name**, **Class**, and **Roll Number** to preserve student privacy and prevent unauthorized data harvesting.

2. **File Downloads & Browser Restrictions**:
   - Downloads for PDF reports and attachments open in a new tab if cross-origin headers restrict direct inline downloading by the browser vendor.

3. **Map Embed**:
   - The Google Map on the Contact page utilizes standard embedded location coordinates for Dilawarbagh, Sharif Colony, Chak Rajopatti, Sitamarhi. An API key can optionally be linked in `.env` for custom map themes.

4. **Offline Persistence**:
   - Master data is dynamically loaded from the local IndexedDB / Firestore state engine. Initial cold load on slow connections displays smooth skeleton loading indicators while sync completes.
