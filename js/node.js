var Node = function(options) {
  options = _.defaults(options, {
    h: 0,
    g: 0,
    width: 1,
    i: 0,
    j: 0,
    wall: false,
    index: 0
  });
  // hueristic (h), movement cost (g), f-val (g+h), parent (a node to reach this node)
  this.i = options.i,
    this.j = options.j,
    this.width = options.width,
    this.x = this.i * this.width,
    this.y = this.j * this.width,
    this.wall = options.wall,
    this.H = options.h,
    this.G = options.wall ? 1000 : options.g,
    this.F = this.H + this.G,
    this.parent = null,
    this.open = -1,
    this.scaler = 5,
    this.opacity = 0,
    this.inPath = false,
    this.finished = false,
    this.startingNode = false,
    this.endingNode = false,
    this.index = options.index;
};

Node.prototype.getColor = function() {
  var color;

  switch (this.open) {
    case 0:
      color = 'rgba(255,200,0,' + 200 + ')';
      break;
    case 1:
      color = 'rgba(171,241,55,' + 200 + ')';
      break;
    default:
      color = 'rgba(255,0,0,' + this.opacity + ')';
      break;
  }

  if (this.wall) {
    color = 'rgba(254,100,100,' + 200 + ')';
  }

  if (this.inPath) {
    color = 'rgba(171,0,55,' + 200 + ')';
  }

  if (this.startingNode || this.endingNode || this.finished) {
    color = 'rgba(0,0,255,' + 200 + ')';
  }

  return color;
};

Node.prototype.getShadowColor = function() {
  switch (this.open) {
    case 0:
      return 'rgba(0,0,0,1)';
    case 1:
      return 'rgba(0,0,0,10)';
    default:
      return 'rgba(0,0,0,10)';
  }
  //return 'rgba(0,0,0,1)';
};

Node.prototype.setMovementCost = function(g) {
  this.G = g;
  this.F = this.H + this.G;
};

Node.prototype.setHueristic = function(h) {
  this.H = h;
  this.F = this.H + this.G;
};

Node.prototype.setParent = function(parent) {
  this.parent = parent;
};

Node.prototype.draw = function(context) {

  var pnt = this.getCenter();
  //*********************
  context.beginPath();
  context.lineWeight = 2;
  context.fillStyle = this.getColor();
  context.rect(this.x, this.y, this.width, this.width);
  context.closePath();
  context.fill();
  context.stroke();
};

Node.prototype.getCenter = function() {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.width / 2
  };
};

Node.prototype.drawFromCamera = function(context, camera) {
  //camera is in 3d space, so we will consider z off screen plane

  //[x,y,z]
  //var shadowOffsets = this.calculateOffsetsFromCamera(camera);

  var pnt = this.getCenter();

  context.beginPath();

  context.fillStyle = this.getColor();
  context.shadowColor = this.getShadowColor();
  context.rect(this.x, this.y, this.width, this.width);
  //context.rect(pnt.x, pnt.y, 1, 1);
  context.closePath();
  //context.shadowOffsetX = shadowOffsets[0];
  //context.shadowOffsetY = shadowOffsets[1];
  context.shadowBlur = 10;
  context.fill();

  context.stroke();

  context.closePath();
};

Node.prototype.calculateOffsetsFromCamera = function(point) {
  var center = this.getCenter();
  var vecFromCamera = [
    center.x - point[0],
    center.y - point[1]
  ];

  this.state = this.getDistance({
    x: point[0],
    y: point[1]
  }) < this.width / 2 ? 1 : 0;

  var angle = Math.atan2(vecFromCamera[1], vecFromCamera[0]);

  return [
    this.width / this.scaler * Math.cos(angle),
    this.width / this.scaler * Math.sin(angle)
  ];
};

Node.prototype.setStateFromMouse = function(highlighted) {
  // if (this.getDistance({
  //     x: highlighted.x,
  //     y: highlighted.y
  //   }) < this.width)
  //   this.state = highlighted.mouseDown;
};

Node.prototype.getIndex = function() {
  return this.index;
};

Node.prototype.getDistance = function(target) {
  var center = this.getCenter();
  return Math.sqrt(
    Math.pow(center.x - target.x, 2) +
    Math.pow(center.y - target.y, 2));
};
