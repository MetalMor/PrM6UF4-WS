/**
 * Created by mor on 25/04/16.
 */
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
        this.score++; // suma el contador de puntos
        return this.length = this.body.unshift([-1, -1]); // añade un cuadradito a la serpiente
    };

    /**
     * Reinicia la longitud de la serpiente (pero no la puntuación)
     * @returns {*}
     */
    this.reset = function () {
        var rH = Math.floor(Math.random() * this.MAP_W); // posicion aleatoria en el mapa
        this.deaths++; // suma el contador de muertes
        this.length = this.SNAKE_LEN; // reinicia la longitud de la serpiente
        this.direction = "r"; // reinicia la direccion de la serpiente
        var len = this.length;
        // reinicia el estado de la serpiente
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
     * Retorna el elemento que representa la cabeza de la serpiente
     * @returns {*}
     */
    this.head = function () {
        return this.body[this.length - 1];
    };
    /**
     * Avanza la cabeza de la serpiente.
     * @returns {number}
     */
    this.moveHead = function () {
        var head = this.length - 1;
        // comprueba la direccion de la serpiente
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
        // comprueba el final del mapa
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
     * Comprueba si dos coordenadas son iguales.
     * @param one
     * @param other
     * @returns {boolean}
     */
    this.samePos = function(one, other) {
        return one[0] === other[0] && one[1] === other[1];
    };
    /**
     * Comprueba si la serpiente está colisionando con otra.
     * @param other
     * @returns {boolean}
     */
    this.blocks = function (other) {
        var element;
        var head = other.head();
        var ref = this.body;
        var len = ref.length;
        for (var i = 0; i < len; i++) {
            element = ref[i];
            if (this.samePos(head, element)) return true;
        }
        return false;
    };

    /**
     * Comprueba si la serpiente está colisionando consigo misma.
     * @returns {boolean}
     */
    this.blocksSelf = function () {
        var head = this.head();
        var ref = this.length - 2;
        for (var i = 0; ref >= 0 ? i <= ref : i >= ref; 0 <= ref ? i++ : i--)
            if (this.samePos(head, this.body[i])) return true;
        return false;
    };

    /**
     * Comprueba si la cabeza de la serpiente ha encontrado un cuadradito de comida.
     * @param food Array con la posición [x, y] del cuadradito de comida.
     * @returns {boolean}
     */
    this.blocksFood = function (food) {
        // comprueba si se come un cuadradito
        var head = this.head();
        if (head[0] === food[0] && head[1] === food[1]) return true;
        // comprueba si un cuadradito está en el mismo sitio que el cuerpo de la serpiente
        var ref = this.body;
        var len = ref.length;
        var element;
        for(var i = 0; i<len; i++) {
            element = ref[i];
            if (this.samePos(element, food)) return true;
        }
        return false;
    };

    this.reset();
};

module.exports = Snake;