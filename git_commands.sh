#!/bin/bash

echo "Adding all changes to git..."
git add -A

echo "Committing changes..."
git commit -m "fix: Docker build errors - no-frozen-lockfile + escape quotes"

echo "Pushing to origin main..."
git push origin main

echo "Done! Check the CI/CD build now." 