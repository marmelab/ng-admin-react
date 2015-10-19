.PHONY: build

install:
	npm install
	bower install

build:
	@NODE_ENV=production ./node_modules/.bin/webpack --progress --colors --devtool source-map
	@echo "File build/app.js updated"

run:
	./node_modules/webpack-dev-server/bin/webpack-dev-server.js --port 8088 --progress --colors --devtool cheap-module-inline-source-map --hot --inline
