var System = function(options) {

  options = _.defaults(options, {
    density: 0.1,
    width: 100,
    height: 100,
    isMobile: false
  });

  if (!options.canvas) {
    console.error("canvas element required for cops and robbas :/");
    return;
  }

  if (!options.reqAnimationFrame) {
    console.error("window.requestAnimationFrame required for cops and robbas :/");
    return;
  }

  var canvas = options.canvas,
    width = options.width,
    height = options.height,
    density = options.density,
    reqFrame = options.reqAnimationFrame,
    context = canvas.getContext('2d'),
    initialSetup = true,
    isMobile = options.isMobile,
    mesh = [];

  var setup = function() {

    mesh = [];

    $(canvas).attr('width', width).attr('height', height);

    var count = width * height;

    for (var i = 0; i < width; i++) {
      for (var j = 0; j < height; j++) {
        mesh.push(new Node({
          x: i,
          y: j,

        }));
      }
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  return {

  }
};
