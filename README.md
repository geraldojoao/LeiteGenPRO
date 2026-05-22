<div align="center">

<img src="assets/icon.png" alt="LeiteGen Pro" width="96" />

# LeiteGen Pro

**A mobile-first platform for dairy cattle management and bull selection based on genetics.**

Helping rural producers make data-driven decisions to improve herd productivity and milk quality.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-2E7D32?style=for-the-badge&logo=vercel)](https://leitegen-pro.vercel.app/)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%2051-000020?style=flat-square&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.74-61DAFB?style=flat-square&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

## The Problem It Solves

Dairy farmers in Brazil manage hundreds of cows and make costly breeding decisions — often without access to organized genetic data or decision-support tools. A wrong bull selection can affect herd productivity for years. **LeiteGen Pro** centralizes bull genetics (DEPs), semen availability, herd matrix management, and ROI simulation in a single offline-capable app designed for real field conditions.

---

## Features

- **Dashboard** — daily summary, alerts, and operational shortcuts
- **Herd Management** — register and filter cows by status with attention indicators
- **Bull Catalog** — search and filter by breed, semen availability, biome, price, and genetic traits
- **Bull Detail** — DEPs, semen quality, climate adaptation, and ROI simulation
- **Favorites & Cart** — build and save a bull selection
- **Breeding Recommendations** — match bulls to individual cows based on matrix data
- **Visual Checkout** — simulated purchase flow for demo purposes
- **Offline-first** — full functionality without an internet connection

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Expo SDK 51](https://expo.dev) | Mobile/web app framework |
| [React Native 0.74](https://reactnative.dev) | Cross-platform UI |
| [TypeScript 5.3](https://www.typescriptlang.org) | Type safety |
| [Expo Router](https://expo.github.io/router) | File-based routing |
| [Zustand](https://zustand-demo.pmnd.rs) | Lightweight state management |
| [MMKV](https://github.com/mrousavy/react-native-mmkv) | Fast local persistence |
| [React Native SVG](https://github.com/software-mansion/react-native-svg) | Data visualization |
| [Expo Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/) | Visual polish |
| [Vercel](https://vercel.com) | Web deployment |

---

## Architecture

```
LeiteGenPRO/
├── app/                  # Expo Router routes & screens
│   ├── (tabs)/           # Main tab navigation
│   ├── touro/[id].tsx    # Bull detail screen
│   └── checkout.tsx      # Visual checkout flow
├── components/           # Reusable UI components (organized by domain)
│   ├── catalog/
│   ├── checkout/
│   ├── common/
│   └── plantel/
├── logic/                # Pure business rules (framework-agnostic)
├── store/                # Zustand stores
├── types/                # Centralized TypeScript types
├── hooks/                # Custom React hooks
├── utils/                # Formatters and utilities
├── constants/            # Theme and domain constants
└── data/                 # Local mock data (simulated)
```

The `logic/` layer contains pure business rules with no framework dependencies — making them easy to test and migrate to a future backend.

---

## Getting Started

### Prerequisites

- Node.js LTS
- npm
- Git

### Installation

```bash
git clone https://github.com/geraldojoao/LeiteGenPRO.git
cd LeiteGenPRO
npm install
```

### Running Locally

```bash
npm run start       # Start Expo (interactive menu)
npm run web         # Open in browser directly
npm run android     # Open on Android device/emulator
npm run ios         # Open on iOS simulator
```

### Available Scripts

```bash
npm run typecheck   # TypeScript validation
npm run lint        # ESLint check
npm run build:web   # Generate web build → dist/
```

---

## Web Deployment (Vercel)

The project includes `vercel.json` for Expo web export.

| Setting | Value |
|---|---|
| Install Command | `npm install` |
| Build Command | `npm run build:web` |
| Output Directory | `dist` |

**Live:** [https://leitegen-pro.vercel.app](https://leitegen-pro.vercel.app)

---

## Roadmap

- [x] MVP with offline-first architecture
- [x] Bull catalog with genetics and DEP data
- [x] Herd matrix management
- [x] ROI simulation and breeding recommendations
- [x] Web deployment via Vercel
- [ ] Real backend integration (Supabase)
- [ ] Producer authentication
- [ ] Herd sync across devices
- [ ] Push notifications for breeding alerts
- [ ] EAD/training module for producers
- [ ] Unit test coverage

---

## Contributing

This project is currently an MVP. To contribute:

1. Branch off `main`
2. Keep changes small and focused
3. Run `npm run typecheck && npm run lint` before committing
4. Open a pull request describing the goal, affected screens, and tests run

---

## License

This project is licensed under the [MIT License](LICENSE).
