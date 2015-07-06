.PHONY: build

install:
	@npm install
	@./node_modules/protractor/bin/webdriver-manager update
	mkdir -p examples/blog/build/
	mv node_modules/react-medium-editor node_modules/react-medium-editor_es6
	./node_modules/babel/bin/babel/index.js node_modules/react-medium-editor_es6 --out-dir node_modules/react-medium-editor --stage 1 --compact false > /dev/null
	mv node_modules/admin-config node_modules/admin-config_es6
	./node_modules/babel/bin/babel/index.js node_modules/admin-config_es6 --out-dir node_modules/admin-config --stage 1 --compact false > /dev/null
	rm -rf node_modules/react-medium-editor_es6
	rm -rf node_modules/admin-config_es6

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@cp -Rf build/* examples/blog/build/
	@echo "Files build/react-admin.min.css and build/react-admin.min.js updated (with minification)"

install-blog:
	cd ./examples/blog && bower install && cd ../..
	cp ./node_modules/babel-core/browser.min.js ./examples/blog/build/babel.min.js

run-blog:
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --hot --content-base examples/blog

start-test-server: test-server.PID

test-server.PID:
	cd ./examples/blog && { python -m SimpleHTTPServer 8081 & echo $$! > ../../$@; } && cd ../..

stop-test-server: test-server.PID
	@kill `cat $<` && rm $<

run-test-e2e: start-test-server test-e2e stop-test-server

test-unit-init:
	./node_modules/babel/bin/babel/index.js app --out-dir src --stage 1 --compact false > /dev/null

test-unit-clean:
	rm -rf ./src

test-unit-run:
	@./node_modules/jest-cli/bin/jest.js src

test-unit: test-unit-init test-unit-run test-unit-clean

test-e2e:
	@./node_modules/protractor/bin/protractor protractor.conf.js

test: test-unit build run-test-e2e
