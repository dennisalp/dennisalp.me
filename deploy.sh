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
scp -P 21098 -r . dennpaew@dennisalp.me:/home/dennpaew/public_html/
