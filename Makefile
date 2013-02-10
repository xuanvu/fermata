#all:	hint coverage test
all:	hint test

hint:
	node_modules/.bin/jshint src
test:
	node_modules/.bin/mocha --reporter spec tests --globals glyphTypeProperties
coverage:
	jscoverage --no-highlight src src-cov
	FERMATA_COV=1 node_modules/.bin/mocha --reporter html-cov tests > tests/mocha/coverage.html
	rm -rf src-cov