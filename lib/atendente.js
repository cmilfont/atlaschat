var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function () {
  
  var servidor;
  var chat;
  var atendente;

  function atender() {
    
    var fila_id = $(this).data("id");
    var organizacao_id = $(this).data("organizacao_id");
    servidor.atender(organizacao_id, fila_id, atendente.atendente_id, function(c, mensagem) {
      chat = c;
      $("#fila").hide();
      $("#atendimento").show();
    });

  };

  function addClienteNaFila(fila) {

    var $link = $("<a>");
    $link.attr("href", "#");
    $link.attr("data-id", fila.id);
    $link.attr("data-organizacao_id", fila.organizacao_id);
    $link.html(fila.tramite.contato.nome);
    $("#fila").append( $link );
    $("#fila").append("<br/>");
    $link.on("click", atender);
  };

  function conectar() {
    
    atendente = {
      tipo: "Atendente",
      organizacao_id: $("#organizacao_id").val(),
      atendente_id: $("#atendente_id").val(),
      tramite_id: Math.floor(Math.random() * 10 ) + 1,
      receber: function(mensagem) {
        $("#chat_div").append("<br/>").append(mensagem);
      },
      atualizar: function(fila) {
        addClienteNaFila(fila);
      },
      removerContatoNaFila: function(fila) {
        $("a[data-id='"+fila.id+"']").remove()
      }
    };
    
     var stream = shoe('/dnode');
     var d = dnode({});
     d.on('remote', function (remote) {
       servidor = remote;
       servidor.entrarEmAtendimento(atendente, function() {
         servidor.mostrarFila(atendente.organizacao_id, function(lista){
           lista.forEach(function(fila){
             addClienteNaFila(fila);
           });
         });
       });
     });
     d.pipe(stream).pipe(d); 
  }
  
  
  $("#butao_login").on('click', function(){
    $("#login").hide();
    conectar();
  });
  
  $("#butao").on('click', function(){
    servidor.conversar({
      tipo: "Atendente",
      chat: chat,
      msg: $("#conversa").val()
    })
  });
  
 
});