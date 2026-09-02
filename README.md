# 🦠 Swine Flu (H1N1) Surveillance & Analytics Dashboard

A modern, responsive, high-performance web dashboard built with **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, and **Recharts**.

The application dynamically ingests and analyzes live patient line-list data published directly from Google Sheets for Swine Flu case reporting across **2025** and **2026**.

![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?logo=tailwindcss)
![Live Data Feed](https://img.shields.io/badge/Google%20Sheets-Live%20CSV-22c55e?logo=googlesheets)

---

## 📌 Features

- **Live Google Sheets Synchronization**: Dynamically fetches and parses the published Google Sheets CSV tabs (`Line list 2025` and `Line List 2026`).
- **Epidemiological Metrics (KPIs)**: Total case counts, recovery rates, fatalities, senior vulnerability (>60 yrs), pediatric cases (<18 yrs), and urban vs rural ratios.
- **Interactive Visual Analytics**:
  - *Seasonality Trends*: Monthly case comparison for 2025 vs 2026.
  - *Zone & Region Density*: Case density across NMC Nagpur municipal zones, Nagpur Rural, Other MH Districts, and Out of State (MP/CG).
  - *Demographic Profile*: Age group distribution & clinical outcome donut chart.
  - *Hospital Load Intelligence*: Admissions breakdown across key healthcare facilities (Meditrina, Criti Care, KIMS Kingsway, Viveka, Aureus, Max, New Era Child Care, GMC/IGGMC, etc.).
- **Multi-Attribute Search & Filter**: Filter by search terms, region, municipal zone, age category, gender, outcome status, and hospital.
- **Patient Line List Registry**: Interactive data grid with sorting, pagination, colored outcome badges, and detail modal.
- **Exporting Capabilities**: Export current filtered registry to CSV.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4) with Glassmorphism Dark UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **CSV Parser**: PapaParse

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/saurabhnakhale/swine-flu-dashboard.git
cd swine-flu-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the live dashboard.

---

## 🌐 Deploy to Vercel

1. Push your changes to GitHub:
   ```bash
   git remote add origin https://github.com/saurabhnakhale/swine-flu-dashboard.git
   git branch -M main
   git push -u origin main
   ```
2. Import the repository on [Vercel](https://vercel.com/new).
3. Click **Deploy** for instant deployment.

---

## 📄 Data Source & Disclaimer

Data is dynamically fetched from the published Google Sheets surveillance line-list:
- **Sheet 1**: `Line list 2025` (`gid=1138403852`)
- **Sheet 2**: `Line List 2026` (`gid=477036082`)
