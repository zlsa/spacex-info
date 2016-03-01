
var P = {
  canvas_size: 128
};

var Payload = Events.extend(function(base) {
  return {
    
    init: function(mission, data) {
      base.init.apply(this, arguments);

      this.mission = mission;

      this.name = null;
      this.type = null;

      this.status = {
        fate: 'success',
        where: 'space',
        state: 'orbit'
      };

      this.parse(data);

      this.init_html();
    },

    parse: function(d) {
      if(typeof d != typeof {}) return;

      this.name = get_key(d, 'name', this.name);
      this.type = get_key(d, 'type', this.type);
      
      var r = get_key(d, 'status', {});

      this.status.fate = get_key(r, 'fate', this.status.fate);
      this.status.where = get_key(r, 'where', this.status.where);
      this.status.state = get_key(r, 'state', this.status.state);
      
    },

    init_html: function() {
      this.html = create_element('li', 'payload');
      this.html.append(create_element('h1', 'payload-name'));
      this.html.find('.payload-name').text(this.name);

      this.html.addClass('fate-' + this.status.fate);
      this.html.addClass('where-' + this.status.where);
      this.html.addClass('state-' + this.status.state);
    },

    get_bottom: function() {
      return 0;
    }

  };
});

var CapsulePayload = Payload.extend(function(base) {
  return {
    
    get_bottom: function() {
      if(this.type == 'cargo-dragon' || this.type == 'dsqu') {
        return 43;
      }
      return 0;
    },

    get_height: function() {
      return 54;
    },

    draw: function() {
      var r = this.mission.timeline.images.payloads[this.type];
      this.cc = create_canvas(P.canvas_size, P.canvas_size);

      var cc = this.cc;
      
      function d(i) {
        cc.drawImage(r[i].data, 0, 0);
      }

      d('vehicle');
    }

  };
});

