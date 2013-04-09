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
    buscar: function(organizacao_id, atendente_id) {      
      var atendente;
      if(organizacoes[ organizacao_id ] && atendente_id ) {
        atendente = organizacoes[ organizacao_id ].filter(function(el) {
          return el.atendente_id == atendente_id;
        })[0];
      }
      return atendente;
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