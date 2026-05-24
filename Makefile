.PHONY: install dev build preview lint test-contracts verify status clean

install:
	npm install

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

lint:
	npm run lint

test-contracts:
	npm run test:contracts

verify:
	npm run build
	npm run test:contracts

status:
	git status

clean:
	rm -rf dist node_modules