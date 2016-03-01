
var PAN = {
  panning: false,
  start_mouse: [0, 0],
  start_pan: [0, 0],
  transform: false,
  start_transform: [0, 0]
};

function pan_mousedown(e) {
  if(e.which != 1) return;
  if(PAN.panning) return;

  PAN.start_mouse = [e.pageX, e.pageY];

  if(PAN.transform) {
    PAN.start_pan = [0, 0];
  } else {
    PAN.start_pan = [$('#scroll').scrollLeft(), $('#scroll').scrollTop()];
  }
  PAN.panning = true;
}

function pan_mousemove(e) {
  if(!PAN.panning) return;

  var mouse_offset = [
    PAN.start_mouse[0] - e.pageX,
    PAN.start_mouse[1] - e.pageY,
  ];

  var pan = [
    mouse_offset[0],
    mouse_offset[1]
  ];

  if(PAN.transform) {
    $('#scroll').css('transform', 'translate(' + (PAN.start_pan[0] - pan[0]) + 'px, ' + (PAN.start_pan[1] - pan[1]) + 'px');
    PAN.start_transform = [PAN.start_pan[0] - pan[0], PAN.start_pan[1] - pan[1]];
  } else {
    $('#scroll').scrollLeft(PAN.start_pan[0] + pan[0]);
    $('#scroll').scrollTop (PAN.start_pan[1] + pan[1]);
  }
}

function pan_mouseup(e) {
  PAN.panning = false;
}

$(document).ready(function() {
  $(window).mousedown(pan_mousedown);
  $(window).mousemove(pan_mousemove);
  $(window).mouseup(pan_mouseup);
});
