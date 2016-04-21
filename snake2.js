var Snake = function(id){
    this.id = id;
    this.kills = 0;
    this.deaths = 0;
    this.MAP_W = 49;
    this.MAP_H = 49;
    this.SNAKE_LEN = 8;

  this.addKill = function() {
    this.kills++;
    return this.length = this.elements.unshift([-1,-1]);
  };

  this.reset = function() {
    var i;
    var rH = Math.floor(Math.random() * 49);
    this.deaths++;
    this.length = this.SNAKE_LEN;
    this.direction = "r";
    var len = this.length;
    return this.elements = (function() {
      var ref =  len;
      var ret = [];
      for (var i = ref; ref <= 1 ? i <= 1 : i >= 1; ref <= 1 ? i++ : i--) {
        ret.push([-i, rH]);
      }
      return ret;
    }).call(this);
  };

  this.doStep = function() {
    var len = this.length - 2;
    for (var i = 0; 0 <= len ? i <= len : i >= len; 0 <= len ? i++ : i--) {
      this.moveTail(i);
    }
    return this.moveHead();
  };

  this.moveTail = function(i) {
    this.elements[i][0] = this.elements[i + 1][0];
    return this.elements[i][1] = this.elements[i + 1][1];
  };

  this.moveHead = function() {
    var head = this.length - 1;
    switch (this.direction) {
      case "l":
        this.elements[head][0] -= 1;
        break;
      case "r":
        this.elements[head][0] += 1;
        break;
      case "u":
        this.elements[head][1] -= 1;
        break;
      case "d":
        this.elements[head][1] += 1;
    }
    if (this.elements[head][0] < 0) {
      this.elements[head][0] = this.MAP_W;
    }
    if (this.elements[head][1] < 0) {
      this.elements[head][1] = this.MAP_H;
    }
    if (this.elements[head][0] > this.MAP_W) {
      this.elements[head][0] = 0;
    }
    if (this.elements[head][1] > this.MAP_H) {
      return this.elements[head][1] = 0;
    }
  };

  this.head = function() {
    return this.elements[this.length - 1];
  };

  this.blocks = function(other) {
    var element;
    var head = other.head();
    var collision = false;
    var ref = this.elements;
    var len = ref.length;
    for (var i = 0; i < len; i++) {
      element = ref[i];
      if (head[0] === element[0] && head[1] === element[1]) {
        collision = true;
      }
    }
    return collision;
  };

  this.blocksSelf = function() {
    var head = this.head();
    var collision = false;
    var ref = this.length - 2;
    for (var i = 0; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--) {
      if (head[0] === this.elements[i][0] && head[1] === this.elements[i][1]) {
        collision = true;
      }
    }
    return collision;
  };

  this.blocksFood = function(food) {
    // TODO comprueba si está chocando con un cuadrado de comida
  };

  this.getLength = function() {
    return this.length
  };

  this.addLength = function(i) {
    this.length += i;
  };

    this.reset();
};

module.exports = Snake;