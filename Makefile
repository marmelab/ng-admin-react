install:
	@npm install
	@./node_modules/protractor/bin/webdriver-manager update

install-blog:
	cd ./examples/blog && bower install && cd ../..

run-blog:
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --hot --content-base examples/blog

test-unit:
	@./node_modules/jest-cli/bin/jest.js

test-e2e:
	@./node_modules/protractor/bin/protractor protractor.conf.js

test:
	test-unit
	test-e2e
