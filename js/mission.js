
var M = {
  destination_width: 128,
  destination_height: 230,
  destination_size: 128,
  vehicle_distance: 24,
  vehicle_split: 0,
  vehicle_split_separation: 16,
  min_length: 48,
  karman_line: 256,
  destination: {
    leo: 160,
    iss: 160,
    'polar-leo': 160,
    geo: 64,
    'sun-earth-l1': 64,
    lost: 256
  },
  destination_distance: {
    leo: 32,
    iss: 32,
    'polar-leo': 32,
    geo: 32,
    'sun-earth-l1': 48,
    lost: 20
  }
};

var Mission = Events.extend(function(base) {
  return {
    
    init: function(timeline) {
      base.init.apply(this, arguments);

      this.timeline = timeline;

      this.name = null;
      this.customer = null;

      this.launch_time = 0;

      this.vehicle = null;
      this.capsule = null;

      this.payloads = [];
      
      this.destination = null;

      this.init_html();
    },

    init_html: function() {
      this.html = create_element('div', 'mission');
      this.html.append(create_element('div', 'vehicle'));
      this.html.append(create_element('div', 'mission-info'));
      this.html.find('.mission-info').append(create_element('h2', 'mission-customer'));
      this.html.find('.mission-info').append(create_element('ul', 'mission-payloads'));
    },

    parse: function(d) {
      if(typeof d != typeof {}) return;

      this.name = get_key(d, 'name', this.name);
      this.customer = get_key(d, 'customer', this.customer);
      
      this.launch_time = get_key(d, 'launch-time', 0);

      if(get_key(d, 'vehicle')) {
        this.vehicle = new Vehicle(this, d.vehicle);
      }

      if(get_key(d, 'capsule')) {
        this.capsule = new CapsulePayload(this, d.capsule);
        if(this.vehicle) this.vehicle.capsule = this.capsule;
      }

      if(get_key(d, 'payloads')) {
        for(var i=0; i<d.payloads.length; i++) {
          var p = new Payload(this, d.payloads[i]);
          this.payloads.push(p);
          if(this.vehicle) this.vehicle.payloads.push(p);
        }
      }

      if(get_key(d, 'destination')) {
        this.destination = new Destination(this, d.destination);
      }
      
    },

    get_orbit: function() {
      if(!this.destination) {
        return 'lost';
      }
      if(this.vehicle.fate == 'lost') return 'lost';
      return this.destination.get_orbit();
    },

    draw_vehicle: function() {
      this.cc.drawImage(this.vehicle.cc.canvas, 0, M.destination_height);
    },
      
    draw_target: function() {
      var cc = this.cc;

      var dest = this.get_orbit();

      var h = M.destination_width * 0.5;
      var voffs = (V.canvas_height + M.destination_height);
      var vehicle_top = this.vehicle.get_height() + M.vehicle_distance;

      var dest_height = M.destination[dest];
      var dest_dist = M.destination_distance[dest];

      if(dest == 'lost') {
        dest_height = clerp(0, this.vehicle.lost_at || 150, 200, voffs - vehicle_top - M.min_length, dest_height);
      }

      dest_height = Math.round(dest_height);
      
      cc.strokeStyle = 'rgb(180, 180, 180)';
      
      // first stage

      var first_stage_start = voffs - vehicle_top;
      var first_stage_end = dest_height + dest_dist;
      first_stage_end = Math.max(first_stage_end, M.vehicle_split + M.vehicle_split_separation/2);
      
      cc.beginPath();

      cc.moveTo(h, first_stage_start);
      cc.lineTo(h, first_stage_end);

      cc.lineWidth = 4;

      cc.stroke();

      // second stage

      var second_stage_start = first_stage_end - M.vehicle_split_separation/2;
      var second_stage_end = dest_height + dest_dist;

      if(second_stage_end < second_stage_start) {

        cc.beginPath();

        cc.moveTo(h, second_stage_start);
        cc.lineTo(h, second_stage_end);

        cc.lineWidth = 2;
        cc.stroke();
      }

      if(false) {
        cc.beginPath();

        cc.moveTo(0, M.karman_line + 0.5);
        cc.lineTo(M.destination_width, M.karman_line + 0.5);

        cc.lineWidth = 1;
        cc.stroke();
      }

      cc.drawImage(this.timeline.images.destinations[dest].data, 0, dest_height - (M.destination_size * 0.5));
      
    },
    
    draw: function() {
      if(!this.vehicle) return;
      
      this.vehicle.draw();
      
      this.cc = create_canvas(M.destination_width, V.canvas_height + M.destination_height);

      this.draw_vehicle();
      this.draw_target();
      
      this.html.find('.vehicle').append(this.cc.canvas);

      var vehicle_classes = {
        'f1': 'f1',
        'f9-v1.0': 'f9v10',
        'f9-v1.1': 'f9v11',
        'f9-v1.2': 'f9v12'
      };
      
      this.html.addClass('vehicle-' + vehicle_classes[this.vehicle.type]);
      this.html.addClass('fate-' + this.vehicle.fate);

      if(!this.launch_time) console.log('no launch time for ' + this.name);

      this.html.find('.mission-customer').text(this.customer);

      if(this.capsule) {
        this.html.find('.mission-payloads').append(this.capsule.html);
      }
      
      for(var i=0; i<this.payloads.length; i++) {
        this.html.find('.mission-payloads').append(this.payloads[i].html);
      }

      if(this.launch_time > time()) {
        this.html.addClass('future-launch');
      }
      
      $('#timeline').append(this.html);
    }

  };
});

var MissionFile = Mission.extend(function(base) {
  return {
    
    init: function(loader, url, timeline) {
      base.init.apply(this, arguments);

      this.timeline = timeline;

      this.file = new JSONFile(loader, url);
      this.file.on('done', with_scope(this, this.file_loaded));
    },

    file_loaded: function(file) {
      this.parse(file.data);
    }

  };
});

