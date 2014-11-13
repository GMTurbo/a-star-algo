$(document).ready(function() {

  window.requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

  var isMobile = {
    Android: function() {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
  };

  var system = new System({
    width: $('#space').width(),
    height: $('#space').height(),
    canvas: document.getElementById('space-content'),
    reqAnimationFrame: window.requestAnimationFrame,
    isMobile: isMobile.any()
  });

  system.begin();

  var mouseDown1 = 0, mouseDown2 = 0;

  $(window).on("mousedown", function(event) {
    event.stopPropagation();
    if(event.ctrlKey){
      mouseDown2 = 1;
    }else{
      mouseDown1 = 1;
    }

  });

  $(window).on("mousemove", function(event) {
    system.onMouseMove({
      x: event.pageX,
      y: event.pageY,
      mouseDown1: mouseDown1,
      mouseDown2: mouseDown2
    });
  });

  $(window).on("mouseup", function(event) {
    event.stopPropagation();
    mouseDown1 = mouseDown2 = 0;
  });

  $(window).on("keypress", function(event) {
    system.onKeyPress({
      keyCode: event.keyCode
    });
  });

  $(window).resize(function() {

    system.resize({
      width: $('#space').width(),
      height: $('#space').height()
    });

  });
});
