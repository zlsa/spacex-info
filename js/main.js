
var Main = Events.extend(function(base) {
  return {
    
    init: function() {
      base.init.apply(this, arguments);
      
      this.init_loader();

      this.init_timeline();

      $(window).resize(with_scope(this, this.resize));

      this.resize();
    },

    init_loader: function() {
      this.loader = new Loader();
      
//      this.loader.on('progress', with_scope(this, this.on_progress));
      this.loader.on('finished', with_scope(this, this.loaded));
    },

    init_timeline: function() {
      this.timeline = new Timeline(this);
    },

    resize: function() {
      var size = [
        $(window).width(),
        $(window).height()
      ];
    },

    loaded: function() {
      var main = this;

      setTimeout(function() {
        main.timeline.loaded();
      }, 300);
    }

  };
});

var m;

$(document).ready(function() {
  m = new Main();
  $('#mission-info-guard').click(function() {
    $('#mission-info').addClass('hidden');
    $('#mission-info-guard').addClass('hidden');
  });
});
