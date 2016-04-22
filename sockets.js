/**
 * Control de la comunicación cliente-servidor vía websockets
 * @type {Snake} Modelo de objeto snake
 */

var Snake = require('./snake');
var mongo = require('./mongo');

var snakes = [];
var food;

module.exports = function (io) {

    /**
     * Controla la conexión de un jugador. Le asigna una id y configura los sockets que se comunican con el cliente.
     */
    io.on('connection', function (socket) {
        var id;
        var snake;
        var ten = mongo.topTenPlayers();

        /**
         * Cuando reciba la id de un nuevo jugador, la inserta en la base de datos.
         */
        socket.on('id', function (newId) {
            var defId = "player"+randomNumber(100);
            id = newId != null || newId != "" ? newId : defId;
            mongo.insertPlayer(id);
            snake = new Snake(id);
            snakes.push(snake);
            console.log('connexio: ' + id);
        });
        console.log(ten);
        socket.emit('top', ten);
        /**
         * Cambia la dirección de la serpiente.
         */
        socket.on('move', function (direction) {
            snake.direction = direction;
        });

        /**
         * Si el usuario se desconecta, guarda su puntuación en la base de datos.
         */
        socket.on('disconnect', function () {
            if(id !== undefined) {
                snakes.remove(snake);
                mongo.updatePlayerScore(snake);
                console.log('desconnexio: ' + id);
            }
        });
    });

    /***** FUNCIONES DE LAS SERPIENTES *****/

    /**
     * Actualiza el estado de las serpientes y envía al cliente los datos necesarios para dibujarlas en el canvas.
     * @returns {Socket}
     */
    function updateState() {
        var snake;
        var len = snakes.length;
        for (var i = 0; i < len; i++) {
            snake = snakes[i];
            snake.step();
        }
        checkCollisions();
        return io.emit('snakes', {snakes: snakes, food: food});
    }

    /**
     * Comprueba si cada una de las serpientes está colisionando con algo. Pueden colisionar con:
     * - Comida. En este caso, la comida se recoloca y la serpiente que colisionó crecerá una unidad
     * - Otra serpiente. La serpiente cuya cabeza esté cruzándose con otra será reiniciada.
     * - Su propio cuerpo. La serpiente es reiniciada.
     * @returns {Array} Conjunto de datos actualizados tras las colisiones.
     */
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
                        other.addScore();
                    }
                }
            }
            if (snake.blocksFood(food)) {
                snake.addScore();
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

    /**
     * Devuelve un array de 2 posiciones. La primera es la x, la segunda es la y, de este modo se simula una posición
     * en el eje de coordenadas que forma el mapa.
     * @returns {*[]}
     */
    function generateFood() {
        return [randomNumber(49), randomNumber(49)];
    }

    /**
     * Asigna unas nuevas coordenadas a la variable que guarda la posición de la comida.
     */
    function newFood() {
        food = generateFood();
    }

    /**
     * Devuelve un número aleatorio (máximo: tamaño del mapa)
     * @returns {number} Número aleatorio.
     */
    function randomNumber(max) {
        return Math.floor((Math.random() * max) + 1);
    }

    /**
     * Override de remove;
     * @param e Elemento que será eliminado.
     */
    Array.prototype.remove = function (e) {
        var t, r;
        if ((t = this.indexOf(e)) > -1) {
            return ([].splice.apply(this, [t, t - t + 1].concat(r = [])), r);
        }
    };

    newFood();
    var interval = setInterval(updateState, 100);
};