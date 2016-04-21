if (window["WebSocket"]) {
    $(document).ready(function () {

        var canvas = $("#map");
        var context = canvas.get(0).getContext("2d");
        var id = null;

        var socket = io.connect(document.location.href);
        var direction;
        var food;
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

        function animate(data) {

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

        function connect() {
            socket.on('id', function (resId) {
                id = resId;
            });

            socket.on('snakes', function (snakes) {
                animate(snakes);
            });
        }

        connect();

        return $(document).keydown(function (event) {
            var key;
            key = event.keyCode ? event.keyCode : event.which;
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