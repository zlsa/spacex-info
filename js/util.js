
function time() {
  return Date.now() * 0.001;
}

function clamp(a, n, b) {
  if(!b) b = Infinity;
  if(a > b) {
    var temp = a;
    a = b;
    b = temp;
  }
  if(n < a) return a;
  if(n > b) return b;
  return n;
}

function radians(deg) {
  return deg * Math.PI / 180;
}

function degrees(rad) {
  return rad / Math.PI * 180;
}

function lerp(il, i, ih, ol, oh) {
  return ol + (oh - ol) * (i - il) / (ih - il);
}

function clerp(il, i, ih, ol, oh) {
  return clamp(ol,  lerp(il, i, ih, ol, oh), oh);
}

function distance_2d(x, y) {
  return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function elapsed(now, start) {
  return (now - start);
}

function with_scope(context, func) {
  return function() {
    if(func)
      func.apply(context, arguments);
  };
}

function log_array(a) {
  console.log(a.join(' '));
}

function count_object(obj) {
  var c = 0;
  for(var p in obj) c++;
  return c;
}

function get_key(obj, key, def) {
  if(key in obj) return obj[key];
  return def;
}

function create_canvas(w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c.getContext('2d');
}

function create_element(el, classes) {
  if(!classes) classes = '';
  var c = $(document.createElement(el));
  c.addClass(classes);
  return c;
}
