.PHONY: build

install:
	@mkdir -p build
	@cp ../../build/* ./build
	npm install
	bower install

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js --progress
	@echo "File build/app.js updated"

run:
	./node_modules/webpack-dev-server/bin/webpack-dev-server.js \
		--progress --colors --hot \
		--content-base .
