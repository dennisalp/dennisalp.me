#!/bin/bash

git status
git add .
git commit -m "${1}"
git push
git status

rm -rf dist/
npm run build
cp assets/* dist/assets/
cd dist
rsync -avz -e "ssh -p 21098" . dennpaew@162.0.217.213:/home/dennpaew/public_html/
cd ../
