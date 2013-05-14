module.exports = function(filaDeEspera, grupoDeAtendentes, grupoDeChats, resque) {
  
  var ConversaModel = function(conversa) {
    return {
      data_envio: conversa.data_envio, 
      mensagem: conversa.mensagem, 
      nome: (conversa.origem === 'atendente')? conversa.chat.fila.tramite.responsavel.nome: conversa.chat.fila.nome_contato, 
      chat_id: conversa.chat_id, 
      user_id: conversa.user_id
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

      this.conversar = function (conversa, callback) {
        var chat = grupoDeChats.buscar(conversa.chat_id);
				conversa.data_envio = dateEnvioComTimezoneCorrigido();
        resque.enqueue('atlas:conversas', "Conversa", [ ConversaModel(conversa) ]);
        chat.atendentes.forEach(function(atendente){
          grupoDeAtendentes.buscar(atendente.organizacao_id, atendente.atendente_id)
                           .receber(conversa);
        });
        chat.fila.receber(conversa);
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