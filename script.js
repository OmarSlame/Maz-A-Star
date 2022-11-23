$("#table").remove(); // delete current table

var generate = document.getElementById("generate");
generate.addEventListener("click", function() { // click on generate to generate the path
  /*
    change default values with basic validation
  */
  findBath.disabled = false;
  width = parseInt(widthE.value);
  if (width > 20 || width < 2) {
    alert("Width value should be in range of [2 - 20].");
    return false;
  }

  height = parseInt(heightE.value);
  if (height > 20 || height < 2) {
    alert("Height value should be in range of [2 - 20].");
    return false;
  }

  initialStateX = parseInt(initialStateXE.value);
  if (initialStateX > width - 1 || initialStateX < 0) {
    alert("Initial State X value should be in range from 0 to width - 1.");
    return false;
  }

  initialStateY = parseInt(initialStateYE.value);
  if (initialStateY > height - 1 || initialStateY < 0) {
    alert("Initial State Y value should be in range from 0 to height - 1.");
    return false;
  }

  initalState = { "x": initialStateX, "y": initialStateY } // already validated

  goalStateX = parseInt(goalStateXE.value);
  if (goalStateX > width - 1 || goalStateX < 0) {
    alert("Goal State X value should be in range from 0 to width - 1.");
    return false;
  }

  goalStateY = parseInt(goalStateYE.value);
  if (goalStateY > height -1 || goalStateY < 0) {
    alert("Goal State Y value should be in range from 0 to height - 1.");
    return false;
  }

  goalState = { "x": goalStateX, "y": goalStateY } // already validated

  $("#table").remove(); // delete current table

  /*
    create new table
  */
  var tableRow = document.getElementById("tableRow"); // table container

  var table = document.createElement('table'); // table
  table.style.width = '100%';
  table.setAttribute('border', '1');
  table.classList.add('table');
  table.classList.add('table-primary');
  table.classList.add('table-bordered');
  table.id = "table";

  var caption = document.createElement('caption');
  caption.id = "caption";
  table.appendChild(caption);
  var tbdy = document.createElement('tbody');
  for (var i = 0; i < height; i++) {
    var tr = document.createElement('tr');
    for (var j = 0; j < width; j++) {
      var td = document.createElement('td');
      if(i == initialStateY && j == initialStateX){
        td.innerHTML = "S"
        td.style.color = "white";
        td.style.backgroundColor ="#007bff";
      }
      else if(i == goalStateY && j == goalStateX){
        td.innerHTML = "G"
        td.style.color = "white"
        td.style.backgroundColor ="#dc3545";
      }
      else {
        var checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = j + "_" + i;
        checkbox.addEventListener("click" , function () {
          if (this.checked) {
            this.parentElement.style.backgroundColor = "gray";
          } else {
            this.parentElement.style.backgroundColor = "#b8daff";
          }
        });
        td.appendChild(checkbox);
      }
      tr.appendChild(td)
    }
    tbdy.appendChild(tr);
  }
  table.appendChild(tbdy);
  tableRow.appendChild(table)
  });

var findBath = document.getElementById("findBath");
findBath.disabled = true;
findBath.addEventListener("click", function () {
  findBath.disabled = true;
obstacles = [];
  $("input:checkbox").each(function() {
    var ischecked = $(this).is(":checked"); //check if checked
    if (ischecked){
      var id = $(this).attr('id'); // grab name of original
      var obs = id.split("_");
      obstacles.push({"x" :obs[0] , "y" :obs[1]});
    }
    $(this).css("visibility", "hidden");
   });

  let result =aStarSearch(); // A* search

  if (result.length === 0){
    alert("No path exist!!");
    return ;
  }
  var r=0; //start counting rows in table
  while(row=table.rows[r])
  {
    var c=0; //start counting columns in row
    while(cell=row.cells[c])
    {
        for (var k = 2; k < result.length - 1; k++) {
          if(result[k].x == c && result[k].y == r){
            cell.style.backgroundColor ="#28a745";
          }
        }
      c++;
    }
    r++;
  }

  document.getElementById("caption").innerHTML = "Cost = " + (currentNode[0].cost);
});
/*
  Elements
*/
var widthE = document.getElementById("width");
var heightE = document.getElementById("height");
var initialStateXE = document.getElementById("initialStateX");
var initialStateYE = document.getElementById("initialStateY");
var goalStateXE = document.getElementById("goalStateX");
var goalStateYE = document.getElementById("goalStateY");

/*
  Default values
*/
let width = 2;
let height = 2;
let initialStateX = 0;
let initialStateY = 0;
let initalState = { "x": initialStateX, "y": initialStateY }
let goalStateX = 1;
let goalStateY = 1;
let goalState = { "x": goalStateX, "y": goalStateY }

let obstacles = []


/**
 * fill the values of above variable and draw the maz
 */

