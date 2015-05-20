install:
	@npm install

install-blog:
	cd ./examples/blog && bower install && cd ../..

run-blog:
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --hot --content-base examples/blog

test:
	@./node_modules/jest-cli/bin/jest.js
