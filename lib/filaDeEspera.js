//redis.keys("atlaschat:filaDeEspera:*", function(error, keys){ console.log(keys) })

module.exports = function(redis) {
  
  return {
    add: function(fila) {
      var key = 'atlaschat:filaDeEspera:' + fila.id;
      redis.set(key, fila);
    },
    list: function(callback) {
      redis.keys("atlaschat:filaDeEspera:*", function(error, keys){ 
        callback(keys);
      });
    }
  }
  
}