.PHONY: build

install:
	@./node_modules/.bin/webdriver-manager update
	mv node_modules/react-medium-editor node_modules/react-medium-editor_es6
	mv node_modules/admin-config node_modules/admin-config_es6
	./node_modules/.bin/babel node_modules/react-medium-editor_es6 --out-dir node_modules/react-medium-editor --stage 1 --compact false > /dev/null
	./node_modules/.bin/babel node_modules/admin-config_es6 --out-dir node_modules/admin-config --stage 1 --compact false > /dev/null
	rm -rf node_modules/react-medium-editor_es6
	rm -rf node_modules/admin-config_es6

build:
	@NODE_ENV=production ./node_modules/.bin/webpack --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress --colors --devtool source-map
	@echo "Files build/react-admin.min.css and build/react-admin.min.js updated (with minification)"

install-blog:
	mkdir -p examples/blog/build/
	@cd ./examples/blog && npm install && cd ../..
	@cd ./examples/blog && ./node_modules/.bin/bower install && cd ../..
	@cp ./node_modules/babel-core/browser.min.js ./examples/blog/build/babel.min.js

build-blog:
	cp -Rf build/* examples/blog/build/

run-blog:
	@./node_modules/.bin/webpack-dev-server --progress --colors --devtool cheap-module-inline-source-map --hot --inline --content-base examples/blog

start-test-server: test-server.PID

test-server.PID:
	cd ./examples/blog && { ../../node_modules/.bin/http-server -p 8081 --silent & echo $$! > ../../$@; } && cd ../..

stop-test-server: test-server.PID
	@kill `cat $<` && rm $<

run-test-e2e: start-test-server test-e2e stop-test-server

test-unit-init:
	./node_modules/.bin/babel app --out-dir src --stage 1 --compact false > /dev/null

test-unit-clean:
	rm -rf ./src

test-unit-run:
	@./node_modules/.bin/jest src

test-unit: test-unit-init test-unit-run test-unit-clean

test-e2e:
	@./node_modules/.bin/protractor protractor.conf.js

test: test-unit build build-blog run-test-e2e
