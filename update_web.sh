git checkout web
git merge main -m "Merge main into web branch"
npm run build
sleep 1
npm add -A
sleep 1
npm commit -m "Update web build"
sleep 1
npm push
git checkout main
