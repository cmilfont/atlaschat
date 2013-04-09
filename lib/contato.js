var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;
var chat;

domready(function () {
	
	function conectar(contato, callback){
    var stream = shoe('/dnode');
    var d = dnode({});	
    d.on('remote', function (remote) {
      servidor = remote;
			servidor.entrarNaFila(contato, callback);
    });
    d.pipe(stream).pipe(d); 
		
	}
	
	$("#butao_login").on('click', function(){

		$("#entrada").hide();
		$("#atendimento").show();
		
		conectar({
        id: Math.floor(Math.random() * 1000 ) + 1,
        organizacao_id: $("#organizacao_id").val(),
        tramite: {
          contato: {
            nome: $("#nome").val()
          }
        },
        iniciarAtendimento: function(c) {
          console.log("Fui atendido no chat", c.id);
          chat = c;
          $("#entrada").hide();
          $("#chat_div").show();
        },
        receber: function(mensagem) {
          $("#chat_div").append("<br/>").append(mensagem);
        },
        created_at: new Date
      }, function(msg) {})
    });

    
    $("#butao").on('click', function(){
      servidor.conversar({
        tipo: "Contato",
        chat: chat,
        msg: $("#conversa").val()
      });
    });
    
});