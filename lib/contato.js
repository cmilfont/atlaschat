var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');
var servidor;

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
        iniciarAtendimento: function(chat_id) {
          console.log("Fui atendido no chat", chat_id);
					$("#chat").hide();
					$("#irc").show();
        },
        // receber: function(mensagem) {
          // $("#chat").append("<br/>").append(mensagem);
//         },
        created_at: new Date
      }, function(msg) {
				$("#chat").prepend(msg);
      })
    });

      // 
    // $("#butao").on('click', function(){
    //   servidor.conversar({
    //     tipo: "Contato",
    //     tramite_id: 100,
    //     user_id: 156,
    //     msg: $("#conversa").val()
    //   })
    //   
    // });
});