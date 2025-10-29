# Frontend (Next + Tailwind) — Hotel UI

This folder contains a simple Next.js + Tailwind frontend used to demo the hotel booking UI (landing, login, register).

How to run (PowerShell):

```powershell
cd "c:\Users\ADMIN\Downloads\hotel-manager-master (2)\hotel-manager-master\frontend"
npm install
npm run dev
```

Open the URL printed by the dev server (e.g. http://localhost:3000 or http://localhost:3001) to view.

Notes:
- Auth is a demo only (stored in localStorage). Integrate a backend API for production.
- Styles use Tailwind; modify `tailwind.config.cjs` and `src/styles/globals.css` to adjust theme.

Using Figma assets (recommended):
- To match your Figma design exactly, place exported images (PNG/JPG/SVG) into `public/images/`.
	For example: `frontend/public/images/hero.jpg`, `frontend/public/images/hotel-1.jpg`, `frontend/public/images/room-r1.jpg`.
- The code will prefer local images if present. If you add files, restart the dev server.

How to add assets and preview:
```powershell
# from workspace root
cd "c:\Users\ADMIN\Downloads\hotel-manager-master (2)\hotel-manager-master\frontend"
# create folder if not exists
mkdir .\public\images
# copy your exported files into public\images using Explorer or copy commands
npm run dev
```

Theme adjustments:
- I updated `tailwind.config.cjs` to include a `brand` color and Playfair/Inter fonts. To fully match Figma, send me the exact color hex codes and font names and I will plug them in.

