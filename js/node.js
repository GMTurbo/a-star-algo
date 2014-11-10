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
    this.width = options.width,
    this.opacity = 0;
};

Node.prototype.getColor = function() {
  switch (this.i % 2) {
    case 0:
      return 'rgba(255,0,0,' + this.opacity + ')';
    case 1:
      return 'rgba(171,241,55,' + this.opacity + ')';
    default:
      return 'rgba(254,255,189,' + this.opacity + ')';
  }

  return 'rgba(171,241,55,' + this.opacity + ')';
};

Node.prototype.getShadowColor = function() {
  switch (this.i % 2) {
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

  var pnt = [this.x, this.y];

  context.beginPath();

  context.fillStyle = this.getColor();
  context.shadowColor = this.getShadowColor();
  context.arc(pnt[0] - this.width, pnt[1] - this.width, this.width, 0, 2 * Math.PI, false);

  context.closePath();
  context.shadowOffsetX = (this.i % 2 == 0 ? 0 : 10);
  context.shadowOffsetY = (this.i % 2 == 0 ? 10 : 0);
  context.shadowBlur = 10;
  context.fill();

  context.stroke();

  context.closePath();

};
