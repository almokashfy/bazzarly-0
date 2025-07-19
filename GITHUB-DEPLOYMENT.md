# 🚀 GitHub Actions Deployment to Google Cloud Run

## ✅ **What's Been Set Up**

- ✅ **Full Stack Workflow**: `.github/workflows/deploy-fullstack.yml`
- ✅ **Backend Only Workflow**: `.github/workflows/deploy-backend.yml`
- ✅ **Auto Deployment**: Triggers on push to `main` branch
- ✅ **Manual Trigger**: Can deploy manually from GitHub UI

## 🔧 **Setup Required (One-Time)**

### **Step 1: Create Google Cloud Service Account**

```bash
# 1. Create service account
gcloud iam service-accounts create github-actions \
  --display-name="GitHub Actions"

# 2. Add required permissions
gcloud projects add-iam-policy-binding store-thullah \
  --member="serviceAccount:github-actions@store-thullah.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding store-thullah \
  --member="serviceAccount:github-actions@store-thullah.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding store-thullah \
  --member="serviceAccount:github-actions@store-thullah.iam.gserviceaccount.com" \
  --role="roles/serviceusage.serviceUsageAdmin"

# 3. Create and download key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-actions@store-thullah.iam.gserviceaccount.com
```

### **Step 2: Add GitHub Secret**

1. **Open**: Your GitHub repository settings
2. **Go to**: Settings → Secrets and variables → Actions
3. **Click**: "New repository secret"
4. **Name**: `GCP_SA_KEY`
5. **Value**: Copy the entire contents of `key.json`
6. **Save**

### **Step 3: Enable Billing (Required)**

- Go to: [console.cloud.google.com/billing](https://console.cloud.google.com/billing)
- Link billing account to project `store-thullah`

## 🚀 **Deployment Options**

### **🎯 Full Stack Deployment (Recommended)**

**Triggers on**:
- Push to `main` or `develop` branch
- Pull requests to `main`
- Manual trigger

**Deploys**:
- ✅ Backend API
- ✅ Frontend React App
- ✅ Auto-connects frontend to backend
- ✅ Tests deployment

### **🔧 Backend Only Deployment**

**Triggers on**:
- Push to `main` with changes in `backend/` folder
- Manual trigger

**Deploys**:
- ✅ Node.js Express API only

## 📱 **How to Deploy**

### **Method 1: Automatic (Push to GitHub)**

```bash
# Make changes and push
git add .
git commit -m "feat: add new feature"
git push origin main

# ✅ Deployment starts automatically!
```

### **Method 2: Manual Trigger**

1. **Go to**: GitHub repository → Actions tab
2. **Select**: "🚀 Deploy Full Stack to Cloud Run"
3. **Click**: "Run workflow"
4. **Choose**: Branch (usually `main`)
5. **Click**: "Run workflow"

## 🌐 **Your Live URLs**

After successful deployment:

- **🎨 Frontend**: `https://bazzarly-frontend-xxx.a.run.app`
- **🔧 Backend API**: `https://bazzarly-backend-xxx.a.run.app`

## 📊 **Monitoring Deployment**

### **GitHub Actions UI:**
- **Go to**: Repository → Actions tab
- **View**: Real-time deployment progress
- **See**: Logs for each step

### **Google Cloud Console:**
- **Go to**: [console.cloud.google.com/run](https://console.cloud.google.com/run)
- **View**: Service status and logs

## 🧪 **Testing Deployment**

The workflow automatically tests:

```bash
# Backend health check
curl https://bazzarly-backend-xxx.a.run.app/api/health

# Frontend accessibility
curl https://bazzarly-frontend-xxx.a.run.app
```

## 🛠️ **Workflow Features**

### **🔨 Build Process:**
1. **Backend**: Docker image from Node.js
2. **Frontend**: Docker image with Nginx
3. **Environment**: Auto-configured for production

### **🚀 Deployment:**
- **Auto-scaling**: 0 to 10 instances
- **Memory**: 1GB per instance
- **CPU**: 1 vCPU per instance
- **Region**: us-central1
- **HTTPS**: Automatically enabled

### **🔗 Integration:**
- Frontend automatically connects to deployed backend
- Environment variables set correctly
- Health checks performed

## 🚨 **Troubleshooting**

### **❌ "Authentication failed"**
- Check `GCP_SA_KEY` secret is set correctly
- Verify service account has required permissions

### **❌ "Billing account not found"**
- Enable billing: [console.cloud.google.com/billing](https://console.cloud.google.com/billing)

### **❌ "Service not found"**
- Check service names in workflow file
- Verify region setting (`us-central1`)

### **❌ "Build failed"**
- Check Dockerfile syntax
- View detailed logs in GitHub Actions

## 🔄 **Updating Deployment**

### **For Code Changes:**
```bash
git add .
git commit -m "fix: update feature"
git push origin main
# ✅ Auto-deploys!
```

### **For Environment Variables:**
Edit `.github/workflows/deploy-fullstack.yml`:
```yaml
--set-env-vars NODE_ENV=production,NEW_VAR=value
```

## 📋 **Complete Setup Checklist**

- [ ] **Enable billing** on Google Cloud
- [ ] **Create service account** with permissions
- [ ] **Add `GCP_SA_KEY` secret** to GitHub
- [ ] **Push code** to `main` branch
- [ ] **Watch deployment** in Actions tab
- [ ] **Test live URLs** when complete

## 🎉 **After Setup**

Once configured, every push to `main` automatically:

1. **🔨 Builds** Docker images
2. **📤 Pushes** to Container Registry
3. **🚀 Deploys** to Cloud Run
4. **🔗 Connects** frontend to backend
5. **🧪 Tests** deployment
6. **📱 Provides** live URLs

**Your e-commerce app auto-deploys on every commit!** 🚀

---

## 🎯 **Quick Start Summary**

1. **💳 Enable billing**: [console.cloud.google.com/billing](https://console.cloud.google.com/billing)
2. **🔑 Create service account**: Run commands above
3. **🔐 Add GitHub secret**: `GCP_SA_KEY` 
4. **📤 Push to main**: `git push origin main`
5. **✅ Done**: Your app is live and auto-deploys!

**Need help?** Check the GitHub Actions logs for detailed error messages. 