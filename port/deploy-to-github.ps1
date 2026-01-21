# Portfolio GitHub Deployment Script
# This script helps you deploy your portfolio to GitHub Pages

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Portfolio GitHub Deployment Helper" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 1: Git Configuration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is already configured
$gitUserName = git config --global user.name
$gitUserEmail = git config --global user.email

if ([string]::IsNullOrEmpty($gitUserName)) {
    Write-Host "Git user name is not configured." -ForegroundColor Yellow
    $userName = Read-Host "Enter your name (e.g., Thanigaivel M L)"
    git config --global user.name "$userName"
    Write-Host "✓ Git user name set to: $userName" -ForegroundColor Green
} else {
    Write-Host "✓ Git user name already set to: $gitUserName" -ForegroundColor Green
}

if ([string]::IsNullOrEmpty($gitUserEmail)) {
    Write-Host "Git user email is not configured." -ForegroundColor Yellow
    $userEmail = Read-Host "Enter your email (e.g., thanix0610@gmail.com)"
    git config --global user.email "$userEmail"
    Write-Host "✓ Git user email set to: $userEmail" -ForegroundColor Green
} else {
    Write-Host "✓ Git user email already set to: $gitUserEmail" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 2: GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Before continuing, make sure you have:" -ForegroundColor Yellow
Write-Host "  1. Created a GitHub account at https://github.com" -ForegroundColor White
Write-Host "  2. Created a new repository (e.g., 'portfolio')" -ForegroundColor White
Write-Host "  3. Set the repository to PUBLIC" -ForegroundColor White
Write-Host ""

$continue = Read-Host "Have you created a GitHub repository? (y/n)"
if ($continue -ne 'y') {
    Write-Host ""
    Write-Host "Please create a GitHub repository first:" -ForegroundColor Yellow
    Write-Host "  1. Go to https://github.com/new" -ForegroundColor White
    Write-Host "  2. Repository name: portfolio" -ForegroundColor White
    Write-Host "  3. Make it PUBLIC" -ForegroundColor White
    Write-Host "  4. DO NOT initialize with README" -ForegroundColor White
    Write-Host "  5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
$githubUsername = Read-Host "Enter your GitHub username (e.g., THANIGAIVEL04)"
$repoName = Read-Host "Enter your repository name (e.g., portfolio)"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 3: Initialize Git Repository" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "⚠ Git repository already exists" -ForegroundColor Yellow
    $reinit = Read-Host "Do you want to reinitialize? This will remove existing Git history (y/n)"
    if ($reinit -eq 'y') {
        Remove-Item -Recurse -Force ".git"
        Write-Host "✓ Removed existing Git repository" -ForegroundColor Green
    }
}

if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 4: Add Files and Commit" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Portfolio website with hover skills dropdown"
Write-Host "✓ Commit created" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 5: Connect to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$remoteUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "Remote URL: $remoteUrl" -ForegroundColor White

# Remove existing remote if it exists
git remote remove origin 2>$null

Write-Host "Adding remote repository..." -ForegroundColor Yellow
git remote add origin $remoteUrl
Write-Host "✓ Remote repository added" -ForegroundColor Green

Write-Host ""
Write-Host "Renaming branch to main..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch renamed to main" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Step 6: Push to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠ You may be prompted to sign in to GitHub" -ForegroundColor Yellow
Write-Host ""

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✓ SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your portfolio has been pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Go to: https://github.com/$githubUsername/$repoName" -ForegroundColor White
    Write-Host "  2. Click 'Settings' → 'Pages'" -ForegroundColor White
    Write-Host "  3. Under 'Source', select 'main' branch" -ForegroundColor White
    Write-Host "  4. Click 'Save'" -ForegroundColor White
    Write-Host "  5. Wait 1-2 minutes" -ForegroundColor White
    Write-Host ""
    Write-Host "Your portfolio will be live at:" -ForegroundColor Cyan
    Write-Host "  https://$githubUsername.github.io/$repoName/" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "  ✗ PUSH FAILED" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Authentication failed - Use Personal Access Token" -ForegroundColor White
    Write-Host "  2. Repository doesn't exist - Create it on GitHub first" -ForegroundColor White
    Write-Host "  3. Wrong username/repo name - Check your GitHub URL" -ForegroundColor White
    Write-Host ""
    Write-Host "See DEPLOYMENT_GUIDE.md for detailed troubleshooting" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
