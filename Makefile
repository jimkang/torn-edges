HOMEDIR = $(shell pwd)

prettier:
	prettier --single-quote --write "**/*.js"

pushall:
	git push origin master && npm publish
