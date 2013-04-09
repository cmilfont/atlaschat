module.exports = function() {
  
  var organizacoes = {};
  
  return {
    add: function(atendente) {
      
      if( atendente.tipo === "Atendente" ) {
        if( organizacoes[ atendente.organizacao_id ] ) {
          organizacoes[ atendente.organizacao_id ].push( atendente );        
        } else {
          organizacoes[ atendente.organizacao_id ] = [ atendente ];
        }        
      }
      
    },
    adicionarContatoNaFila: function(fila) {
      
      if( organizacoes[ fila.organizacao_id ] ) {
        organizacoes[ fila.organizacao_id ].forEach( function(atendente) {
          atendente.atualizar(fila);
        }); 
      }

    },
    
    removerContatoNaFila: function(fila) {
      if(fila && organizacoes[ fila.organizacao_id ] ) {
        organizacoes[ fila.organizacao_id ].forEach( function(atendente) {
          atendente.removerContatoNaFila(fila);
        }); 
      }
    }
    
  }
  
}