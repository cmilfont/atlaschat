var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

domready(function () {
    var tramite_id = 25;

    var stream = shoe('/dnode');
    var d = dnode({});
    d.on('remote', function (remote) {
      servidor = remote;
      
      servidor.entrarNaFila({
        id: Math.floor(Math.random() * 1000 ) + 1,
        tramite_id: tramite_id,
        organizacao_id: 1,
        tramite: {
          contato: {
            nome: "Zé com acento"
          }
        },
        iniciarAtendimento: function(chat_id) {
          console.log("Fui atendido no chat", chat_id);
        },
        receber: function(mensagem) {
          $("#chat").append("<br/>").append(mensagem);
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