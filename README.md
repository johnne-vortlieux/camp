# CampusCart (barebones)

Needs Node.js LTS and a MongoDB database (local or Atlas).

## Server
    cd server
    cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
    # edit .env: set MONGODB_URI and a JWT_SECRET of 32+ characters
    npm install
    npm run dev

## Client (second terminal)
    cd client
    cp .env.example .env
    npm install
    npm run dev

Open the URL Vite prints (http://localhost:5173).

## Deploy on Vercel (one project)
1. Push this folder to GitHub (node_modules and .env are git-ignored).
2. Vercel: Add New > Project > import the repo. Framework Preset: Other. Leave build settings (vercel.json sets them).
3. Environment variables: MONGODB_URI, JWT_SECRET, CLIENT_URL (your Vercel URL). Do not set NODE_ENV (Vercel sets it).
4. Atlas > Network Access: allow 0.0.0.0/0.
5. Deploy. After the first deploy, set CLIENT_URL to the real URL and redeploy.
