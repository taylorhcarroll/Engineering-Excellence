//Multidimensional Array = holds a matrix of elements an array of arrays


//Example
let garage = [
    ["Mustange", "F-150", "Explorer"],
    ["corvette", "Silverado,", "Equinox"],
    ["Camry", "Highlander", "Tacoma"]
];

//returns first element of array, which will be that full row because thwe whole row is the array
console.log(garage[0]);

//returns "F-150", [1][2] would be "Equinox"
console.log(garage[0][1]);

//will display all elements in garage
for (let i = 0; i < garage.length; i++) {
    console.log(garage[i])
}

//will iterate through all elements in the multi-dimensional array
//also spits out the coordinates
for (let i = 0; i < garage.length; i++) {
    for (let j = 0; j < garage[i].length; j++) {
        console.log(i, j, garage[i][j]);
    }
}
