module.exports = function() {
  
  var chats = [];
  
  return {
    adicionar: function(chat) {
      chats.push( chat );
    },
    buscar: function(chat_id) {
      return chats.filter(function(chat){ return chat.id == chat_id })[0];
    }
  }
  
}