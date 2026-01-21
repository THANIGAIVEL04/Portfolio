# 🚀 Quick Start - Deploy to GitHub Pages

## 📋 What You Need

1. ✅ GitHub account → https://github.com
2. ✅ Git installed → https://git-scm.com/download/win
3. ✅ Your portfolio files (already ready!)

## ⚡ 3-Minute Deployment

### Step 1: Create GitHub Repository (1 min)
1. Go to https://github.com/new
2. Name: `portfolio`
3. Public ✅
4. **Don't** initialize with README
5. Click "Create repository"

### Step 2: Deploy (2 min)

**Option A: Automated (Recommended)**
```
Right-click: deploy-to-github.ps1
Select: "Run with PowerShell"
Follow prompts
```

**Option B: Manual**
```powershell
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages (30 sec)
1. Repository → Settings → Pages
2. Source: `main` branch
3. Save
4. Wait 1-2 minutes

## 🌐 Your Live URL
```
https://YOUR-USERNAME.github.io/portfolio/
```

## 📚 Full Documentation

- **Detailed Guide**: `DEPLOYMENT_GUIDE.md`
- **Structure Info**: `GITHUB_STRUCTURE.md`
- **Project Info**: `README.md`

## ✅ What's Included

✅ Modern portfolio with hover skills dropdown
✅ 3D animated background
✅ Custom cursor effects
✅ Fully responsive design
✅ Project showcase pages
✅ Downloadable resume
✅ Social media links

## 🎯 Files That Will Be Uploaded

```
✅ index.html
✅ style.css
✅ script.js
✅ project-*.html (3 files)
✅ assets/ (photo + resume)
✅ README.md
✅ .gitignore
```

## 🚫 Files That Won't Be Uploaded

```
❌ .snapshots/
❌ background-remover.html
❌ change_background.py
❌ BACKGROUND_CHANGE_INSTRUCTIONS.md
❌ style-THANiX-sASUS.css
```

## 🆘 Common Issues

**"git: command not found"**
→ Install Git from https://git-scm.com

**"Authentication failed"**
→ Use Personal Access Token (not password)
→ GitHub Settings → Developer settings → Tokens

**"Site not loading"**
→ Wait 2-3 minutes after enabling Pages
→ Check repository is Public
→ Clear browser cache

## 📞 Support

- Deployment Guide: `DEPLOYMENT_GUIDE.md`
- GitHub Docs: https://docs.github.com/pages
- Git Basics: https://git-scm.com/doc

---

**Ready? Let's deploy! 🚀**

Run: `deploy-to-github.ps1`
