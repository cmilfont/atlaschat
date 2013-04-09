var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

domready(function () {
    var tramite_id = Math.floor(Math.random() * 10 );
    var result = document.getElementById('chat');
    var stream = shoe('/dnode');
    
    var atendente = {
      tipo: "Atendente",
      organizacao_id: 1,
      atendente_id: 20,
      tramite_id: tramite_id + 1,
      receber: function(mensagem) {
        $("#chat").append("<br/>").append(mensagem);
      },
      atualizar: function(fila) {
        $("#chat").append(  fila.tramite.contato.nome  );
      }
    }
    
    var d = dnode({});
    
    
    d.on('remote', function (remote) {
      servidor = remote;
      
      servidor.entrarEmAtendimento(atendente, function() {
        
        servidor.mostrarFila(atendente.organizacao_id, function(lista){
          lista.forEach(function(fila){
            $("#chat").append(  fila.tramite.contato.nome  );
          });
        });
        
      });
      
      
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