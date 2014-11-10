var Node = function(options) {
  options = _.defaults(options, {
    x: 0.1,
    y: 100,
    h: 0,
    g: 0,
    width: 1,
    i: 0
  });
  // hueristic (h), movement cost (g), f-val (g+h), parent (a node to reach this node)
  this.i = options.i,
    this.x = options.x,
    this.y = options.y,
    this.H = options.h,
    this.G = options.g,
    this.F = this.H + this.G,
    this.parent = null,
    this.open = 1,
    this.scaler = 5,
    this.state = 0,
    this.width = options.width,
    this.opacity = 0,
    this.clock = 0;
};

Node.prototype.getColor = function() {
  switch (this.state) {
    case 0:
      return 'rgba(255,0,0,' + this.opacity + ')';
    case 1:
      return 'rgba(171,241,55,' + 200 + ')';
    default:
      return 'rgba(254,255,189,' + this.opacity + ')';
  }

  return 'rgba(171,241,55,' + this.opacity + ')';
};

Node.prototype.getShadowColor = function() {
  switch (this.state) {
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

  if (this.clock > 10) {
    this.clock = 0;
  }

  var pnt = [this.x, this.y];

  context.beginPath();

  context.fillStyle = this.getColor();
  context.shadowColor = this.getShadowColor();
  context.arc(pnt[0] - this.width, pnt[1] - this.width, this.width, 0, 2 * Math.PI, false);

  context.closePath();
  //  context.shadowOffsetX = (this.clock % 4 == 0 ? -10 : 10);
  //context.shadowOffsetY = (this.clock % 4 == 0 ? -10 : 10);
  //context.shadowBlur = 10;
  context.fill();

  context.stroke();

  context.closePath();

  this.clock++;

};

Node.prototype.getCenter = function() {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.width / 2
  }
};

Node.prototype.drawFromCamera = function(context, camera) {
  //camera is in 3d space, so we will consider z off screen plane

  //[x,y,z]
  var shadowOffsets = this.calculateOffsetsFromCamera(camera);

  var pnt = this.getCenter();

  context.beginPath();

  context.fillStyle = this.getColor();
  context.shadowColor = this.getShadowColor();
  context.rect(this.x, this.y, this.width, this.width);
  context.rect(pnt.x, pnt.y, 1, 1);
  context.closePath();
  context.shadowOffsetX = shadowOffsets[0];
  context.shadowOffsetY = shadowOffsets[1];
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
    }) < this.width/2 ? 1 : 0;

  var angle = Math.atan2(vecFromCamera[1], vecFromCamera[0]);
  return [this.width / this.scaler * Math.cos(angle), this.width / this.scaler * Math.sin(angle)];
};

Node.prototype.setStateFromMouse = function(highlighted) {
  // if (this.getDistance({
//     x: highlighted.x,
//     y: highlighted.y
//   }) < this.width)
//   this.state = highlighted.mouseDown;
}

Node.prototype.getDistance = function(target) {
  var center = this.getCenter();
  return Math.sqrt(
    Math.pow(center.x - target.x, 2) +
    Math.pow(center.y - target.y, 2));
}
