module.exports = function() {
  
  var organizacoes = {};
  
  return {
    add: function(fila) {
      
      if( organizacoes[ fila.organizacao_id ] ) {
        organizacoes[ fila.organizacao_id ].push(fila);
      } else {
        organizacoes[ fila.organizacao_id ] = [fila];
      }
      
    },
    list: function(organizacao_id, callback) {
      
      if( organizacoes[ organizacao_id ] ) {
        callback( organizacoes[ organizacao_id ] );
      } else {
        callback( [] );
      }

    }
  }
  
}