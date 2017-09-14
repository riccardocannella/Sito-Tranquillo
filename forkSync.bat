@echo off
git fetch upstream
git checkout master
git merge upstream/master
git checkout develop
git merge upstream/develop
git push
pause