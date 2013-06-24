module.exports = function() {
  
  var organizacoes = {};
  
  return {
    getOrganizacoes: function() {
      return organizacoes;
    },
    adicionar: function(fila) {	
      if( organizacoes[ fila.organizacao_id ] ) {
        organizacoes[ fila.organizacao_id ].push(fila);
      } else {
        organizacoes[ fila.organizacao_id ] = [fila];
      }
    },
    
		buscar: function(organizacao_id, contato_id) {
      var fila;
      if(organizacoes[ organizacao_id ] && contato_id ) {
        fila = organizacoes[ organizacao_id ].filter(function(el) {
          return el.contato_id == contato_id;
        })[0];
      }
      return fila;
    },
		
    remover: function(organizacao_id, fila_id) {
      var fila;
      if( organizacoes[ organizacao_id ] ) {
        organizacoes[ organizacao_id ].forEach(function(f, index) {
          if(f.id == fila_id) {
            fila = f;
            organizacoes[ organizacao_id ].splice(index, 1);
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