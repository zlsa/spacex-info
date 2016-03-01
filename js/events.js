
var Events = Fiber.extend(function() {
  return {
    
    init: function() {
      this.events = {};
    },

    on: function(type, func, extra) {
      (this.events[type] = this.events[type] || []).push([func, extra]);
    },

    off: function(type, func) {
      var list = this.events[type] || [];
      for(var i=0; i<list.length; i++) {
        if(func == list[i][0])
          list.splice(i, 1);
      }
    },

    fire: function(type, data) {
      var list = this.events[type] || [];
      for(var i=list.length-1; i>=0; i--) {
        list[i][0](data, list[i][1]);
      }
    }

  };
});
