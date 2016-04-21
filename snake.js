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
     *
     * @type {number}
     */
    this.score = 0;
    this.deaths = -1;
    this.MAP_W = 49;
    this.MAP_H = 49;
    this.SNAKE_LEN = 8;

    this.addScore = function () {
        this.score++;
        return this.length = this.body.unshift([-1, -1]);
    };

    this.reset = function () {
        var rH = Math.floor(Math.random() * 49);
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

    this.step = function () {
        var len = this.length - 2;
        for (var i = 0; 0 <= len ? i <= len : i >= len; 0 <= len ? i++ : i--) {
            this.moveTail(i);
        }
        return this.moveHead();
    };

    this.moveTail = function (i) {
        this.body[i][0] = this.body[i + 1][0];
        return this.body[i][1] = this.body[i + 1][1];
    };

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

    this.head = function () {
        return this.body[this.length - 1];
    };

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

    this.blocksFood = function (food) {
        var head = this.head();
        return head[0] === food[0] && head[1] === food[1];
    };

    this.reset();
};

module.exports = Snake;