let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
let fs = require("fs");
const Grass = require('./grass');
const GrassEater = require('./grassEater');
const Preadator = require('./preadator');
const Venom = require('./venom');
const Antivenom = require('./antivenom');


app.use(express.static("../client"));

app.get('/', function (req, res) {
        res.redirect('index.html');
});
server.listen(3000, () => {
        console.log('connected');
});

function matrixGenerator(matrixSize, grassCount, grassEaterCount, preadatorCount, venomCount, antivenomCount) {
        let matrix = [];
        for (let i = 0; i < matrixSize; i++) {
                matrix.push([]);
                for (let j = 0; j < matrixSize; j++) {
                        matrix[i].push(0);
                }
        }
        //grass
        for (let i = 0; i < grassCount; i++) {
                let x = Math.floor(Math.random() * matrixSize);
                let y = Math.floor(Math.random() * matrixSize);
                matrix[y][x] = 1
        }

        //grasEater
        for (let i = 0; i < grassEaterCount; i++) {
                let x = Math.floor(Math.random() * matrixSize);
                let y = Math.floor(Math.random() * matrixSize);
                matrix[y][x] = 2
        }

        //preadator
        for (let i = 0; i < preadatorCount; i++) {
                let x = Math.floor(Math.random() * matrixSize)
                let y = Math.floor(Math.random() * matrixSize)
                matrix[y][x] = 3
        }

        //venom
        for (let i = 0; i < venomCount; i++) {
                let x = Math.floor(Math.random() * matrixSize)
                let y = Math.floor(Math.random() * matrixSize)
                matrix[y][x] = 4
        }

        for (let i = 0; i < antivenomCount; i++) {
                let x = Math.floor(Math.random() * matrixSize)
                let y = Math.floor(Math.random() * matrixSize)
                matrix[y][x] = 5
        }

        return matrix;
}

matrix = matrixGenerator(25, 70, 4, 2, 2, 8);

io.sockets.emit('send matrix', matrix)

// Grass = require("./grass");
// GrassEater = require("./grassEater");
// Preadator = require("./preadator");
// Venom = require("./venom");
// Antivenom = require("./antivenom");

grassArray = [];
grassEaterArr = [];
preadatorArr = [];
venomArr = [];
antivenomArr = [];

function createObject(matrix) {
        for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[0].length; x++) {
                        //Grass
                        if (matrix[y][x] == 1) {
                                let gr = new Grass(x, y);
                                grassArray.push(gr);
                        }
                        //GrassEate
                        else if (matrix[y][x] == 2) {
                                let gre = new GrassEater(x, y);
                                grassEaterArr.push(gre);
                        }
                        //Preadaor
                        else if (matrix[y][x] == 3) {
                                let pred = new Preadator(x, y);
                                preadatorArr.push(pred);
                        }
                        //Venom
                        else if (matrix[y][x] == 4) {
                                let ven = new Venom(x, y);
                                venomArr.push(ven);
                        }
                        //Antivenom
                        else if (matrix[y][x] == 5) {
                                let anv = new Antivenom(x, y);
                                antivenomArr.push(anv);
                        }
                }
        }

        io.sockets.emit('send matrix', matrix);

}


function game() {
        for (var i in grassArray) {
                grassArray[i].mul()
        }
        for (var i in grassEaterArr) {
                grassEaterArr[i].eat();
        }
        for (var i in preadatorArr) {
                preadatorArr[i].eat()
        }
        for (var i in venomArr) {
                venomArr[i].eat();
        }
        for (var i in antivenomArr) {
                antivenomArr[i].eat();
        }
        io.sockets.emit("send matrix", matrix);
}

setInterval(game, 1000)

io.on('connection', function (socket) {
        createObject(matrix)

        socket.on('Summer',() =>{
                console.log('Summer========>>>>>>>');
        });
        socket.on('Winter',() => {
                console.log('Winter========>>>>>>>');
        });
        socket.on('Spring',() => {
                console.log('Spring========>>>>>>>');
        });
        socket.on('Autumn',() => {
                console.log('Autumn========>>>>>>>');
        });
})



let statistics = {
        grassCount: 0,
        grassEaterCount: 0,
        preadatorCount: 0,
        venom: 0,
        antivenom: 0
}

setInterval(function () {
        statistics.grassCount = grassArray.length;
        statistics.grassEaterCount = grassEaterArr.length;
        statistics.preadatorCount = preadatorArr.length;
        statistics.venomCount = venomArr.length;
        statistics.antivenomCount = antivenomArr.length;

        fs.writeFile("./statistics.json", JSON.stringify(statistics), function () {
                console.log('write');
        })
}, 1000)