// ex on openList = [  [ { "heurestic":5, "cost": 0 }, firstState, secondState ]    ,   []   , []   ]
// ex on closeList = [  [{ "heurestic": 6, "cost": 0 }, State],       []  ]
let openList = []
let closeList = []
let currentNode
function aStarSearch ()  {
    openList = []
    closeList = []

    openList.push([{ "heurestic": manhattanDistance(initalState), "cost": 0 }, initalState])

    while (openList.length !== 0) {

        currentNode = openList[0]


        if (currentNode[currentNode.length - 1].x == goalState.x && currentNode[currentNode.length - 1].y == goalState.y) {
          console.log(currentNode);
            return currentNode
        }
        openList.shift() // Remove an item from the beginning of an array
        closeList.push([{ ...currentNode[0] }, { ...currentNode[currentNode.length - 1] }]) //add to closeList
        expandAndAdd(currentNode)

        arrangeOpenList()

        // console.log(JSON.parse(JSON.stringify(openList)))
        // console.log(JSON.parse(JSON.stringify(closeList)))
    }
    return [];

}
const arrangeOpenList = () => {
    openList = openList.sort(function (a, b) {
        if ((a[0].heurestic + a[0].cost) - (b[0].heurestic + b[0].cost) == 0) {
            return a[0].heurestic - b[0].heurestic
        } else {
            return (a[0].heurestic + a[0].cost) - (b[0].heurestic + b[0].cost)
        }
    })
}


const isObstcale = (x, y) => {
    for (let i = 0; i < obstacles.length; i++) {
        if (x == obstacles[i].x && y == obstacles[i].y) {
            return true
        }
    }
    return false
}

//{heurestic: 4, cost: 2} {x: 0, y: 0} {x: 1, y: 0}
const expandAndAdd = (node) => {
    //node == [ { "heurestic": 5, "cost": 0 }, firstState, secondState ]
    let isForbidden = false

    //move right //{"x":x+1,"y":y}
    if (!(node[node.length - 1].x + 1 > width - 1)) {//valid move

        isForbidden = isObstcale(node[node.length - 1].x + 1, node[node.length - 1].y)

        if (!isForbidden && shouldAdd(node[0].cost + 1, node[node.length - 1].x + 1, node[node.length - 1].y)) {
          addToOpenList(node ,node[node.length - 1].x + 1 , node[node.length - 1].y  )
        }
        isForbidden = false
    }

    //move down// {"x":x,"y":y+1}
    if (!(node[node.length - 1].y + 1 > height - 1)) {//valid move

        isForbidden = isObstcale(node[node.length - 1].x, node[node.length - 1].y + 1)

        if (!isForbidden && shouldAdd(node[0].cost + 1, node[node.length - 1].x, node[node.length - 1].y + 1)) {
          addToOpenList(node ,node[node.length - 1].x , node[node.length - 1].y + 1)
        }

        isForbidden = false
    }
    //move up // {x,y-1}
    if (!(node[node.length - 1].y - 1 < 0)) {//valid move

        isForbidden = isObstcale(node[node.length - 1].x, node[node.length - 1].y - 1)

        if (!isForbidden && shouldAdd(node[0].cost + 1, node[node.length - 1].x, node[node.length - 1].y - 1)) {
          addToOpenList(node ,node[node.length - 1].x , node[node.length - 1].y - 1 )
        }
        isForbidden = false
    }

    //move left //{"x":x-1,"y":y}
    if (!(node[node.length - 1].x - 1 < 0)) {//valid move

        isForbidden = isObstcale(node[node.length - 1].x - 1, node[node.length - 1].y)

        if (!isForbidden && shouldAdd(node[0].cost + 1, node[node.length - 1].x - 1, node[node.length - 1].y)) {
          addToOpenList(node ,node[node.length - 1].x - 1 , node[node.length - 1].y  )
        }
    }
}

const addToOpenList= (node , x , y) =>{
  var nodeToAdd = JSON.parse(JSON.stringify(node))
  nodeToAdd.push({ "x": x, "y":y })
  nodeToAdd[0].heurestic = manhattanDistance(nodeToAdd[nodeToAdd.length - 1])
  nodeToAdd[0].cost += 1
  openList.push(nodeToAdd)

}

const shouldAdd = (cost, x, y) => {

    let betterThanOpenList = false
    let betterThanCloseList = false
    let existInOpenList = false
    let existInCloseList = false

    for (let i = 0; i < openList.length; i++) {
        if (openList[i][openList[i].length - 1].x == x && openList[i][openList[i].length - 1].y == y) {//already exist in open list
            existInOpenList = true
            if (openList[i][0].heurestic + openList[i][0].cost > cost + manhattanDistance({ "x": x, "y": y })) {//better than the exist in open list
                openList.splice(i, 1) /*  node[node.length - 1].x = -1 //remove from open list  */
                betterThanOpenList = true
                break
            } else {//not better than the exist in open list
                betterThanOpenList = false
                break
            }
        }
    }

    for (let j = 0; j < closeList.length; j++) {
        //closeList[i][0]  == {"heurestic":12,"cost":1}
        //closeList[i][1]  == {"x":1,"y":1}
        if (closeList[j][1].x == x && closeList[j][1].y == y) {//already exist in close list
            existInCloseList = true
            if (closeList[j][0].cost + closeList[j][0].heurestic > cost + manhattanDistance({ "x": x, "y": y })) {//better than the exist in close list
                closeList.splice(j, 1) /*  node[0].x = -1 //remove from close list  */
                betterThanCloseList = true
                break
            } else {//not better than the exist in close list
                betterThanCloseList = false
                break
            }
        }
    }

    if ((betterThanOpenList && existInOpenList) || (betterThanCloseList && existInCloseList)) {
        return true
    }
    if ((!betterThanOpenList && existInOpenList) || (!betterThanCloseList && existInCloseList)) {
        return false
    }
    if (!existInOpenList && !existInCloseList) {
        return true
    }
}

const manhattanDistance = (node) => {
    return Math.abs(node.x - goalState.x) + Math.abs(node.y - goalState.y)
}
