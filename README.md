# 🚀 TALENT FLOW: A Mini Hiring Platform

**TALENT FLOW** is a sophisticated front-end React application that simulates the core functionalities of a modern **HR and candidate management system**.  
It’s designed to run entirely in the browser while providing a full-stack–like experience, complete with **data persistence**, **API mocking**, and **advanced interactive features**.

---

## 🌟 Features Implemented

The platform provides complete management of **Jobs**, **Candidates**, and **Assessments**.

### 🧩 1. Jobs Board Management

- **CRUD & Status Management:**  
  Create, edit, and manage job postings with Active/Archived status toggles.  

- **Search & Filtering:**  
- **Search & Filtering:**  
  Supports filtering by job title, status, and tags, with simulated server-side pagination and **debounced search input** for optimized performance.

- **Advanced Reordering (Drag & Drop):**  
  - Jobs can be reordered with drag-and-drop.  
  - Includes **Optimistic Updates** and **automatic rollback** on simulated API failure (mock 500 error).  

- **Performance Optimization:**  
  - Search input uses **debouncing** to prevent excessive re-renders and mock API calls.

---

### 👥 2. Candidate Pipeline Management

- **Kanban Board:**  
  Visualizes candidates across all hiring stages — `Applied → Screen → Tech → Offer → Hired → Rejected`.  
  Supports drag-and-drop to move candidates between stages.

- **List View (Virtualized):**  
  - Displays 1,000+ candidates efficiently using **react-window** virtualization.  
  - Includes client-side search by **Job Role** or **Job Id**.  

- **Candidate Profile Deep Link:**  
  - Dedicated route: `/candidates/:id`.  
  - Displays detailed candidate info with a **dynamic status timeline**.

---

### 🧠 3. Assessment Builder

- **Dynamic Builder:**  
  Add sections and multiple question types:
  - Single Choice
  - Multi Choice
  - Short / Long Text
  - Numeric (with range)

- **Live Preview:**  
  See assessment structure rendered in real-time as a fillable form.


---

## ⚙️ Technical Architecture & Key Decisions

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Persistence (DB)** | IndexedDB via **Dexie** | Stores all application data locally, ensuring data restoration on browser refresh. |
| **Network Mocking** | **MSW (Mock Service Worker)** | Intercepts `fetch` calls and routes them to local handlers, simulating REST API endpoints. |
| **Simulations** | Custom API Handlers | Adds **artificial latency** (200–1200 ms) and **5–10% error rate** on write operations (`POST`, `PATCH`) to test robustness. |
| **List Optimization** | **react-window** | Enables smooth rendering for large candidate lists (1,000+ entries). |
| **Environment-Aware Hooks** | Custom Hooks (`useJobData`, `useCandidateData`) | Automatically switch between MSW and IndexedDB modes based on `process.env.NODE_ENV`. |

---

## 🧩 Key Implementation Highlights

- **Data Context:**  
  Candidate board performs a **pseudo-join** (lookup) to display related Job Title and Job ID for each candidate card.

- **Resilient Architecture:**  
  The app can fully function offline (after initial load), leveraging IndexedDB persistence.

---

## 🧰 Tech Stack

- **React 18**
- **React Router DOM**
- **Dexie (IndexedDB wrapper)**
- **Mock Service Worker (MSW)**
- **react-window**
- **Lucide React Icons**
- **Tailwind CSS**

---

## 🧪 Development Notes

- **Run Mode:**  
  - `Development:` Uses MSW to simulate REST API calls.  
  - `Production:` Directly interacts with IndexedDB for persistence.

- **Error Simulation:**  
  - Randomized 5–10% write failures simulate network instability.  
  - Rollback ensures data consistency and UX stability.

---

## 🧑‍💻 Author

**Shivam Kumar**    
🔗 [GitHub Repository](https://github.com/Shivamkumar9823/TalentFLow.git)  
🌐 [Live Demo](https://talent-f-low.vercel.app)

---

> *TALENT FLOW demonstrates a complete, resilient front-end simulation of a hiring platform — blending architectural precision with real-world interaction design.*

