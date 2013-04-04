all:
	browserify lib/contato.js -o public/contato.js
	browserify lib/atendente.js -o public/atendente.js