git checkout web
git merge main -m "Merge main into web branch"
npm run build
npm add -A
npm commit -m "Update web build"
npm push
git checkout main
