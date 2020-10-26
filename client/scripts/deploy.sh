cd ../

#npm run build || exit 1

scp -r build/* root@167.172.51.172:/var/www/html/app || exit 1

