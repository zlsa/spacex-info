
var Loader = Events.extend(function(base) {
  return {
    
    init: function() {
      base.init.apply(this, arguments);

      this.files = {};
    },

    get_file: function(url) {
      return get_object(this.files, url, null);
    },

    add_file: function(file) {
      this.files[file.url] = file;

      file.load();
    },

    get_file_number: function() {
      return count_object(this.files);
    },

    get_file_size: function() {
      var size = 0;
      
      for(var i in this.files) {
        size += this.files[i].get_total_size();
      }

      return size;
    },

    get_progress: function() {
      var total = this.get_file_size();
      var completed = 0;

      for(var i in this.files) {
        completed += this.files[i].get_current_size();
      }

      if(completed == 0) return 0;
      return completed/total;
    },

    all_files_finished: function() {
      for(var i in this.files) {
        if(!this.files[i].finished) return false;
      }
      
      return true;
    },

    on_progress: function() {
      this.fire('progress', this);
    },

    file_done: function() {

      if(this.all_files_finished()) {
        this.finished();
      }
      
    },

    finished: function() {
      console.log('cached ' + this.get_file_number() + ' files');
      this.fire('finished', this);
    }

  };
});

var File = Events.extend(function(base) {
  return {
    
    init: function(loader, url) {
      base.init.apply(this, arguments);

      this.loader = loader;
      this.url = url;

      this.data = null;

      this.finished = false;

      this.setup();

      this.loader.add_file(this);
    },

    get_progress: function() {
      if(this.finished) return 1;
      return 0;
    },

    get_total_size: function() {
      return 0;
    },

    get_current_size: function() {
      return 0;
    },

    load: function() {
      console.log('not sure what to do...');

      this.done();
    },

    error: function() {
      this.finished = true;
      
      this.loader.file_done(this);
    },

    done: function() {
      this.finished = true;

      console.log(this.url);
      this.parse.apply(this, arguments);

      this.fire('done', this);
      
      this.loader.file_done(this);
    },

    parse: function() {

    }

  };
});

var TextFile = File.extend(function(base) {
  return {
    
    setup: function() {
      this.total_size = 0;
      this.current_size = 0;
      
      this.progress = 0;
    },
    
    get_total_size: function() {
      return this.total_size;
    },

    get_current_size: function() {
      return this.current_size;
    },

    get_progress: function() {
      if(this.finished) return 1;
      return clamp(this.progress, 0.99) || 0;
    },

    on_progress: function(e) {
      if(e.lengthComputable) {
        this.progress = e.total / e.loaded;

        this.total_size = e.total;
        this.current_size = e.loaded;
        
        this.loader.on_progress();
      }
    },

    load: function() {
      this.req = new XMLHttpRequest();
      
      this.req.addEventListener('progress', with_scope(this, this.on_progress));
      this.req.addEventListener('load', with_scope(this, this.done));
      this.req.addEventListener('error', with_scope(this, this.error));
      this.req.addEventListener('abort', with_scope(this, this.error));
      
      this.req.open('GET', this.url);
      this.req.send();
    },

    parse: function(e) {
      this.data = e.target.responseText;
    }

  };
});

var JSONFile = TextFile.extend(function(base) {
  return {
    
    parse: function() {
      base.parse.apply(this, arguments);

      if(this.data)
        this.data = JSON.parse(this.data);
      else
        this.data = {};
    }

  };
});

var ImageFile = File.extend(function(base) {
  return {
    
    setup: function() {
      this.data = new Image();
    },
    
    load: function() {
      this.data.onload = with_scope(this, this.done);
      
      this.data.src = this.url;
    }

  };
});

