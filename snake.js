/**
 * Modelo para representar la serpiente de un jugador.
 *
 * @param id Identificador único para un usuario.
 */
var Snake = function (id) {
    /**
     * Identificador único.
     */
    this.id = id;
    /**
     * Puntuación (cuadraditos que te has comido)
     * @type {number}
     */
    this.score = 0;
    /**
     * Veces que has muerto
     * @type {number}
     */
    this.deaths = -1;
    /**
     * Anchura del mapa
     * @type {number}
     */
    this.MAP_W = 49;
    /**
     * Altura del mapa
     * @type {number}
     */
    this.MAP_H = 49;
    /**
     * Longitud inicial de la serpiente
     * @type {number}
     */
    this.SNAKE_LEN = 8;

    /**
     * Añade un cuadradito a la serpiente e incrementa su puntuación
     * @returns {Number}
     */
    this.addScore = function() {
        this.score++;
        return this.length = this.body.unshift([-1, -1]);
    };

    /**
     * Reinicia la longitud de la serpiente (pero no la puntuación)
     * @returns {*}
     */
    this.reset = function () {
        var rH = Math.floor(Math.random() * this.MAP_W);
        this.deaths++;
        this.length = this.SNAKE_LEN;
        this.direction = "r";
        var len = this.length;
        return this.body = (function () {
            var ref = len;
            var ret = [];
            for (var i = ref; ref <= 1 ? i <= 1 : i >= 1; ref <= 1 ? i++ : i--) {
                ret.push([-i, rH]);
            }
            return ret;
        }).call(this);
    };

    /**
     * Avanza todas las serpientes en una posición.
     */
    this.step = function () {
        var len = this.length - 2;
        for (var i = 0; 0 <= len ? i <= len : i >= len; 0 <= len ? i++ : i--) {
            this.moveTail(i);
        }
        return this.moveHead();
    };

    /**
     * Avanza la cola de la serpiente.
     * @param i nueva posicion del final de la cola
     * @returns {*}
     */
    this.moveTail = function (i) {
        this.body[i][0] = this.body[i + 1][0];
        return this.body[i][1] = this.body[i + 1][1];
    };

    /**
     * Avanza la cabeza de la serpiente.
     * @returns {number}
     */
    this.moveHead = function () {
        var head = this.length - 1;
        switch (this.direction) {
            case "l":
                this.body[head][0] -= 1;
                break;
            case "r":
                this.body[head][0] += 1;
                break;
            case "u":
                this.body[head][1] -= 1;
                break;
            case "d":
                this.body[head][1] += 1;
        }
        if (this.body[head][0] < 0) {
            this.body[head][0] = this.MAP_W;
        }
        if (this.body[head][1] < 0) {
            this.body[head][1] = this.MAP_H;
        }
        if (this.body[head][0] > this.MAP_W) {
            this.body[head][0] = 0;
        }
        if (this.body[head][1] > this.MAP_H) {
            return this.body[head][1] = 0;
        }
    };

    /**
     * Retorna el elemento que representa la cabeza de la serpiente
     * @returns {*}
     */
    this.head = function () {
        return this.body[this.length - 1];
    };

    /**
     * Comprueba si la serpiente está colisionando con otra.
     * @param other
     * @returns {boolean}
     */
    this.blocks = function (other) {
        var element;
        var head = other.head();
        var collision = false;
        var ref = this.body;
        var len = ref.length;
        for (var i = 0; i < len; i++) {
            element = ref[i];
            if (head[0] === element[0] && head[1] === element[1]) {
                collision = true;
            }
        }
        return collision;
    };

    /**
     * Comprueba si la serpiente está colisionando consigo misma.
     * @returns {boolean}
     */
    this.blocksSelf = function () {
        var head = this.head();
        var collision = false;
        var ref = this.length - 2;
        for (var i = 0; 0 <= ref ? i <= ref : i >= ref; 0 <= ref ? i++ : i--) {
            if (head[0] === this.body[i][0] && head[1] === this.body[i][1]) {
                collision = true;
            }
        }
        return collision;
    };

    /**
     * Comprueba si la cabeza de la serpiente ha encontrado un cuadradito de comida.
     * @param food Array con la posición [x, y] del cuadradito de comida.
     * @returns {boolean}
     */
    this.blocksFood = function (food) {
        var head = this.head();
        return head[0] === food[0] && head[1] === food[1];
    };

    this.reset();
};

module.exports = Snake;