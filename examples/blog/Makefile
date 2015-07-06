.PHONY: build

install:
	npm install
	bower install

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js --progress
	@echo "File build/app.js updated"

run:
	./node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 8088 --progress --colors --hot --content-base .
