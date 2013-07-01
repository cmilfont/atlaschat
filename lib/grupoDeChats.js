module.exports = function() {
  
  var chats = [];
  
  return {
    getChats: function() {
      return chats;
    },
    adicionar: function(chat) {
      chats.push( chat );
    },
    remover: function(chat_id) {
      var chat;
      debugger;
      chats.forEach(function(f, index) {
        if(f.id == chat_id) {
          chat = f;
          chats.splice(index, 1);
        }
      });
      return chat;
    },
    buscar: function(chat_id) {
      return chats.filter(function(chat){ return chat.id == chat_id })[0];
    },
    buscarPorContato: function(contato_id) {
      return chats.filter(function(chat){ 
        return chat.fila && chat.fila.contato_id == contato_id;
      });
    }
  }
  
}