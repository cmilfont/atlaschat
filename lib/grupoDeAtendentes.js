module.exports = function() {
  
  var organizacoes = {};
  
  var substituir = function(atendente) {
    var index = -1;
    organizacoes[ atendente.organizacao_id ].forEach(function(item, i){ if(item.id == atendente.id) { index = i; } })
    if(index > -1) {
      organizacoes[ atendente.organizacao_id ][ index ] = atendente;
    } else {
      organizacoes[ atendente.organizacao_id ].push( atendente );
    }
    
  };
  
  return {
    getAtendentes: function(organizacao_id) {
      return organizacoes[ organizacao_id ];
    },
    add: function(atendente) {
      if( atendente.tipo === "Atendente" ) {
        if( organizacoes[ atendente.organizacao_id ] ) {
         substituir(atendente);
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
    },
    buscarPorSistemaDisponivel: function(organizacao_id, sistema_id) {  
      var atendente;
      if(organizacoes[ organizacao_id ] && sistema_id ) {
        atendente = organizacoes[ organizacao_id ].filter(function(el) {
          return el.online == true && (el.atendente.sistema_ids.indexOf(sistema_id) > -1);
        })[0];
      }
      return atendente;
    },
    sistemasDisponiveis: function(organizacao_id) {
      var sistemas;
      if(organizacoes[ organizacao_id ]) {
        
        sistemas = organizacoes[ organizacao_id ].filter(function(el){
          return el.online == true;
        }).map(function(el){
          return el.atendente.sistema_ids;
        });
        
        if(sistemas.length > 0) {
          sistemas = sistemas.reduce(function(a, b) {
            return a.concat(b);
          });
        }
        
      }
      return sistemas;
    }
    
  }
  
}