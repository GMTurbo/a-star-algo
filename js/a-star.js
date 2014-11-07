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
    getRadiusByBrowser = function() {
      return isMobile ? 15 : 6;
    };

  var entities = [];

  var setup = function() {

    entities = [];

    $(canvas).attr('width', width).attr('height', height);

    insertCops();

    var count = density * width;

    for (var i = 0; i < count; i++) {

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: helper.getRandomPnt(width, height, 150),
        type: 'robber',
        radius: getRadiusByBrowser()
      }));
    }

    if (initialSetup) {
      updateSystem();
      initialSetup = false;
    }
  };

  var insertCops = function() {

    var count = isMobile ? 2 : 3;

    for (var i = 0; i < count; i++) {

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [i * width / count, 0],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [i * width / count, height],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [0, i * height / count],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
      }));

      entities.push(new Body({
        borderX: {
          min: 0,
          max: width
        },
        borderY: {
          min: 0,
          max: height
        },
        start: [width, i * height / count],
        //  sentry: true,
        type: 'cop',
        radius: getRadiusByBrowser()
      }));
    }
  };

  var resize = function(size) {
    width = size.width;
    height = size.height;
    setup();
  };

  var updateSystem = function() {
    updateEntities();
    drawSystem();
    reqFrame(updateSystem);
  };

  //this is where the pursuit algo kicks in
  var updateEntities = function() {

    var self = [],
      other = [],
      vec = [],
      mag, withinDistance = 50, sliceCount = 10;

    if (mouseCop && !mcInserted) {
      entities.push(mouseCop);
      mcInserted = true;
    }
    //get all the robbers
    var robbers = _.filter(entities, function(ent) {
      return ent.getType() == 'robber';
    });

    //get all the cops
    var cops = _.filter(entities, function(ent) {
      return ent.getType() == 'cop';
    });

    var captured = _.filter(entities, function(ent) {
      return ent.getType() == 'captured';
    });

    if (robbers.length === 0) {
      setup();
      return;
    }

    var within = [];

    _.forEach(robbers, function(rob) {

      self = rob.getPosition();

      within = helper.getClosest(cops, self, sliceCount);//getWithin(cops, self, withinDistance);

      if (within.length == 0)
        within = cops;

      //calculate vector first
      vec = [0, 0];

      _.forEach(within, function(cop) {
        other = cop.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (self[0] - other[0]) / (mag * mag);
        vec[1] += (self[1] - other[1]) / (mag * mag);
      });

      _.forEach(captured, function(cap) {
        other = cap.getPosition();
        mag = helper.getDistance(self, other);
        if (mag < cap.getRadius() * 2) {
          cap.setType('robber');
          // var rad = cop.getRadius();
          // cop.setRadius(rad + rad * 0.01);
        }
      });

      mag = helper.getDistance(self, [0, self[1]]);
      vec[0] += (self[0]) / (mag * mag);

      mag = helper.getDistance(self, [self[0], 0]);
      vec[1] += (self[1]) / (mag * mag);

      mag = helper.getDistance(self, [self[0], height]);
      vec[1] += (self[1] - height) / (mag * mag);

      mag = helper.getDistance(self, [width, self[1]]);
      vec[0] += (self[0] - width) / (mag * mag);

      rob.step(helper.normalizeVector(vec));

    });

    _.forEach(cops, function(cop) {

      self = cop.getPosition();

      within = helper.getClosest(robbers, self, sliceCount);

      if (within.length == 0)
        within = robbers;

      vec = [0, 0];

      _.forEach(within, function(rob) {
        other = rob.getPosition();
        mag = helper.getDistance(self, other);
        vec[0] += (other[0] - self[0]) / (mag * mag); //reverse vector direction
        vec[1] += (other[1] - self[1]) / (mag * mag); //reverse vector direction
        if (mag < rob.getRadius() * 2) {
          rob.setType('captured');
          //var rad = cop.getRadius();
          //cop.setRadius(rad + rad * 0.01);
        }
      });

      cop.step(helper.normalizeVector(vec));
    });
  };

  var drawSystem = function() {
    context.clearRect(0, 0, width, height);
    _.forEach(entities, function(ent) {
      ent.draw(context);
    });
  };

  var mouseCop, mcInserted;
  var onMouseDown = function(coords) {
    mouseCop = new Body({
      borderX: {
        min: 0,
        max: width
      },
      borderY: {
        min: 0,
        max: height
      },
      start: [coords.x, coords.y],
      type: 'cop',
      radius: getRadiusByBrowser()
    });
  };

  var onMouseUp = function(coords) {
    mouseCop = undefined;
    mcInserted = false;
  };

  return {
    begin: setup,
    resize: resize,
    onMouseDown: onMouseDown,
    onMouseUp: onMouseUp
  };
};

var helper = {
  getRandomPnt: function(xRange, yRange, spacer) {
    return [_.random(spacer, xRange - spacer), _.random(spacer, yRange - spacer)];
  },
  normalizeVector: function(vec) {
    var mag = Math.sqrt((vec[0] * vec[0]) + (vec[1] * vec[1]));
    vec[0] /= mag;
    vec[1] /= mag;
    return vec;
  },
  getWithin: function(arr, target, distance) {
    return _.filter(arr, function(pnt) {
      return helper.getDistance(target, pnt.getPosition()) <= distance;
    });
  },
  getDistance: function(pnt1, pnt2) {
    return Math.sqrt(
      Math.pow(pnt2[0] - pnt1[0], 2) +
      Math.pow(pnt2[1] - pnt1[1], 2)
    );
  },
  getClosest: function(arr, target, count) {
    var sorted = _.sortBy(arr, function(pnt) {
      return helper.getDistance(target, pnt.getPosition());
    });

    return sorted.slice(0,count);
  }
};
