var grid = [];

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.gridItem = document.createElement("div");
        this.gridItem.classList.add("grid-item");
        document.getElementById("grid").appendChild(this.gridItem);
    }
}

for (let y = 0; y < 20; y++) {
    for (let x = 0; x < 20; x++) {
        grid.push(new Node(x, y));
    }
}

console.log(grid);