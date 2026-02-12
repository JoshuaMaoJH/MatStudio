# Mat Studio

A visual CSS styling tool that lets you create reusable style **mats** and apply them to HTML elements through drag-and-drop. Build interfaces faster with an intuitive, code-free approach to styling.

---

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [How to Use Mat Studio](#how-to-use-mat-studio)
- [Available Scripts](#available-scripts)
- [Tech Stack](#tech-stack)

---

## Features

- **Style Cards (Mats)** — Create named style collections with multiple CSS properties (e.g. "Card", "Hero Text", "Accent").
- **Smart Property Picker** — Browse 90+ CSS properties by category (Typography, Color, Layout, Flexbox, Grid, Spacing, Size, Border, Effects, List/Table).
- **Value Suggestions** — Get suggested values for each property; search and pick from the list.
- **Live Preview** — See changes instantly in an iframe; hover and drop targets are highlighted.
- **Drag & Drop** — Drag a mat card from the left panel onto any element in the preview to apply its styles.
- **Element Inspector** — Click an element to see which mats are applied; remove individual mats from the inspect panel.
- **HTML Editor** — Edit your HTML in the "CODE" tab with real-time preview updates.
- **Export** — Download a single HTML file with all applied styles and classes embedded.

---

## Prerequisites

Before you run Mat Studio, ensure you have:

- **Node.js** — Version **18.x** or **20.x** (LTS recommended). Check with:
  ```bash
  node -v
  ```
- **npm** — Usually comes with Node.js. Check with:
  ```bash
  npm -v
  ```

If Node.js is not installed, download it from [nodejs.org](https://nodejs.org/).

---

## Installation

Follow these steps exactly to get the project on your machine and install dependencies.

### Step 1: Get the project code

If you have the project as a folder on your computer (e.g. `mat-studio`):

1. Open a terminal (Command Prompt, PowerShell, or your IDE’s integrated terminal).
2. Go to the project folder. For example, if the project is at `G:\WebProjects\Mat Studio\mat-studio`:
   ```bash
   cd "G:\WebProjects\Mat Studio\mat-studio"
   ```
   On macOS/Linux:
   ```bash
   cd /path/to/mat-studio
   ```

If you clone from a Git repository instead:

```bash
git clone <repository-url>
cd mat-studio
```

### Step 2: Install dependencies

From inside the project root (`mat-studio`), run:

```bash
npm install
```

- This reads `package.json` and installs all dependencies into `node_modules`.
- Wait until it finishes without errors. You should see something like `added XXX packages`.

### Step 3: Verify setup

Optional check that the project is ready:

```bash
npm run dev
```

If the dev server starts and you see a local URL (e.g. `http://localhost:5173`), installation was successful. Press `Ctrl+C` to stop the server, then continue to the next section to run it properly.

---

## Running the Project

### Development server (recommended for daily use)

1. Open a terminal in the project root.
2. Run:
   ```bash
   npm run dev
   ```
3. In the terminal you will see output similar to:
   ```
   VITE v7.x.x  ready in xxx ms
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```
4. Open your browser and go to **http://localhost:5173** (or the port shown).
5. You should see the Mat Studio interface: left panel (Mats / Code), center preview, top bar with "MAT STUDIO" and "EXPORT".
6. To stop the server: press **Ctrl+C** in the terminal.

### Production build

To build the app for production (static files in `dist/`):

1. In the project root, run:
   ```bash
   npm run build
   ```
2. Wait for the build to complete. You should see something like:
   ```
   ✓ built in xxx ms
   ```
3. Output will be in the **`dist`** folder. You can deploy this folder to any static host (e.g. Netlify, Vercel, or a simple web server).

### Preview the production build locally

To test the production build on your machine:

1. Build first (if you haven’t already):
   ```bash
   npm run build
   ```
2. Run the preview server:
   ```bash
   npm run preview
   ```
3. Open the URL shown (e.g. **http://localhost:4173**) in your browser.
4. Stop with **Ctrl+C**.

### Lint the code

To run ESLint on the project:

```bash
npm run lint
```

Fix any reported errors or warnings as needed.

---

## Project Structure

```
mat-studio/
├── public/
│   └── favicon.png          # App favicon
├── src/
│   ├── App.jsx              # Main app: mats, preview, HTML editor, bridge script
│   ├── index.css            # Global styles and resets
│   └── main.jsx             # React entry: mounts App into #root
├── index.html               # Single HTML entry; loads /src/main.jsx
├── package.json             # Dependencies and npm scripts
├── vite.config.js           # Vite config (React plugin)
├── eslint.config.js         # ESLint configuration
└── README.md                # This file
```

- **Entry:** `index.html` loads `src/main.jsx`, which renders `App.jsx`.
- **Logic and UI:** Almost everything lives in `src/App.jsx` (state, CSS DB, picker, mat cards, iframe bridge).
- **Preview:** The app injects a small script into the iframe’s HTML so the preview can handle drag/drop, hover, click-to-inspect, and mat application.

---

## How to Use Mat Studio

### 1. Start the app

Run `npm run dev` and open http://localhost:5173 in your browser.

### 2. Left panel — MATS tab

- **Create a mat:** Click **"+ new mat"**. A new card appears (e.g. "New Mat").
- **Edit a mat:** Click **"edit"** on a card. You can:
  - Change the mat name (top input).
  - Add a property: click **"+ add property"**, then fill **property** and **value**.
  - Use **⌕** next to property or value to open the **picker** (browse CSS properties or suggested values). Choose a category for properties, type to search, press Enter to select.
  - Remove a property with the **×** next to that row.
- **Finish editing:** Click **"done"**.

### 3. Apply a mat to the preview

- In the **MATS** tab, **drag** a mat card (do not expand "edit" while dragging).
- **Drop** it onto any element in the center preview. The element will get the mat’s styles; you’ll see a short green flash and the status text "✓ mat applied".

### 4. Inspect and remove mats

- **Click** an element in the preview that has mats applied.
- An **inspect panel** appears (e.g. bottom-right) showing the tag and list of applied mats.
- Click **"remove"** next to a mat name to remove that mat from the element only.

### 5. Edit HTML

- In the left panel, switch to the **"{ } CODE"** tab.
- Edit the HTML in the textarea. The preview updates as you type (after the iframe reloads with the new HTML).

### 6. Export

- Click **"⬇ EXPORT"** in the top bar.
- A file **beautified.html** is downloaded, containing the full page HTML with all applied mat classes and the generated `<style>` block.

---

## Available Scripts

| Command           | Description |
|------------------|-------------|
| `npm run dev`    | Start Vite dev server (HMR). Use this while developing. |
| `npm run build`  | Build for production; output in `dist/`. |
| `npm run preview`| Serve the `dist/` build locally (e.g. to test before deploy). |
| `npm run lint`   | Run ESLint on the project. |

---

## Tech Stack

- **React** 19.2
- **Vite** 7.3 — dev server, build, and preview
- **ESLint** — linting (no TypeScript; the app is JSX-only)

No UI library or extra runtime dependencies; the UI is built with React components and inline styles for a self-contained, dark-theme interface.

---

## Quick Reference: Run from zero

```bash
# 1. Go to project folder
cd path/to/mat-studio

# 2. Install dependencies (once)
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

For production: `npm run build` then deploy the `dist/` folder, or run `npm run preview` to test it locally.
