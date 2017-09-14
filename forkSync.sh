#!/bin/bash
git fetch upstream
git checkout master
git merge upstream/master
git checkout develop
git merge upstream/develop
git push
read -n 1 -s -r -p "Fine, premere un tasto qualsiasi..."
echo Bye