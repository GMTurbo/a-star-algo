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
          index: i*x+j,
          width: ~~(scale),
          wall: Math.random() <= 0.3
        }));
      }
    }

    start = mesh[0];
    start.startingNode = true;
    current = start;
    end = mesh[mesh.length-1];
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

  var found = false;

  function updatePath() {
    //determine the walkable adjacent squares to current start position

    if (found || open.length == 0) {
      return;
    }

    current.open = 0;

    // var next = _.min(open, function(node) {
    //   return node.F;
    // });
    var next = _.sortBy(open, function(node) {
      return node.F;
    });

    if (next.length == 1) {
      next = next[0];
    } else if (Math.abs(next[0].F - next[1].F) < 5){
      next = next[~~(Math.random() * 3)];
    }else{
      next = next[0];
    }

    next.inPath = true;

    current.parent = next;

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
      // withinClosed = _.filter(closed, function(node) {
      //   return node.getIndex() === neighbor.getIndex();
      // });
      //
      // if (withinClosed.length > 0)
      //   return;
      //
      // withinOpened = _.filter(open, function(node) {
      //   return node.getIndex() === neighbor.getIndex();
      // });
      //
      // if (withinOpened.length == 0) {
      //   neighbor.parent = current;
      //   neighbor.open = 1;
      //   neighbor.setMovementCost(getCost(neighbor, start));
      //   open.push(neighbor);
      // } else {
      //   var g = getCost(current, neighbor); //Math.abs(neighbor.i - current.i) + Math.abs(neighbor.j - current.j);
      //
      //   if (g + neighbor.H <= neighbor.F) {
      //     neighbor.setMovementCost(g);
      //     neighbor.parent = current;
      //   }
      // }
    });
  };

  function determineNodeValues(current, testing) {
    if (testing.getIndex() == end.getIndex()) {
      end.parent = current;
      found = true;
      return;
    }

    if (testing.wall) return;

    if (!_.contains(closed, testing)) {
      if (_.contains(open, testing)) {
        var newCost = getCost(current, testing);
        if (newCost < testing.G) {
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
    return 10;
  }

  function getWalkableNode(current, all) {
    return _.filter(all, function(node) {
      if (!node.open || node.getIndex() == current.getIndex())
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
