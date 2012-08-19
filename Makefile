.PHONY: install spec spec.models spec.controllers

all: spec

install:
	@npm install

spec: spec.models spec.controllers

spec.models:
	@NODE_ENV=spec \
	./node_modules/.bin/mocha ./spec/models/*.spec.js \
	--reporter spec

spec.controllers:
	@NODE_ENV=spec \
	./node_modules/.bin/mocha ./spec/controller.spec.js \
	--reporter spec
