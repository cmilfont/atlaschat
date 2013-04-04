var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

domready(function () {
    var tramite_id = 25;
    var result = document.getElementById('chat');
    var stream = shoe('/dnode');
    var d = dnode({
      tipo: "Contato",
      tramite_id: tramite_id + 1,
      receber: function(mensagem) {
        $("#chat").append("<br/>").append(mensagem);
      }
    });
    d.on('remote', function (remote) {
      servidor = remote;
      
      servidor.entrarNaFila({
        id: Math.floor(Math.random() * 10 ),
        tramite_id: tramite_id,
        tramite: {
          contato: {
            nome: "Zé com acento"
          }
        },
        created_at: new Date
      }, function(msg) {
        $("#chat").prepend( $("div").html(msg) )
      })
      
    });
    
    $("#butao").on('click', function(){
      servidor.conversar({
        tipo: "Contato",
        tramite_id: 100,
        user_id: 156,
        msg: $("#conversa").val()
      })
      
    });
    
    d.pipe(stream).pipe(d);
});