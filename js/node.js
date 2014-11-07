
var Node = function(options){
  options = _.defaults(options, {
    x: 0.1,
    y: 100,
    h: 0,
    g: 0
  });
  // hueristic (h), movement cost (g), f-val (g+h), parent (a node to reach this node)
  this.x = options.x,
  this.y = options.y,
  this.H = options.h,
  this.G = options.g,
  this.F = this.H + this.G,
  this.parent = null;
};

Node.prototype.setMovementCost = function(g){
  this.G = g;
  this.F = this.H + this.G;
};

Node.prototype.setHueristic = function(h){
  this.H = h;
  this.F = this.H + this.G;
};

Node.prototype.setParent = function(parent){
  this.parent = parent;
};
