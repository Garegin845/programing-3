let LivingCreature = require('./livingCreature')
//tst
module.exports = class Antivenom extends LivingCreature{
    constructor(x,y){
    super(x, y);
        this.energy = 50;
        this.direction = []
    }
//..
    getNewCoordinates() {
        this.directions = [
			[this.x - 1, this.y - 1],
			[this.x, this.y - 1],
			[this.x + 1, this.y - 1],
			[this.x - 1, this.y],
			[this.x + 1, this.y],
			[this.x - 1, this.y + 1],
			[this.x, this.y + 1],
			[this.x + 1, this.y + 1]
		];
    }

    chooseCell(char4) {
        this.getNewCoordinates();
        return super.chooseCell(char4);
    }

    mul() {
        let emptyCell = this.chooseCell(0)
        let newCell = emptyCell[Math.floor(Math.random() * emptyCell.length)]

        if (newCell ) {
            let newX = newCell[0]
            let newY = newCell[1]

            matrix[newY][newX] = 5

            let anv = new Antivenom(newX, newY)

            antivenomArr.push(anv)
        }
    }

    eat() {
        let foods = this.chooseCell(4)
        let food = foods[Math.floor(Math.random() * foods.length)]
        if (food) {
            this.energy++;

            matrix[this.y][this.x] = 0
            let newX = food[0]
            let newY = food[1]
            matrix[newY][newX] = 5
            this.x = newX
            this.y = newY

            for (var i in venomArr) {
                if (newX == venomArr[i].x && newY == venomArr[i].y) {
                    venomArr.splice(i, 1);
                    break;
                }
            }

        }
        else {
            this.move()
        }
    }

    move() {
        this.energy--
        let emptyCell = this.chooseCell(0)
        let newCell = emptyCell[Math.floor(Math.random() * emptyCell.length)]
        if (newCell) {
            let newX = newCell[0]
            let newY = newCell[1]
            matrix[this.y][this.x] = 0
            matrix[newY][newX] = 5
            this.x = newX
            this.y = newY
        }

        if (this.energy <= 0) {
            this.die()
        }
    }

    die() {
        matrix[this.y][this.x] = 0;
        for (var i in antivenomArr) {
            if (this.x == antivenomArr[i].x && this.y == antivenomArr[i].y) {
                antivenomArr.splice(i, 1);
                break;
            }
        }
    }
}