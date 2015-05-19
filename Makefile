install:
	@npm install

run:
	@./node_modules/json-server/bin/index.js ./examples/blog/stub-server.json &
	@./node_modules/webpack-dev-server/bin/webpack-dev-server.js --progress --colors --hot

test:
	@./node_modules/jest-cli/bin/jest.js
