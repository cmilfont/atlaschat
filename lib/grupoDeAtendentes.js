//redis.keys("atlaschat:filaDeEspera:*", function(error, keys){ console.log(keys) })

module.exports = function(redis) {
  
  return {
    add: function(atendente) {
      if(atendente.atendente_id) {
        var key = 'atlaschat:grupoDeAtendentes:' + atendente.atendente_id;
        console.log("Atendente", atendente);
        redis.set(key, atendente );
      }
    },
    adicionarContatoNaFila: function(fila) {
      redis.keys("atlaschat:grupoDeAtendentes:*", function(error, keys){ 
        redis.mget(keys, function(error, lista) {
          lista.forEach(function(atendente){
            console.log("Atendente", atendente);
            //atendente.atualizar(fila);
          })
        })
      });
    }
  }
  
}