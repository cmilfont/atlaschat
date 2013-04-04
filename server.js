var shoe = require('shoe');
var dnode = require('dnode');
var express = require('express');
var app = express();
var redis = require("redis").createClient();

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
var filaDeEspera = require(__dirname + '/lib/filaDeEspera')(redis);
var grupoDeAtendentes = require(__dirname + '/lib/grupoDeAtendentes')(redis);

var sock = shoe(function (stream) {
    
    var d = dnode( servidor(filaDeEspera, grupoDeAtendentes) );
    
    d.on('remote', function (remote) {
      grupoDeAtendentes.add(remote);
      //sala.push(remote);
      console.log("REmote", remote);
    });
    
    d.pipe(stream).pipe(d);
});
sock.install(app.listen(9999, function() {
  console.log("Server configured for: " + (global.process.env.NODE_ENV || 'development') + " environment.");
}), '/dnode');

/*
var redis = require("redis").createClient(); 
redis.set("00201300", "teste"); 
redis.set("00201301", "teste 2"); 
redis.set("00201351", "teste 3")
*/