module.exports = function(filaDeEspera, grupoDeAtendentes, grupoDeChats) {
  
  return function(cliente, conn) {
      this.entrarNaFila = function (fila, callback) {
        filaDeEspera.adicionar(fila);
        grupoDeAtendentes.adicionarContatoNaFila(fila);
        callback("Aguarde enquanto alguém te atende");
      },
      this.mostrarFila = function(organizacao_id, callback) {
        if(callback) filaDeEspera.list(organizacao_id, callback);
      },
      this.atender = function(organizacao_id, fila_id, atendente_id, callback) {
        var fila = filaDeEspera.remover(organizacao_id, fila_id);
        if( fila ) {
          var atendente = grupoDeAtendentes.buscar(organizacao_id, atendente_id);          
          var chat = {
            id: Math.floor(Math.random() * 1000 ) + 1,
            atendentes: [atendente],
            fila: fila,
            conversas: []
          }
          grupoDeChats.adicionar(chat);
          fila.iniciarAtendimento(chat);
          callback(chat, "Olá senhor, a sua dúvida é?");
        }

        grupoDeAtendentes.removerContatoNaFila(fila);
      },
      this.conversar = function (conversa, cb) {
        var chat = grupoDeChats.buscar(conversa.chat.id);
        var mensagem = conversa.msg;
        chat.atendentes.forEach(function(atendente){
          atendente.receber(conversa.tipo + ": " + mensagem);
        });
        chat.fila.receber(conversa.tipo + ": " + mensagem);
      },
      this.entrarEmAtendimento = function(atendente, callback) {
        grupoDeAtendentes.add(atendente);
        callback(atendente);
      }
  }
  
}