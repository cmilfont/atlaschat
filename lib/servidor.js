module.exports = function(filaDeEspera, grupoDeAtendentes) {
  
  return function(cliente, conn) {
      this.entrarNaFila = function (fila, callback) {
        filaDeEspera.add(fila);
        grupoDeAtendentes.adicionarContatoNaFila(fila);
        callback("Aguarde enquanto alguém te atende");
      },
      this.mostrarFila = function(organizacao_id, callback) {
        if(callback) filaDeEspera.list(organizacao_id, callback);
      },
      this.conversar = function (conversa, cb) {
        //cb(conversa);
        //redis.exists("00201351", function(err, bool){ console.log(bool) })
        
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