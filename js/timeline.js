
var Timeline = Events.extend(function(base) {
  return {
    
    init: function(main) {
      base.init.apply(this, arguments);

      this.main = main;
      this.loader = main.loader;

      this.missions = [];

      this.mission_list = new JSONFile(this.loader, 'data/missions.json');
      this.mission_list.on('done', with_scope(this, this.load_missions));

      this.images = {};
      
      this.init_images();
    },

    init_images: function() {
      this.images.vehicles = {};
      this.images.payloads = {};

      this.init_destination_images(['geo', 'iss', 'leo', 'polar-leo', 'sun-earth-l1', 'lost']);
      
      this.init_landing_images(['ocean', 'barge', 'land', 'lost', 'rocket']);
      
      this.init_payload_images('dsqu', ['vehicle']);
      this.init_payload_images('cargo-dragon', ['vehicle']);
      this.init_payload_images('crew-dragon', ['vehicle']);
      
      this.init_vehicle_images('f1', ['vehicle']);
      this.init_vehicle_images('f9-v1.0', ['vehicle', 'rcs']);
      this.init_vehicle_images('f9-v1.1', ['vehicle', 'fairing', 'grid-fins', 'legs', 'rcs', 'black-octaweb']);
      this.init_vehicle_images('f9-v1.2', ['vehicle', 'fairing', 'grid-fins', 'legs', 'rcs', 'black-octaweb']);
    },

    init_directory_images: function(directory, prefix, images) {
      var f = {};

      for(var i=0; i<images.length; i++) {
        var img = images[i];
        if(prefix) img = '/' + img;
        f[images[i]] = new ImageFile(this.loader, 'images/' + directory + '/' + prefix + img + '.png');
      }

      if(prefix != '')
        this.images[directory][prefix] = f;
      else
        this.images[directory] = f;
    },
    
    init_destination_images: function(images) {
      this.init_directory_images('destinations', '', images);
    },
    
    init_landing_images: function(images) {
      this.init_directory_images('landing', '', images);
    },
    
    init_vehicle_images: function(vehicle, images) {
      this.init_directory_images('vehicles', vehicle, images);
    },
    
    init_payload_images: function(vehicle, images) {
      this.init_directory_images('payloads', vehicle, images);
    },
    
    load_missions: function(file) {
      var missions = file.data.missions;

      for(var i=0; i<missions.length; i++) {
        this.add_mission(new MissionFile(this.loader, 'data/mission/' + missions[i] + '.json', this));
      }
      
    },

    loaded: function() {
      this.missions.sort(function(a, b) {
        if(a.launch_time < b.launch_time) return -1;
        if(a.launch_time > b.launch_time) return 1;
        return 0;
      });
      for(var i=0; i<this.missions.length; i++) {
        this.missions[i].draw();
      }
    },

    add_mission: function(mission) {
      this.missions.push(mission);
    }

  };
});
