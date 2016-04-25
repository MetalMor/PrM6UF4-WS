if (window["WebSocket"]) {
    $(document).ready(function () {

        var id = prompt("Introdueix el teu nom d'usuari: ");
        var canvas = $("#map");
        var context = canvas.get(0).getContext("2d");

        var socket = io.connect(document.location.href);

        var direction;
        var food;
        var top = [];
        var MAP_H;
        var MAP_W;

        if (socket != null) {
            console.log('connectat');
        }

        function sendDirection(direction) {
            if (socket) {
                socket.emit('move', direction);
            }
        }

        function drawFood(food) {
            context.fillStyle = 'rgb(0,255,0)';
            for (var x = 0; x <= 49; x++) {
                for (var y = 0; y <= 49; y++) {
                    if (x === food[0] && y === food[1])
                        context.fillRect(x * 10, y * 10, 9, 9);
                }
            }
        }

        function drawMap(data) {

            var snakes = data.snakes;
            food = data.food;

            var bodyElement;
            context.fillStyle = 'rgb(230,230,230)';

            for (var x = 0; x <= 49; x++) {
                for (var y = 0; y <= 49; y++) {
                    context.fillRect(x * 10, y * 10, 9, 9);
                }
            }

            var ret = [];
            var len = snakes.length;
            var snake;
            for (var i = 0; i < len; i++) {
                snake = snakes[i];
                context.fillStyle = snake.id === id ? 'rgb(170,0,0)' : 'rgb(0,0,0)';
                if (snake.id === id) {
                    $("#score").html("Punts: " + snake.score);
                    $("#deaths").html("Morts: " + snake.deaths);
                }
                ret.push((function () {
                    var ref = snake.body;
                    var res = [];
                    var len2 = ref.length;
                    for (var j = 0; j < len2; j++) {
                        bodyElement = ref[j];
                        x = bodyElement[0] * 10;
                        y = bodyElement[1] * 10;
                        res.push(context.fillRect(x, y, 9, 9));
                    }
                    return res;
                })());
            }
            drawFood(food);
            return ret;
        }

        function topEntry(curTop) {
            return "<li>" + curTop.name + " - " + curTop.score + " - " + curTop.deaths + "</li>";
        }

        function connect() {
            socket.emit('id', id);
            socket.on('top', function(ten) {
                var element = $("ol#top");
                console.log("server top: " + ten);
                if(!top.compare(ten)) {
                    element.empty();
                    for(var counter = 0; counter < 10; counter++)
                        element.append(topEntry(ten[counter]));
                }
            });
            socket.on('snakes', function(data) {
                drawMap(data);
            });
        }

        connect();

        return $(document).keydown(function(event) {
            var key = event.keyCode ? event.keyCode : event.which;
            switch (key) {
                case 65:
                    direction = direction != 'r' ? 'l' : direction;
                    break;
                case 87:
                    direction = direction != 'd' ? 'u' : direction;
                    break;
                case 68:
                    direction = direction != 'l' ? 'r' : direction;
                    break;
                case 83:
                    direction = direction != 'u' ? 'd' : direction;
                    break;
                default:
                    break;
            }
            console.log(direction);
            return sendDirection(direction);
        });
    });

} else {
    alert('NO SUPORTA WEBSOCKETS!');
}

Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i = 0; i < testArr.length; i++) {
        if (this[i].compare) {
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
};