#!/usr/bin/env bash
set -euo pipefail

echo "=== TuneTrack Insights → GitHub ==="
echo ""

if ! command -v git &>/dev/null; then
  echo "ERROR: git is not installed."
  exit 1
fi
if ! command -v gh &>/dev/null; then
  echo "ERROR: GitHub CLI (gh) is not installed."
  echo "Run: brew install gh"
  exit 1
fi

if ! gh auth status &>/dev/null; then
  echo "Logging into GitHub..."
  gh auth login
fi

GITHUB_USER=$(gh api user --jq .login)
echo "Logged in as: $GITHUB_USER"
echo ""

read -p "Repository name [tunetrack-insights]: " REPO_NAME
REPO_NAME=${REPO_NAME:-tunetrack-insights}

read -p "Visibility (public/private) [public]: " VIS
VIS=${VIS:-public}

if [ ! -d .git ]; then
  git init
  git branch -M main
fi

echo -e "\n.env\n.env.local\n.env.*.local" >> .gitignore 2>/dev/null || true
rm -f .env .env.local 2>/dev/null || true

git add -A
git reset HEAD -- .env .env.local 2>/dev/null || true

if ! git diff --cached --quiet 2>/dev/null; then
  git commit -m "Initial commit: TuneTrack Insights (yourhot100)"
fi

FULL_REPO="$GITHUB_USER/$REPO_NAME"

if gh repo view "$FULL_REPO" &>/dev/null; then
  echo "Repo already exists. Pushing..."
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/$FULL_REPO.git"
  git push -u origin main
else
  echo "Creating new $VIS repository..."
  gh repo create "$REPO_NAME" --$VIS --source=. --remote=origin --push
fi

echo ""
echo "Done! Repo: https://github.com/$FULL_REPO"
