module.exports = function(clientes) {
  
  return function(cliente, conn) {
      this.entrarNaFila = function (message, cb) {
        var res = message.toUpperCase();
        cb(res);
      },
      this.conversar = function (conversa, cb) {
        cb(conversa);
        
        //redis.exists("00201351", function(err, bool){ console.log(bool) })
        
        
        clientes.forEach(function(cli){
          cli.receber(conversa.msg);
        })
      }
  }
  
}