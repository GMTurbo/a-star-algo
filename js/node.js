var Node = function(options) {
  options = _.defaults(options, {
    x: 0.1,
    y: 100,
    h: 0,
    g: 0,
    width: 1
  });
  // hueristic (h), movement cost (g), f-val (g+h), parent (a node to reach this node)
  this.x = options.x,
    this.y = options.y,
    this.H = options.h,
    this.G = options.g,
    this.F = this.H + this.G,
    this.parent = null,
    this.open = 1,
    this.width = options.width,
    this.opacity = 128;
};

Node.prototype.getColor = function() {
  // switch (TYPE) {
  //   case 'captured':
  //     return 'rgba(255,0,0,' + opacity + ')';
  //   case 'cop':
  //     return 'rgba(171,241,55,' + opacity + ')';
  //   case 'robber':
  //     return 'rgba(254,255,189,' + opacity + ')';
  // }

  return 'rgba(171,241,55,' + this.opacity + ')';
};

Node.prototype.getShadowColor = function() {
  // switch (TYPE) {
  //   case 'captured':
  //     return 'rgba(0,0,0,1)';
  //   case 'cop':
  //     return 'rgba(0,0,0,1)';
  //   case 'robber':
  //     return 'rgba(0,0,0,1)';
  // }
  return 'rgba(0,0,0,1)';
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
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  context.shadowBlur = 10;
  context.fill();

  context.stroke();

  context.closePath();

};
