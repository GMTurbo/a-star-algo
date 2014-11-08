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
    start, end,
    mesh = [];

  var setup = function() {
    //heuristic value of each node can
    // be calculate once because we are using
    // a static mesh
    // heuristic of each node is dependent
    // on start and stop location of path

    //so let's randomly select the start and
    // stop locations

    mesh = [];

    $(canvas).attr('width', width).attr('height', height);

    var count = width * height,
      scale = 20;

    start = getStartLocation({
        xRange: {
          min: 0,
          max: ~~(width / scale)
        },
        yRange: {
          min: 0,
          max: ~~(height / scale)
        }
      }),
      end = getEndLocation({
        xRange: {
          min: 0,
          max: ~~(width / scale)
        },
        yRange: {
          min: 0,
          max: ~~(height / scale)
        }
      });

    for (var i = 0, x = ~~(width / scale); i <= x; i++) {
      for (var j = 0, y = ~~(height / scale); j <= y; j++) {
        mesh.push(new Node({
          x: i * scale,
          y: j * scale,
          width: ~~(scale/2),
          h: calculateHeuristic({
            x: i * scale,
            y: j * scale
          }, end),
          g: calculateMoveCost(start, {
            x: i * scale,
            y: j * scale
          })
        }));
      }
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  function calculateHeuristic(current, target) {
    //manhattan heuristic is just the number of
    // nodes between the node and the target
    return Math.abs(current.x - target.x) + Math.abs(current.y - target.y)
  };

  function calculateHeuristic(current, target) {
    // 10 for nodes next too
    // 14 for nodes diagonal too
    return (Math.abs(current.x - target.x) == 1 **)
  };

  function getStartLocation(area) {
    if (!start) {
      start = {
        x: area.xRange.min,
        y: area.yRange.min
      }
    }
    return start;
  };

  function getEndLocation(area) {
    if (!end) {
      end = {
        x: area.xRange.max,
        y: area.yRange.max
      }
    }
    return end;
  };

  function updateNodes(){
    // get current
    // open 
  };

  function drawSystem() {
    context.clearRect(0, 0, width, height);
    _.forEach(mesh, function(node) {
      node.draw(context);
    });
  };

  function updateSystem() {
    updateNodes();
    drawSystem();
    reqFrame(updateSystem);
  };

  return {
    begin: setup
  }
};
