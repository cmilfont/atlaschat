var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

domready(function () {
  
  function atender() {

    var fila_id = $(this).data("id");
    var organizacao_id = $(this).data("organizacao_id");
    servidor.atender(organizacao_id, fila_id, function(mensagem) {
      $("#fila").hide();
      $("#atendimento").show();
      console.log("Veio do server", mensagem);
    });
    
  };
  
  function addClienteNaFila(fila) {
    console.log("Fila", fila);
    var $link = $("<a>");
    $link.attr("href", "#");
    $link.attr("data-id", fila.id);
    $link.attr("data-organizacao_id", fila.organizacao_id);
    $link.html(fila.tramite.contato.nome);
    console.log($link);
    $("#fila").append( $link );
    $("#fila").append("<br/>");
    $link.on("click", atender);
  };
  
  function removerContatoNaFila(fila) {
    $("a[data-id='"+fila.id+"']").remove()
  };
  
  function conectar(atendente) {
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
    
    conectar({
      tipo: "Atendente",
      organizacao_id: $("#organizacao_id").val(),
      atendente_id: $("#atendente_id").val(),
      tramite_id: Math.floor(Math.random() * 10 ) + 1,
      receber: function(mensagem) {
        $("#chat").append("<br/>").append(mensagem);
      },
      atualizar: function(fila) {
        addClienteNaFila(fila);
      },
      removerContatoNaFila: removerContatoNaFila
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
  
 
});