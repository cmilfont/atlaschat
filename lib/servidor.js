module.exports = function(filaDeEspera, grupoDeAtendentes) {
  
  return function(cliente, conn) {
      this.entrarNaFila = function (fila, callback) {
        filaDeEspera.adicionar(fila);
        grupoDeAtendentes.adicionarContatoNaFila(fila);
        callback("Aguarde enquanto alguém te atende");
      },
      this.mostrarFila = function(organizacao_id, callback) {
        if(callback) filaDeEspera.list(organizacao_id, callback);
      },
      this.atender = function(organizacao_id, fila_id, callback) {
        
        var chat_id = Math.floor(Math.random() * 1000 ) + 1;
        
        var fila = filaDeEspera.remover(organizacao_id, fila_id);
        if( fila ) { 
          fila.iniciarAtendimento(chat_id);
          callback("Olá senhor, a sua dúvida é?");
        }

        grupoDeAtendentes.removerContatoNaFila(fila);
      },
      this.conversar = function (conversa, cb) {
        
        sala.forEach(function(cli){
          cli.receber(conversa.tipo + ": " + conversa.msg);
        })
      },
      this.entrarEmAtendimento = function(atendente, callback) {
        grupoDeAtendentes.add(atendente);
        callback(atendente);
      }
  }
  
}