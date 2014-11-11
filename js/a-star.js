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
    closed = [],
    run = false,
    scale = 25;

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

    for (var i = 0, x = ~~(width / scale); i < x; i++) {
      for (var j = 0, y = ~~(height / scale); j < y; j++) {
        mesh.push(new Node({
          i: i,
          j: j,
          index: i * x + j,
          width: ~~(scale),
          wall: Math.random() <= 0.05
        }));
      }
    }

    start = mesh[0];
    start.startingNode = true;
    current = start;
    end = mesh[mesh.length - 1];
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
    if (current.wall) return 1e5;
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

  var found = false,
    stuckCount = 0;

  function updatePath() {
    //determine the walkable adjacent squares to current start position

    if(!run)
      return;

    if (found || open.length == 0) {
      colorPath(current);
      run = false;
      return;
    }

    current.open = 0;

    // var next = _.min(open, function(node) {
    //   return node.F;
    // });
    var next = _.sortBy(open, function(node) {
      return node.F;
    });

    //if (next.length == 1) {
      next = next[0];
    // } else if (stuckCount > 5 && Math.abs(next[0].F - next[1].F) <= 30) {
    //   stuckCount = 0;
    //   next = next[~~(Math.random() * (next.length > 10 ? 10 : next.length))];
    // } else {
    //  next = next[0];
    //}

    next.inPath = true;

    //current.parent = next;

    if (current.index == next.index)
      stuckCount++;

    current = next;


    if (!_.contains(closed, current))
      closed.push(current);

    _.reject(open, function(node) {
      return current.getIndex() === node.getIndex(); // or some complex logic
    });

    found = _.contains(closed, end)

    if (found) {
      return;
    }

    var neighbors = getWalkableNode(current, mesh);

    _.forEach(neighbors, function(neighbor) {
      determineNodeValues(current, neighbor);
    });
  };

  function colorPath(current) {
    current.finished = true;
    if (current.parent) {
      colorPath(current.parent);
    }
  };

  function determineNodeValues(current, testing) {
    if (testing.getIndex() == end.getIndex()) {
      end.parent = current;
      found = true;
      return;
    }

    if (testing.wall)
      return;

    if (!_.contains(closed, testing)) {
      if (_.contains(open, testing)) {
        var newCost = getCost(current, testing);
        if (newCost <= testing.G) {
          testing.parent = current;
          testing.setMovementCost(newCost);
        }
      } else {
        testing.parent = current;
        testing.setMovementCost(getCost(current, testing));
        testing.open = 1;
        open.push(testing);
      }
    }
  }

  function getCost(current, node) {
    if (Math.abs(current.i - node.i) == 1 && Math.abs(current.j - node.j) == 0) {
      return 10;
    } else if (Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 0) {
      return 10;
    } else if (Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 1) {
      return 14;
    }
    return 20;
  }

  function getWalkableNode(current, all) {
    return _.filter(all, function(node) {
      if (!node.open || node.wall || node.getIndex() == current.getIndex())
        return false;
      if (Math.abs(current.i - node.i) == 1 && Math.abs(current.j - node.j) == 0) {
        return true;
      } else if (Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 0) {
        return true;
      } else if (Math.abs(current.j - node.j) == 1 && Math.abs(current.i - node.i) == 1) {
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

  function onMouseMove(mouse) {
    if (mouse.mouseDown)
      addWallToNode([mouse.x, mouse.y]);
    //drawSystem();
    //console.log(mousePos);
  }

  function onKeyPress(e) {
    if (e.keyCode == 0 || e.keyCode == 32) {
      run = !run;
    }
  }

  function addWallToNode(pos) {
    var nodes = _.filter(mesh, function(node) {
      return Math.sqrt(Math.pow(pos[0] - node.x, 2) +
      Math.pow(pos[1] - node.y, 2)) < scale;
    });

    if (nodes.length > 0) {
      _.forEach(nodes, function(node) {
        node.wall = true;
      });
    }
  }

  function resize(size) {
    width = size.width;
    height = size.height;
    setup();
  }

  return {
    begin: setup,
    resize: resize,
    onMouseMove: onMouseMove,
    onKeyPress: onKeyPress
  }
};
