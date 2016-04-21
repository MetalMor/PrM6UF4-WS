/**
 * Created by mor on 21/04/16.
 */


var utils = {

    /**
     * Comprueba si cada una de las serpientes está colisionando con algo. Pueden colisionar con:
     * - Comida. En este caso, la comida se recoloca y la serpiente que colisionó crecerá una unidad
     * - Otra serpiente. La serpiente cuya cabeza esté cruzándose con otra será reiniciada.
     * - Su propio cuerpo. La serpiente es reiniciada.
     * @returns {Array} Conjunto de datos actualizados tras las colisiones.
     */
    checkCollisions: function (data) {
        var snake;
        var snakes = data.snakes;
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
            if (snake.blocksFood(data.food)) {
                snake.addScore();
                utils.newFood();
            }
        }
        var ret = [];
        var len3 = snakeReset.length;
        for (var k = 0; k < len3; k++) {
            snake = snakeReset[k];
            ret.push(snake.reset());
        }
        return ret;
    },
    /**
     * Actualiza el estado de las serpientes y envía al cliente los datos necesarios para dibujarlas en el canvas.
     * @returns {Socket}
     */
    updateState: function (data, io) {
        var snake;
        var snakes = data.snakes;
        var len = snakes.length;
        for (var i = 0; i < len; i++) {
            snake = data[i];
            snake.step();
        }
        this.checkCollisions(data);
        return io.emit('snakes', {snakes: snakes, food: data.food});
    },

    /**
     * Devuelve un array de 2 posiciones. La primera es la x, la segunda es la y, de este modo se simula una posición
     * en el eje de coordenadas que forma el mapa.
     * @returns {*[]}
     */
    generateFood: function () {
        var random = this.randomNumber;
        return [random(), random()];
    },

    /**
     * Devuelve un número aleatorio (máximo: tamaño del mapa)
     * @returns {number} Número aleatorio.
     */
    randomNumber: function () {
        return Math.floor((Math.random() * 48) + 1);
    }
};

module.exports = utils;