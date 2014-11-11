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

  var mouseDown = 0;

  $(window).on("mousedown", function(event) {
    mouseDown = 1;
  });

  $(window).on("mousemove", function(event) {
    system.onMouseMove({
      x: event.pageX,
      y: event.pageY,
      mouseDown: mouseDown
    });
  });

  $(window).on("mouseup", function(event) {
    mouseDown = 0;
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
