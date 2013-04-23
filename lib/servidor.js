module.exports = function(filaDeEspera, grupoDeAtendentes, grupoDeChats, resque) {
  
  return function(cliente, conn) {
      this.entrarNaFila = function (fila, callback) {
        filaDeEspera.adicionar(fila);
        grupoDeAtendentes.adicionarContatoNaFila(fila);
        callback("Aguarde enquanto alguém te atende");
      },

      this.mostrarFila = function(organizacao_id, callback) {
        if(callback) filaDeEspera.list(organizacao_id, callback);
      },

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
      },

      this.conversar = function (conversa, callback) {
        
        var chat = grupoDeChats.buscar(conversa.chat_id);
				conversa.data_envio = new Date();
        // resque.enqueue('atlas:conversas', "gravar", [ conversa ]);
        chat.atendentes.forEach(function(atendente){
          grupoDeAtendentes.buscar(atendente.organizacao_id, atendente.atendente_id)
                           .receber(conversa);
        });
        chat.fila.receber(conversa);
        if(callback) { callback(conversa); }
      },

      this.entrarNoChat = function(atendente, callback) {
        grupoDeAtendentes.add(atendente);
        callback(atendente);
      }
  }
  
}