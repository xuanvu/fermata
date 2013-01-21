all:	hint coverage test

hint:
	node_modules/.bin/jshint src
test:
	node_modules/.bin/mocha --reporter spec tests
coverage:
	jscoverage --no-highlight src src-cov
	FERMATA_COV=1 node_modules/.bin/mocha --reporter html-cov tests > tests/mocha/coverage.html
	rm -rf src-cov