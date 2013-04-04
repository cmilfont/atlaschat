var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

domready(function () {
    var tramite_id = Math.floor(Math.random() * 10 );
    var result = document.getElementById('chat');
    var stream = shoe('/dnode');
    
    var d = dnode({
      tipo: "Atendente",
      atendente_id: 20,
      tramite_id: tramite_id + 1,
      receber: function(mensagem) {
        $("#chat").append("<br/>").append(mensagem);
      },
      atualizar: function(fila) {
        console.log("atualizar", fila);
      }
    });
    
    
    d.on('remote', function (remote) {
      servidor = remote;
      
      servidor.mostrarFila(function(lista){
        lista.forEach(function(fila){
          $("#chat").append(  fila  )
        });
      }) 
      
    });
    
    
    $("#butao").on('click', function(){
      servidor.conversar({
        tipo: "Atendente",
        tramite_id: 100,
        user_id: 156,
        msg: $("#conversa").val()
      })
      
    });
    
    d.pipe(stream).pipe(d);
});