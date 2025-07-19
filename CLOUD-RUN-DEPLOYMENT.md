# 🚀 Google Cloud Run Deployment Guide

## ✅ **Prerequisites Completed**
- [x] Google Cloud CLI installed  
- [x] Authenticated with Google Cloud
- [x] Project: `store-thullah`
- [ ] **⚠️ BILLING ENABLED** (Required!)

## 💳 **Step 1: Enable Billing (REQUIRED)**

### **🌐 Quick Setup via Browser:**
1. Go to: [console.cloud.google.com/billing](https://console.cloud.google.com/billing)
2. Click: "Create billing account" or "Link billing account"  
3. Add: Credit card details
4. Link: To project `store-thullah`

**💰 Cost**: Free tier covers small apps (~$0-5/month)

---

## 🔧 **Step 2: Enable APIs (After Billing)**

```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
```

## 🚀 **Step 3: Deploy Your App**

### **Option A: Full Stack (Frontend + Backend)**
```bash
gcloud builds submit --config=cloudbuild-fullstack.yaml
```

### **Option B: Backend Only (API)**
```bash
gcloud builds submit --config=cloudbuild-backend.yaml
```

### **Option C: Frontend Only (React App)**
```bash
gcloud builds submit --config=cloudbuild.yaml
```

## ⏱️ **What Happens During Deployment**

1. **🔨 Build**: Docker images created
2. **📤 Push**: Images pushed to Container Registry  
3. **🚀 Deploy**: Services deployed to Cloud Run
4. **🌐 URLs**: Live URLs provided

**Estimated time**: 5-10 minutes

## 🌐 **Your App URLs (After Deployment)**

- **Frontend**: `https://bazzarly-frontend-xxx.a.run.app`
- **Backend API**: `https://bazzarly-backend-xxx.a.run.app`

## 🔗 **Step 4: Connect Frontend to Backend**

Update your frontend environment:

```bash
# Create production environment file
echo "REACT_APP_API_URL=https://bazzarly-backend-xxx.a.run.app" > frontend/.env.production
```

Replace `xxx` with your actual service URL from deployment output.

## 🧪 **Step 5: Test Deployment**

```bash
# Test frontend
curl https://bazzarly-frontend-xxx.a.run.app

# Test backend API  
curl https://bazzarly-backend-xxx.a.run.app/api/health
```

## 🛠️ **Useful Commands**

### **View deployed services:**
```bash
gcloud run services list
```

### **View logs:**
```bash
gcloud logs read --service=bazzarly-frontend
gcloud logs read --service=bazzarly-backend
```

### **Update deployment:**
```bash
gcloud builds submit --config=cloudbuild-fullstack.yaml
```

## 🚨 **Troubleshooting**

### **❌ "Billing account not found"**
- Enable billing in [Google Cloud Console](https://console.cloud.google.com/billing)

### **❌ "Service not found"**  
- Check service names: `gcloud run services list`
- Verify region: `gcloud config get-value run/region`

### **❌ "Build failed"**
- Check Docker files exist in `frontend/` and `backend/`
- View build logs: `gcloud builds log <BUILD_ID>`

## 🎯 **Quick Start Summary**

1. **💳 Enable billing** (required)
2. **🔧 Enable APIs**: `gcloud services enable ...`
3. **🚀 Deploy**: `gcloud builds submit --config=cloudbuild-fullstack.yaml`
4. **🌐 Get URLs** from deployment output
5. **🔗 Update frontend** environment with backend URL
6. **✅ Done!** Your app is live!

---

## 🎉 **Ready to Deploy?**

After enabling billing, run:
```bash
gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com
gcloud builds submit --config=cloudbuild-fullstack.yaml
```

Your Bazzarly e-commerce app will be live on Google Cloud Run! 🚀 