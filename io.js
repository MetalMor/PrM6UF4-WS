var Snake = require('./snake2');
var nextId = 1;
var snakes = [];
var food;

module.exports = function(io) {
  io.on('connection', function(client) {
    var id = nextId;
    var snake = new Snake(id);

    nextId += 1;
    snakes.push(snake);
    
    console.log('connexio: ' + id);
    
    client.emit('id', id);
    
    client.on('move', function(direction) {
      snake.direction = direction;
    });
    
    client.on('disconnect', function() {
      snakes.remove(snake);
      console.log('desconnexio: ' + id);
    });
  });
  
  function updateState() {
    var snake;
    var len = snakes.length
    for (var i = 0; i < len; i++) {
      snake = snakes[i];
      snake.doStep();
    }
    checkCollisions();
    return io.emit('snakes', snakes);
  }
  
  function checkCollisions() {
    var snake;
    var len = snakes.length;
    var snakeReset = [];
    var other;
    for (var i = 0; i < len; i++) {
      snake = snakes[i];
      if (snake.blocksSelf()) {
        snakeReset.push(snake);
      }
      for (var j = 0; j < len; j++) {
        other = snakes[j];
        if (other !== snake) {
          if (other.blocks(snake)) {
            snakeReset.push(snake);
            other.addKill();
          }
        }
      }
      if(snake.blocksFood(food)) {
        snake.addKill();
        newFood();
      }
    }
    var ret = [];
    var len3 = snakeReset.length;
    for (var k = 0; k < len3; k++) {
      snake = snakeReset[k];
      ret.push(snake.reset());
    }
    return ret;
  }
    
  function generateFood() {
    return {
      x:Math.floor((Math.random() * 48) + 1),
      y:Math.floor((Math.random() * 48) + 1)
    };
  }

  function newFood() {
    food = generateFood();
  }
  
  Array.prototype.remove = function(e) {
    var t, r;
    if ((t = this.indexOf(e)) > -1) {
      return ([].splice.apply(this, [t, t - t + 1].concat(r = [])), r);
    }
  };

  food = generateFood();
  var interval = setInterval(updateState, 100);
};