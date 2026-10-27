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
