module.exports = function(filaDeEspera, grupoDeAtendentes, grupoDeChats, resque) {
  
  var ConversaModel = function(conversa) {
    return {
      data_envio: conversa.data_envio, 
      mensagem: conversa.mensagem, 
      nome: (conversa.origem === 'atendente')? conversa.chat.fila.tramite.responsavel.nome: conversa.chat.fila.nome_contato, 
      chat_id: conversa.chat_id, 
      user_id: conversa.user_id,
			origem: conversa.origem
    }
  };
  
  var dateEnvioComTimezoneCorrigido = function() {
    var data = new Date();
    data.setHours(data.getHours() - data.getTimezoneOffset() / 60);
    return JSON.stringify( data );
  };
  
  return function(cliente, conn) {

      var that = this;

      conn.on('end', function(){
        if(this.proto.remote.atendente) {
          that.mudarStatus(this.proto.remote.atendente, false, function(){});
        } else {
        	that.removerDaFila(this.proto.remote.contato, function(){});
        }
        
      });
    
      this.entrarNaFila = function (fila, callback) {
        filaDeEspera.adicionar(fila);
        grupoDeAtendentes.adicionarContatoNaFila(fila);
				
				var posicao = filaDeEspera.getOrganizacoes()[fila.organizacao_id].length;
        callback("Você está na posição " + posicao + " da fila de espera. Por favor aguarde.");
      };

      this.mostrarFila = function(organizacao_id, callback) {
        if(callback) filaDeEspera.list(organizacao_id, callback);
      };

      this.atender = function(chatModel, atendente_id, callback) {
        var organizacao_id = chatModel.organizacao_id;
        var fila_id = chatModel.fila_id;
        var fila = filaDeEspera.remover(organizacao_id, fila_id);
        if( fila ) {
          var atendente = grupoDeAtendentes.buscar(organizacao_id, atendente_id);          
          var chat = {
            id: chatModel.id,
            atendentes: [atendente],
            fila: fila,
            model: chatModel,
            conversas: []
          }
          grupoDeChats.adicionar(chat);
          fila.iniciarAtendimento(chat);
          callback(chat, "Olá senhor, a sua dúvida é?");
        }

        grupoDeAtendentes.removerContatoNaFila(fila);
      };
      
      this.recolocarChat = function(chatModel, atendente_id, callback) {
        
        var chat = grupoDeChats.buscar(chatModel.id);
        if(!chat) {
          var organizacao_id = chatModel.organizacao_id;
          var atendente = grupoDeAtendentes.buscar(organizacao_id, atendente_id);
          var chat = {
            id: chatModel.id,
            atendentes: [atendente],
            //fila: fila,
            model: chatModel,
            conversas: []
          }
          grupoDeChats.adicionar(chat);          
        }
        callback(chat, "recolocado");
      };
      
      this.buscarConversas = function(contato_id, fila, callback) {
        if(callback) { 
          var chats = grupoDeChats.buscarPorContato(contato_id);
          chats.forEach(function(chat){
            chat.fila = fila;
          });
          callback( chats );
        }
      };

      this.conversar = function (conversa, callback) {
        var chat = grupoDeChats.buscar(conversa.chat_id);
				conversa.data_envio = dateEnvioComTimezoneCorrigido();

        if(chat.fila) {
          //grava conversa no chat
          chat.conversas.push(conversa);
          //Enfileira
          resque.enqueue('atlas:conversas', "Conversa", [ ConversaModel(conversa) ]);
          //Manda para o contato          
          chat.fila.receber(conversa);
          //Manda para os atendentes
          chat.atendentes.forEach(function(atendente){
            grupoDeAtendentes.buscar(atendente.organizacao_id, atendente.atendente_id)
                             .receber(conversa);
          });
          
        } else {
          conversa = conversa + " - cliente indisponível";
        }
        if(callback) { callback(conversa); }
      };

      this.entrarNoChat = function(atendente, callback) {
        grupoDeAtendentes.add(atendente);
        callback(atendente);
      };
      
      this.mudarStatus = function(atendenteNaFila, status, callback) {
        var atendente = grupoDeAtendentes.buscar(atendenteNaFila.organizacao_id, atendenteNaFila.atendente_id);
        atendente.online = status;
        callback(status);
      };

      this.removerDaFila = function(contato, callback) {
				if(contato){
					var fila = filaDeEspera.buscar(contato.organizacao_id, contato.id);
					if(fila){
						filaDeEspera.remover(contato.organizacao_id, fila.id);
						grupoDeAtendentes.removerContatoNaFila(fila);
					}
				}
        callback();
      };
      
      /* Método para pegarmos o atendente no console do navegador, nunca remova ou será amaldiçoado. */
      this.pegarAtendente = function(atendente, callback) {
        callback( grupoDeAtendentes.buscar(atendente.organizacao_id, atendente.atendente_id) );
      };
      
      this.sistemaDisponivel = function(organizacao_id, sistema_id, callback) {
        callback( grupoDeAtendentes.buscarPorSistemaDisponivel(organizacao_id, sistema_id) );
      };
      
      this.sistemasDisponiveis = function(organizacao_id, callback) {
        callback( grupoDeAtendentes.sistemasDisponiveis(organizacao_id) );
      }
      
  }
  
}