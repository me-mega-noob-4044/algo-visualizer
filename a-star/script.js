var grid = [];
var startNode;
var endNode;

class Node {
    constructor(x, y) {
        this.wall = false;
        this.walked = false;
        this.x = x;
        this.y = y;

        this.previous;

        this.fScore = Infinity;
        this.hScore = Infinity;
        this.gScore = Infinity;

        this.gridItem = document.createElement("div");
        this.gridItem.classList.add("grid-item");

        this.gridItem.onclick = (event) => {
            if (event.button == 0) {
                if (keys[16]) {
                    if (startNode) {
                        startNode.start = false;
                        startNode.gridItem.classList.remove("start");
                    }

                    startNode = this;
                    this.start = true;
                    this.gridItem.classList.add("start");
                } else if (keys[9]) {
                    if (endNode) {
                        endNode.gridItem.classList.remove("end");
                    }

                    endNode = this;
                    this.gridItem.classList.add("end");
                } else if (keys[32]) {
                    this.wall = !this.wall;

                    if (this.wall) {
                        this.gridItem.classList.add("wall");
                    } else {
                        this.gridItem.classList.remove("wall");
                    }
                }
            }
        };

        document.getElementById("grid").appendChild(this.gridItem);
    }
}

const Sqrt2 = Math.sqrt(2);

function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

var Pathfinder = new class {
    constructor() {
        this.openSet = [];
        this.intervel = null;
        this.pathMap = new Map();
    }

    getNeighbors(bestNode) {
        let neighbors = grid.filter(e => !e.wall && !e.walked && distance(e, bestNode) <= Sqrt2);

        return neighbors;
    }

    tracePath(node) {
        let path = [];
        let current = node;

        while (current) {
            path.push(current);
            current.gridItem.classList.add("path");
            current = current.previous;
        }

        path.reverse();
    }

    find() {
        if (this.openSet.length > 0) {
            let bestNode = this.openSet.sort((a, b) => a.fScore - b.fScore)[0];

            bestNode.walked = true;
            bestNode.gridItem.classList.add("walked");

            let neighbors = this.getNeighbors(bestNode);

            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];

                neighbor.gScore = distance(bestNode, neighbor) + bestNode.gScore;
                neighbor.hScore = distance(endNode, neighbor);
                neighbor.fScore = neighbor.gScore + neighbor.hScore;
                neighbor.gridItem.classList.add("explored");

                if (neighbor.gScore < (this.pathMap.get(neighbor) || Infinity)) {
                    neighbor.previous = bestNode;
                    this.pathMap.set(neighbor, neighbor.gScore);
                    neighbor.gridItem.classList.add("explored");
                    
                    if (neighbor === endNode) {
                        this.tracePath(neighbor);
                        this.openSet = [];
                        return;
                    }

                    if (!this.openSet.includes(neighbor)) {
                        this.openSet.push(neighbor);
                    }
                }
            }

            let indx = this.openSet.findIndex(e => e == bestNode);

            this.openSet.splice(indx, 1);
        } else {
            clearInterval(this.intervel);
        }
    }

    start() {
        startNode.gScore = 0;
        startNode.hScore = distance(endNode, startNode);
        startNode.fScore = startNode.gScore + startNode.hScore;

        this.openSet.push(startNode);

        setInterval(() => {
            this.find();
        }, 50);
    }
};

var keys = new Array(100).fill(0);

document.addEventListener("keydown", (event) => {
    keys[event.keyCode] = 1;

    if (event.keyCode == 13 && startNode && endNode && startNode != endNode) {
        Pathfinder.start();
    }

    event.preventDefault();
});

document.addEventListener("keyup", (event) => {
    keys[event.keyCode] = 0;
    event.preventDefault();
});

for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
        grid.push(new Node(x, y));
    }
}