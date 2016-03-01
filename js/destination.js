
var Destination = Events.extend(function(base) {
  return {
    
    init: function(mission, data) {
      base.init.apply(this, arguments);

      this.mission = mission;

      this.geo = false;
      this.altitude = 0;
      this.inclination = 0;

      this.station = null;

      this.parse(data);
    },

    get_orbit: function() {
      if(this.station) return this.station;
      
      if(this.altitude == 35780 && this.inclination == 0)
        return 'geo';
      else if(this.altitude < 2000 && this.inclination >= 70)
        return 'polar-leo';
      else if(this.altitude < 2000)
        return 'leo';
      return 'lost';
    },
    
    parse: function(d) {
      if(typeof d != typeof {}) return;

      this.altitude = get_key(d, 'altitude', this.altitude);
      this.inclination = get_key(d, 'inclination', this.inclination);
      
      this.station = get_key(d, 'station', this.station);

      if(this.station == 'iss') {
        this.altitude = 400;
        this.inclination = 50;
      }
      
      if(this.station == 'geo') {
        this.altitude = 35780;
        this.inclination = 0;
      }
      
    }

  };
});
