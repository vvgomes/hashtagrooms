.PHONY: install spec spec.models

all: spec

install:
	@npm install

spec: spec.models

spec.models:
	@NODE_ENV=spec \
	./node_modules/.bin/mocha ./spec/models/*.spec.js \
	--reporter spec

