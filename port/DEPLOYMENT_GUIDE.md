# 🚀 GitHub Deployment Guide

This guide will walk you through deploying your portfolio to GitHub Pages step by step.

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account (create one at https://github.com if you don't have one)
- ✅ Git installed on your computer
- ✅ Your portfolio files ready in the `port` folder

## 🔧 Step 1: Install Git (if not already installed)

### Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer with default settings
3. Verify installation by opening PowerShell and typing:
   ```bash
   git --version
   ```

## 📁 Step 2: Prepare Your Repository

Your current folder structure is perfect for GitHub Pages! Here's what you have:

```
port/
├── index.html                 ✅ Main page (required)
├── style.css                  ✅ Styles
├── script.js                  ✅ JavaScript
├── project-attendance.html    ✅ Project page
├── project-ctrp.html          ✅ Project page
├── project-demo.html          ✅ Project page
├── assets/
│   ├── my-photo.png          ✅ Profile photo
│   └── Thanigaivel_New_Resume.pdf  ✅ Resume
├── .gitignore                 ✅ Git ignore file
└── README.md                  ✅ Repository documentation
```

**Files that will NOT be uploaded** (excluded by .gitignore):
- `.snapshots/` - Development snapshots
- `background-remover.html` - Development tool
- `change_background.py` - Development script
- `BACKGROUND_CHANGE_INSTRUCTIONS.md` - Development notes
- `style-THANiX-sASUS.css` - Old CSS file

## 🌐 Step 3: Create GitHub Repository

1. **Go to GitHub**: https://github.com
2. **Sign in** to your account
3. **Click** the "+" icon in the top right corner
4. **Select** "New repository"
5. **Fill in the details**:
   - Repository name: `portfolio` (or any name you prefer)
   - Description: "My personal portfolio website showcasing cybersecurity projects and skills"
   - Visibility: **Public** (required for free GitHub Pages)
   - ❌ **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. **Click** "Create repository"

## 💻 Step 4: Initialize Git and Push to GitHub

Open PowerShell in your portfolio folder (`C:\Users\THANIGAIVEL\OneDrive\Desktop\port`) and run these commands:

### 4.1 Configure Git (First time only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4.2 Initialize Repository
```bash
# Initialize Git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Portfolio website with hover skills dropdown"
```

### 4.3 Connect to GitHub
Replace `THANIGAIVEL04` with your GitHub username:

```bash
# Add remote repository
git remote add origin https://github.com/THANIGAIVEL04/portfolio.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Note**: You may be prompted to sign in to GitHub. Use your GitHub credentials.

## 🌟 Step 5: Enable GitHub Pages

1. **Go to your repository** on GitHub: `https://github.com/THANIGAIVEL04/portfolio`
2. **Click** on "Settings" tab (top right)
3. **Scroll down** to "Pages" in the left sidebar (under "Code and automation")
4. **Under "Source"**:
   - Select branch: `main`
   - Select folder: `/ (root)`
5. **Click** "Save"
6. **Wait** 1-2 minutes for deployment

## 🎉 Step 6: Access Your Live Website

Your portfolio will be live at:
```
https://THANIGAIVEL04.github.io/portfolio/
```

Replace `THANIGAIVEL04` with your GitHub username and `portfolio` with your repository name.

## 🔄 Step 7: Making Updates

Whenever you make changes to your portfolio:

```bash
# Add changed files
git add .

# Commit changes
git commit -m "Description of changes"

# Push to GitHub
git push
```

GitHub Pages will automatically update your live site within 1-2 minutes!

## 🐛 Troubleshooting

### Issue: "git: command not found"
**Solution**: Install Git from https://git-scm.com/download/win

### Issue: Authentication failed
**Solution**: 
1. Use Personal Access Token instead of password
2. Go to GitHub Settings → Developer settings → Personal access tokens
3. Generate new token with `repo` scope
4. Use token as password when prompted

### Issue: Site not loading
**Solution**:
1. Wait 2-3 minutes after enabling GitHub Pages
2. Check that repository is Public
3. Verify GitHub Pages is enabled in Settings
4. Clear browser cache and try again

### Issue: Images/CSS not loading
**Solution**:
1. Check file paths are relative (not absolute)
2. Ensure file names match exactly (case-sensitive)
3. Verify all files are committed and pushed

## 📱 Testing Your Site

After deployment, test these features:
- ✅ Homepage loads correctly
- ✅ Skills dropdown works on hover
- ✅ All project pages are accessible
- ✅ Resume downloads correctly
- ✅ Social media links work
- ✅ Responsive design on mobile
- ✅ 3D background animates
- ✅ Custom cursor appears (desktop only)

## 🎨 Custom Domain (Optional)

If you want to use a custom domain (e.g., `www.yourname.com`):

1. **Buy a domain** from providers like:
   - Namecheap
   - GoDaddy
   - Google Domains

2. **Add CNAME file** to your repository:
   ```bash
   echo "www.yourname.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

3. **Configure DNS** with your domain provider:
   - Add CNAME record pointing to: `THANIGAIVEL04.github.io`

4. **Update GitHub Pages settings**:
   - Go to Settings → Pages
   - Enter your custom domain
   - Enable "Enforce HTTPS"

## 📊 Repository Structure for GitHub

Your final GitHub repository will look like this:

```
portfolio/
├── 📄 index.html
├── 🎨 style.css
├── ⚙️ script.js
├── 📄 project-attendance.html
├── 📄 project-ctrp.html
├── 📄 project-demo.html
├── 📁 assets/
│   ├── 🖼️ my-photo.png
│   └── 📑 Thanigaivel_New_Resume.pdf
├── 📝 README.md
└── 🚫 .gitignore
```

## ✅ Checklist

Before deploying, make sure:
- [ ] All personal information is updated in `index.html`
- [ ] Profile photo is in `assets/my-photo.png`
- [ ] Resume PDF is in `assets/Thanigaivel_New_Resume.pdf`
- [ ] All social media links are correct
- [ ] Project pages are complete
- [ ] All files are saved
- [ ] Git is installed
- [ ] GitHub account is created

## 🎯 Quick Commands Reference

```bash
# Check Git status
git status

# View commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# View remote URL
git remote -v

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name
```

## 📞 Need Help?

If you encounter any issues:
1. Check the Troubleshooting section above
2. Search GitHub Docs: https://docs.github.com/pages
3. Ask on GitHub Community: https://github.community

---

**Good luck with your deployment! 🚀**

Your portfolio will be live and accessible to the world in just a few minutes!
