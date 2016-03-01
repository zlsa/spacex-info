
var V = {
  canvas_height: 512,
  landing_height: 128
};

var Vehicle = Events.extend(function(base) {
  return {
    
    init: function(mission, data) {
      base.init.apply(this, arguments);

      this.mission = mission;

      this.type = null;

      this.capsule = null;
      this.payloads = [];

      this.configuration = {
        fairing: false,
        legs: false,
        grid_fins: false,
        rcs: true,
        octaweb: 'white'
      };

      this.fate = 'success';
      this.lost_at = 0;

      this.recovery = {
        fate: 'lost',
        where: 'ocean',
        state: 'destroyed'
      };

      this.parse(data);
    },

    parse: function(d) {
      if(typeof d != typeof {}) return;

      this.type = get_key(d, 'type', this.type);
      
      if(this.type == 'f1') {
        this.configuration.rcs = false;
        this.configuration.fairing = false;
      } else if(this.type == 'f9-v1.0') {
        this.configuration.rcs = false;
      } else if(this.type == 'f9-v1.1') {
        this.configuration.grid_fins = false;
        this.configuration.legs = false;
        this.configuration.rcs = true;
        this.configuration.octaweb = 'white';
      } else if(this.type == 'f9-v1.2') {
        this.configuration.grid_fins = true;
        this.configuration.legs = true;
        this.configuration.rcs = true;
        this.configuration.octaweb = 'black';
      }
      
      var c = get_key(d, 'configuration', {});

      this.configuration.fairing = get_key(c, 'fairing', this.configuration.fairing);
      this.configuration.legs = get_key(c, 'legs', this.configuration.legs);
      this.configuration.grid_fins = get_key(c, 'grid-fins', this.configuration.grid_fins);
      this.configuration.rcs = get_key(c, 'rcs', this.configuration.rcs);
      this.configuration.octaweb = get_key(c, 'octaweb', this.configuration.octaweb);
      
      var r = get_key(d, 'recovery', {});

      this.recovery.fate = get_key(r, 'fate', this.recovery.fate);
      this.recovery.where = get_key(r, 'where', this.recovery.where);
      this.recovery.state = get_key(r, 'state', this.recovery.state);
      
      this.fate = get_key(d, 'fate', this.fate);
      this.lost_at = get_key(d, 'lost-at', this.lost_at);
    },

    draw_vehicle: function() {
      var r = this.mission.timeline.images.vehicles[this.type];
      var cc = this.cc;

      function d(i) {
        cc.drawImage(r[i].data, 0, 0);
      }

      d('vehicle');

      if(this.configuration.fairing) {
        d('fairing');
      }

      if(this.configuration.legs) {
        d('legs');
      }

      if(this.configuration.grid_fins) {
        d('grid-fins');
      }

      if(this.configuration.rcs) {
        d('rcs');
      }

      if(this.configuration.octaweb == 'black') {
        d('black-octaweb');
      }

      if(this.capsule) {
        var vehicle_top = this.get_payload();
        var capsule_top = this.capsule.get_bottom();
        
        this.capsule.draw();
        
        cc.drawImage(this.capsule.cc.canvas, 0, (V.canvas_height - this.get_payload()) - (P.canvas_size - capsule_top));
      }

    },

    draw_landing: function() {
      var r = this.mission.timeline.images.landing;
      var cc = this.cc;

      function d(i) {
        cc.drawImage(r[i].data, 0, V.canvas_height - V.landing_height);
      }

      if(this.recovery.fate == 'landed') {
        if(this.recovery.where == 'ocean') {
          d('ocean');
        } else if(this.recovery.where == 'land' || this.recovery.where == 'lz-1') {
          d('land');
        } else if(this.recovery.where == 'barge' || this.recovery.where == 'ocisly' || this.recovery.where == 'jrti') {
          d('ocean');
          d('barge');
        }

        if(this.recovery.state == 'destroyed') {
          d('lost');
        } else {
          d('rocket');
        }
      }

    },

    draw: function() {
      this.cc = create_canvas(128, V.canvas_height);

      this.draw_vehicle();
      this.draw_landing();
    },
    
    get_payload: function() {
      var vehicle_top = {
        'f1': 125,
        'f9-v1.0': 300,
        'f9-v1.1': 392,
        'f9-v1.2': 404
      };
      return vehicle_top[this.type];
    },
    
    get_height: function() {
      var h = this.get_payload();
      if(this.capsule) {
        h += this.capsule.get_height();
      } else if(this.configuration.fairing) {
        h += 104;
      }
      return h;
    }

  };
});

