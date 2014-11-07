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
    density: isMobile.any() ? 0.02 : 0.2,
    canvas: document.getElementById('space-content'),
    reqAnimationFrame: window.requestAnimationFrame,
    isMobile: isMobile.any()
  });

  system.begin();

  $(window).on("mousedown", function(event) {
    system.onMouseDown({
      x: event.pageX,
      y: event.pageY
    });
  });

  $(window).on("mouseup", function(event) {
    system.onMouseUp({
      x: event.pageX,
      y: event.pageY
    });
  });

  $(window).resize(function() {

    system.resize({
      width: $('#space').width(),
      height: $('#space').height()
    });

  });
});
