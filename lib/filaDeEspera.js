module.exports = function() {
  
  var organizacoes = {};
  
  return {
    adicionar: function(fila) {	
      if( organizacoes[ fila.organizacao_id ] ) {
        organizacoes[ fila.organizacao_id ].push(fila);
      } else {
        organizacoes[ fila.organizacao_id ] = [fila];
      }
    },
    remover: function(organizacao_id, fila_id) {
      var fila;
      if( organizacoes[ organizacao_id ] ) {
        organizacoes[ organizacao_id ].forEach(function(f, index) {
          if(f.id == fila_id) {
            organizacoes[ organizacao_id ].splice(index, 1);
            fila = f;
          }
        });
      }
      return fila;
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