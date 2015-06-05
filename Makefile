.PHONY: build

install:
	@npm install
	@./node_modules/protractor/bin/webdriver-manager update
	mkdir -p examples/blog/build/

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js -p --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@cp -Rf build/* examples/blog/build/
	@echo "Files build/react-admin.min.css and build/react-admin.min.js updated (with minification)"

install-blog:
	cd ./examples/blog && bower install && cd ../..

run-blog:
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --hot --content-base examples/blog

start-test-server: test-server.PID

test-server.PID:
	cd ./examples/blog && { python -m SimpleHTTPServer 8080 & echo $$! > ../../$@; } && cd ../..

stop-test-server: test-server.PID
	@kill `cat $<` && rm $<

run-test-e2e: start-test-server test-e2e stop-test-server

test-unit:
	@./node_modules/jest-cli/bin/jest.js

test-e2e:
	@./node_modules/protractor/bin/protractor protractor.conf.js

test: run-test-e2e
