var shoe = require('shoe');
var dnode = require('dnode');
var express = require('express');
var app = express();

var resque = require('coffee-resque').connect({
  host: '127.0.0.1',
  port: 6379
});

app.configure(function() {
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.methodOverride());

  app.engine('.html', require('ejs').__express);
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));

  app.use(express.errorHandler({
    dumpExceptions: true
  , showStack: true 
  }))
});

app.get('/contato', function(req, res){
  res.render('contato.html', {
    title: "Chat Fortes"
  });
});

app.get('/atendente', function(req, res){
  res.render('atendente.html', {
    title: "Chat Fortes"
  });
});

var servidor = require(__dirname + '/lib/servidor');
var filaDeEspera = require(__dirname + '/lib/filaDeEspera')();
var grupoDeAtendentes = require(__dirname + '/lib/grupoDeAtendentes')();
var grupoDeChats = require(__dirname + '/lib/grupoDeChats')();

var sock = shoe(function (stream) {
    var d = dnode( servidor(filaDeEspera, grupoDeAtendentes, grupoDeChats, resque) );    
    d.on('remote', function (remote, conn) {
      console.log("Atendente entrou", remote);
    });
    
    d.pipe(stream).pipe(d);
});
sock.install(app.listen(9999, function() {
  console.log("Server configured for: " + (global.process.env.NODE_ENV || 'development') + " environment.");
  console.log(new Date)
}), '/dnode');