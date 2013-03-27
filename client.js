var domready = require('domready');
var shoe = require('shoe');
var dnode = require('dnode');

domready(function () {
    var tramite_id = Math.floor(Math.random() * 10 );
    var result = document.getElementById('chat');
    stream = shoe('/dnode');
    d = dnode({
      tramite_id: tramite_id + 1,
      receber: function(mensagem) {
        $("#chat").append("<br/>").append(mensagem);
      }
    });
    d.on('remote', function (remote) {
      r = remote;
        // remote.entrarNaFila('beep', function (s) {
        //     result.textContent = 'beep => ' + s;
        // });
    });
    
    
    $("#butao").on('click', function(){
      r.conversar({
        tramite_id: 100,
        user_id: 156,
        msg: $("#conversa").val()
      }, 
      function(tramite) {
        //$("#chat").append("<br/>").append(message.msg);
        //console.log("Tramite", tramite);
      })
      
    });
    
    d.pipe(stream).pipe(d);
});