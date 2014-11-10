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
    start, end, current,
    open = [],
    closed = [];

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

    var scale = 10;

    for (var i = 0, x = ~~(width / scale); i < x; i++) {
      for (var j = 0, y = ~~(height / scale); j < y; j++) {
        mesh.push(new Node({
          i: i,
          j: j,
          width: ~~(scale),
          wall: Math.random() <= 0.05
        }));
      }
    }

    start = mesh[~~(Math.random() * mesh.length)];
    start.startingNode = true;
    current = start;
    end = mesh[~~(Math.random() * mesh.length)];
    end.endingNode = true;

    _.forEach(mesh, function(node) {
      node.setHueristic(calculateHeuristic(node, end));
    })

    open.push(current);

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  function calculateHeuristic(current, target) {
    //manhattan heuristic is just the number of
    // nodes between the node and the target
    if(current.wall) return 1e5;
    return Math.abs(current.x - target.x) + Math.abs(current.y - target.y)
  };

  function calculateMoveCost(current, target) {
    // 10 for nodes next too
    // 14 for nodes diagonal too
    return 1; //(Math.abs(current.x - target.x) == 1 * * )
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

  var done = false;

  function updatePath() {
    //determine the walkable adjacent squares to current start position

    if (done.length > 0 || open.length == 0) {
      return;
    }

    current.open = 0;

    var next = _.min(open, function(node) {
      return node.F;
    });

    next.inPath = true;

    current.parent = next;

    current = next;

    closed.push(current);

    _.reject(open, function(node) {
      return current.getIndex() === node.getIndex(); // or some complex logic
    });

    done = _.filter(closed, function(node) {
      return node.getIndex() === end.getIndex();
    });

    if (done.length > 0) {
      return;
    }

    var neighbors = getWalkableNode(current, mesh);

    var withinOpened, withinClosed;

    _.forEach(neighbors, function(neighbor) {

      withinClosed = _.filter(closed, function(node) {
        return node.getIndex() === neighbor.getIndex();
      });

      if (withinClosed.length > 0)
        return;

      withinOpened = _.filter(open, function(node) {
        return node.getIndex() === neighbor.getIndex();
      });

      if (withinOpened.length == 0) {
        neighbor.parent = current;
        neighbor.open = 1;
        neighbor.setMovementCost(Math.abs(neighbor.i - start.i) + Math.abs(neighbor.j - start.j));
        open.push(neighbor);
      } else {
        var g = Math.abs(neighbor.i - current.i) + Math.abs(neighbor.j - current.j);

        if (g + neighbor.H <= neighbor.F) {
          neighbor.setMovementCost(g);
          neighbor.parent = current;
        }
      }
    });
  };

  function getWalkableNode(current, all) {
    return _.filter(all, function(node) {
      if (!node.open || node.wall || node.getIndex() == current.getIndex())
        return false;
      if (Math.abs(current.i - node.i) == 1 && Math.abs(current.j - node.j) == 0) {
        return true;
      } else if (Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 0) {
        return true;
      }else if(Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 1){
        return true;
      }
      return false;
    });
  };

  function drawSystem() {
    context.clearRect(0, 0, width, height);
    _.forEach(mesh, function(node) {
      //node.drawFromCamera(context, mousePos);
      node.draw(context);
    });
  };

  function updateSystem() {
    updatePath();
    drawSystem();
    reqFrame(updateSystem);
  };

  var mousePos = [0, 0];

  function onMouseMove(mouse) {
    mousePos = [mouse.x, mouse.y];
    //drawSystem();
    //console.log(mousePos);
  }

  function resize(size) {
    width = size.width;
    height = size.height;
    setup();
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove
  }
};
