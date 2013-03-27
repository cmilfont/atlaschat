module.exports = function(options) {
  
  return function(client, con) {
    this.subscribe = function(chan, fn) {
      fn("teste");
    }
  }
  
}