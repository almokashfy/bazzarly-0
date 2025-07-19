# 🚀 Bazzarly Deployment Guide

## ❓ **"Missing script: build" - Why This Happens**

You see `npm error Missing script: "build"` in the backend because:

- **Frontend (React)**: Needs `npm run build` to compile JSX → static files
- **Backend (Node.js)**: Runs directly with `npm start` - no build needed!

**This is completely normal for Node.js servers.** ✅

## 📋 **Project Structure**

```
bazzarly/
├── frontend/          # React app (needs building)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json   # Has "build" script
├── backend/           # Node.js API (no build needed)
│   ├── Dockerfile
│   ├── server.js
│   └── package.json   # Only has "start" script
└── cloudbuild*.yaml   # Deployment configurations
```

## 🔧 **Deployment Options**

### **Option 1: Frontend Only (Static React App)**
```bash
gcloud builds submit --config=cloudbuild.yaml
```
- Deploys React app to Google Cloud Run
- Perfect for frontend-only deployment
- Use with external API or Firebase

### **Option 2: Backend Only (Node.js API)**
```bash
gcloud builds submit --config=cloudbuild-backend.yaml
```
- Deploys Express server to Google Cloud Run
- Provides REST API endpoints
- Use with external frontend hosting

### **Option 3: Full Stack (Complete App)**
```bash
gcloud builds submit --config=cloudbuild-fullstack.yaml
```
- Deploys both frontend and backend
- Two separate Cloud Run services
- Complete e-commerce platform

## 🛠️ **Local Testing**

### **Frontend:**
```bash
cd frontend
npm install
npm run build    # ✅ This works - creates build/
npm start        # Development server
```

### **Backend:**
```bash
cd backend
npm install
npm start        # ✅ This works - runs server.js
# No build needed! ❌ npm run build (doesn't exist)
```

## 🌐 **After Deployment**

### **Frontend URL:**
`https://bazzarly-frontend-xxx.a.run.app`

### **Backend URL:**
`https://bazzarly-backend-xxx.a.run.app`

### **Connect Frontend to Backend:**
Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://bazzarly-backend-xxx.a.run.app
```

## 🚨 **Common Issues**

### **1. "Missing script: build" in backend**
- ✅ **Normal!** Node.js doesn't need building
- ❌ **Don't add** a build script to backend
- ✅ **Use** `npm start` for backend

### **2. Frontend build fails**
- Check `frontend/package.json` has build script
- Run `npm install` in frontend directory
- Fix any ESLint warnings

### **3. Docker build fails**
- Check Dockerfile paths in cloudbuild.yaml
- Ensure `dir:` is set correctly

## 🎯 **Quick Start**

1. **Choose your deployment:**
   - Frontend only: `cloudbuild.yaml`
   - Backend only: `cloudbuild-backend.yaml`  
   - Full stack: `cloudbuild-fullstack.yaml`

2. **Deploy:**
   ```bash
   gcloud builds submit --config=cloudbuild-fullstack.yaml
   ```

3. **Done!** Your Bazzarly e-commerce app is live! 🎉

## 📱 **Test Deployment**

```bash
# Test frontend
curl https://bazzarly-frontend-xxx.a.run.app

# Test backend API
curl https://bazzarly-backend-xxx.a.run.app/api/health
```

Your app is now ready for production! 🚀 