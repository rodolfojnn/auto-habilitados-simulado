# source-map-explorer vendor.bundle.js
# git remote add origin https://github.com/user/repo.git
# git remote -v (Verify new remote)
# rm -rf dist
# git checkout -- dist/*

# sh version-update.sh

git add --all;

if git commit -a -m "$1"
then
	echo ''
else
	echo 'EXIT'
	exit
fi

if git push origin main
then
	echo ''
else
	echo 'EXIT'
fi