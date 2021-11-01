#@name Project name
#@description Project description.

# Here we ensure that every command this Makefile run will run in a bash shell
# instead of the default sh
# See https://tech.davis-hansson.com/p/make
SHELL := /usr/bin/env bash

.PHONY: deps
deps: node_modules

node_modules: package.json package-lock.json
	@npm install
	@touch $@

CANVAS_SKETCH := $(PWD)/node_modules/.bin/canvas-sketch
LATEST := $(shell ls src | grep -v assets | tail -n 1)

.DEFAULT_GOAL := serve
## Serve latest src/*.js at http://localhost:3000 with hot reloading
.PHONY: serve
serve: deps
	@$(CANVAS_SKETCH) src/$(LATEST) --port 3000 --dir src

SRC_FILES := $(wildcard src/*.js)
OBJ_FILES := $(patsubst src/%,site/%,$(SRC_FILES))

site/%.js: src/%.js
	@$(CANVAS_SKETCH) $< --dir site --build

## Build site for production use
.PHONY: build
build: deps $(OBJ_FILES)

-include .env

## Deploy site to https://codevember.davidauthier.wearemd.com/2021/11/
.PHONY: deploy
deploy: build
	@rsync -avz ./site/ $(USER)@$(SERVER):$(SERVER_DEST)

bin/pretty-make:
	@curl -Ls https://raw.githubusercontent.com/awea/pretty-make/master/scripts/install.sh | bash -s

.PHONY: help
## List available commands
help: bin/pretty-make
	@bin/pretty-make pretty-help Makefile
