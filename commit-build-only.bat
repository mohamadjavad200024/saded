@echo off
echo Removing cache from .next...
if exist .next\cache rmdir /s /q .next\cache
if exist .next\dev rmdir /s /q .next\dev
if exist .next\diagnostics rmdir /s /q .next\diagnostics
if exist .next\turbopack rmdir /s /q .next\turbopack

echo Adding only essential build files...
git add -f .next/server/
git add -f .next/static/
git add -f .next/BUILD_ID
git add -f .next/*.json
git add -f .next/*.js
git add package.json package-lock.json

echo Committing...
git commit -m "Build: Production build ready - essential files only (no cache)"

echo Pushing...
git push origin main

echo Done!

