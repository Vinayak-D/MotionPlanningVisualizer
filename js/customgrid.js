//javascript for the customgrid.html file

//import required classes
import {RRTAlgorithm, treeNode} from "./rrtAlgorithm.js";
import {RRTStarAlgorithm} from "./rrtStarAlgorithm.js";
import {AStarAlgorithm} from "./aStarAlgorithm.js";

//get canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();

var width = 1800;
var height = 650;
//empty 2d array binary image grid
var grid = Array(height).fill().map(() => Array(width).fill(0));

//get buttons by ID
var setObstacleButton = document.getElementById("setObstacles");
var setStartButton = document.getElementById("setStart");
var setGoalButton = document.getElementById("setGoal");
var runAlgorithmButton = document.getElementById("runAlgorithm");
var homeButton = document.getElementById("returnHome")

homeButton.addEventListener("click", goHome)
function goHome() {
    location.href = "https://vinayak-d.github.io/MotionPlanningVisualizer";
}

//initialize start, goal locations
var startPos = [50,50];
var goalPos = [100,100];
var track = 0;
var track2 = 0;
var mouseDown = false;

//show popup
window.addEventListener("load",function(){
    setTimeout(
        function open(event){
            document.querySelector(".popup").style.display = "block";
        },
        500
    )
})
document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none"
});

//set Start
setStartButton.addEventListener("click", setStart);
function setStart(){
    canvas.removeEventListener("click",obstacleDraw);
    canvas.removeEventListener("click", goalClick);
    canvas.addEventListener("click", startClick);
    setStartButton.innerHTML = 'Double click grid';
    setObstacleButton.innerHTML = 'Set Obstacles';
}

function startClick(event){
    canvas.onclick = function(e) {
        track++;
        if (track == 1){
            var x = e.clientX - rect.left;
            if (x <= 0 || x >= width){
                x = Math.floor(Math.random() * width - 1) + 1;
            }
            var y = e.clientY - rect.top;
            if (y <= 0 || y >= height){
                y = Math.floor(Math.random() * height - 1) + 1;
            }            
            startPos[0] = Math.round(x);
            startPos[1] = Math.round(y);
            // fill a circle
            ctx.beginPath();           
            document.getElementById("startCoords").innerHTML = `[` + startPos[0] + ` ` + startPos[1] + `]`;      
            //ctx.arc(x, y, 3, 0, 2 * Math.PI); 
            //ctx.fill();
            drawCrosshairs(startPos[0],startPos[1],"yellow");
            setStartButton.innerHTML = 'Start Set!';
        }
    }
}

//set Goal
setGoalButton.addEventListener("click", setGoal);
function setGoal(){
    canvas.removeEventListener("click",obstacleDraw);
    canvas.removeEventListener("click", startClick);
    canvas.addEventListener("click", goalClick);
    setGoalButton.innerHTML = 'Double click grid';
    setObstacleButton.innerHTML = 'Set Obstacles';
}
function goalClick(event){
    canvas.onclick = function(e) {
        track2++;
        if (track2 == 1){
            var x = e.clientX - rect.left;
            if (x <= 0 || x >= width){
                x = Math.floor(Math.random() * width - 1) + 1;
            }
            var y = e.clientY - rect.top;
            if (y <= 0 || y >= height){
                y = Math.floor(Math.random() * height - 1) + 1;
            } 
            goalPos[0] = Math.round(x);
            goalPos[1] = Math.round(y);
            // fill a circle
            ctx.beginPath();           
            document.getElementById("goalCoords").innerHTML = `[` + goalPos[0] + ` ` + goalPos[1] + `]`;      
            //ctx.arc(x, y, 3, 0, 2 * Math.PI); 
            //ctx.fill();
            drawCrosshairs(goalPos[0],goalPos[1],"green");
            setGoalButton.innerHTML = 'Goal Set!';
        }
      }
}

//set Obstacles
setObstacleButton.addEventListener("click", setObstacles);
function setObstacles(){
    canvas.removeEventListener("click", startClick);
    canvas.removeEventListener("click", goalClick);
    canvas.addEventListener("click",obstacleDraw);
    setObstacleButton.innerHTML = 'Click once, move mouse, click to stop';
}
function obstacleDraw(event){
    mouseDown = !mouseDown;
    canvas.addEventListener('mousemove', (event) => {
    if (mouseDown) {
        redraw(event.clientX - rect.left, event.clientY - rect.top);
    }});
}
function redraw(X,Y) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "black";
    ctx.rect(X, Y, 50, 50);
    ctx.fill();
    ctx.stroke();  
}

//run selected Algorithm
runAlgorithmButton.addEventListener("click", runAlgorithm);
function runAlgorithm(){
    var selectedAlgo = document.getElementsByClassName("choose-algorithm")[0].value;
    runAlgorithmButton.innerHTML = "Running: " + selectedAlgo;
   
    //process canvas (convert to 2D array)
    var imageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4){
    var x = (i / 4) % width;
    var y = Math.floor((i / 4) / width);
    if ((imageData.data[i] + imageData.data[i+1] == 0) && imageData.data[i+3] >= 120){
          grid[y][x] = 1;
       }
    }

    //if using RRT
    if (selectedAlgo=="RRT"){
        //draw goal region
        ctx.beginPath();
        ctx.arc(goalPos[0], goalPos[1], 50, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.stroke();
		setObstacleButton.innerHTML = 'Obstacles Set!';
        document.getElementById("algoresults").innerHTML = `Please wait, calculating route!`;
		var numIterations = 600;
		var stepSize = 50;
		
        //run the RRT algorithm        
        const rrt = new RRTAlgorithm(startPos, goalPos, numIterations, grid, stepSize);

        for (let i = 0; i < rrt.iterations; i+=1){
            rrt.resetNearestValues();
            var point = rrt.sampleAPoint();
            rrt.findNearest(rrt.randomTree, point);
            var newPt = rrt.steerToPoint(rrt.nearestNode, point);
            var bool = rrt.isInObstacle(rrt.nearestNode, newPt);
            if (bool == false){
                rrt.addChild(newPt[0], newPt[1]);
                var begin = [rrt.nearestNode.locationX, rrt.nearestNode.locationY];
                drawTree(ctx, begin, newPt, i);
                //if goal found, append goal to path and break
                if (rrt.goalFound(newPt) == true){
                    rrt.addChild(goalPos[0],goalPos[1]);
                    rrt.retraceRRTPath(rrt.goal);
                    var counter = i;
                    break;
                }   
            }
        }

        if (rrt.pathFound == true){
            for (let i = 0; i <= rrt.Waypoints.length-2; i+=1){
               drawWaypoint(ctx, rrt.Waypoints[i], rrt.Waypoints[i+1], i+counter);
            }
            document.getElementById("algoresults").innerHTML = `Path found! No. Waypoints: ` + rrt.numWaypoints.toString() + ` and   ` + ` Distance: ` + rrt.path_distance.toString();
        }
        else{
            document.getElementById("algoresults").innerHTML = `No path found, max limit of 600 iterations has been reached, try again!`
        }
	}    

    //if using RRTStar
    if (selectedAlgo=="RRTStar"){
        //draw goal region
        ctx.beginPath();
        ctx.arc(goalPos[0], goalPos[1], 30, 0, 2 * Math.PI);
        ctx.strokeStyle = "green";
        ctx.stroke();
		setObstacleButton.innerHTML = 'Obstacles Set!';
        document.getElementById("algoresults").innerHTML = `Please wait, calculating route!`;
		var numIterations = 1500;
		var stepSize = 30;

        //run the Informed RRT* algorithm
        const rrtStar = new RRTStarAlgorithm(startPos, goalPos, numIterations, grid, stepSize); 

        for (let i = 0; i < rrtStar.iterations; i+=1){
            rrtStar.resetNearestValues();
            var point = rrtStar.sampleAPoint();

            if (rrtStar.pathFound == true){
                var c_best = rrtStar.goalCosts[rrtStar.goalCosts.length-1];
                if (rrtStar.checkIfInEllipse(point[0],point[1],c_best) == false){
                    continue;
                }
            }

            rrtStar.findNearest(rrtStar.randomTree, point);
            var newPt = rrtStar.steerToPoint(rrtStar.nearestNode, point);
            var bool = rrtStar.isInObstacle(rrtStar.nearestNode, newPt);  
            if (bool == false){
                rrtStar.findNeighbouringNodes(rrtStar.randomTree, newPt);
                var min_cost_node = rrtStar.nearestNode;
                var min_cost = rrtStar.findPathDistance(min_cost_node);
                min_cost += rrtStar.distance(rrtStar.nearestNode, newPt);
                //connect along minimum cost path 
                for (let i = 0; i < rrtStar.neighbouringNodes.length; i+=1){
                    var vertex_cost = rrtStar.findPathDistance(rrtStar.neighbouringNodes[i]);
                    vertex_cost += rrtStar.distance(rrtStar.neighbouringNodes[i], newPt);
                    if (rrtStar.isInObstacle(rrtStar.neighbouringNodes[i], newPt) == false && vertex_cost < min_cost){
                        min_cost_node = rrtStar.neighbouringNodes[i];
                        min_cost = vertex_cost
                    }
                }
                //update nearest node, and add to new node (if it clears obstacle), 
                //otherwise it'll add to the original nearest node (obstacle free)                  
                rrtStar.nearestNode = min_cost_node;
                const newNode = new treeNode(newPt[0],newPt[1]);
                rrtStar.addAChild(newNode); 
                var begin = [rrtStar.nearestNode.locationX, rrtStar.nearestNode.locationY]; 
                drawTree(ctx, begin, newPt, i);
                //rewire tree
                for (let i = 0; i < rrtStar.neighbouringNodes.length; i+=1){
                    var vertex_cost = min_cost;
                    vertex_cost += rrtStar.distance(rrtStar.neighbouringNodes[i], newPt);
                    if (rrtStar.isInObstacle(rrtStar.neighbouringNodes[i], newPt) == false && vertex_cost < rrtStar.findPathDistance(rrtStar.neighbouringNodes[i])){
                        rrtStar.neighbouringNodes[i].parent = newNode;
                    }
                } 
                //if goal found, append to path, trigger flag, let it sample more 
                if (rrtStar.goalFound(newPt) == true){
                    var projectedCost = rrtStar.findPathDistance(newNode) + rrtStar.distance(rrtStar.goal, newPt)
                    if (projectedCost < rrtStar.goalCosts[rrtStar.goalCosts.length - 1]){
                        rrtStar.addAChild(rrtStar.goal);
                        rrtStar.retracePath();
                        var start = [rrtStar.randomTree.locationX, rrtStar.randomTree.locationY];
                        rrtStar.Waypoints.push(start);
                        rrtStar.Waypoints.push(start);
                        var counter = i;
                        var c_best = rrtStar.goalCosts[rrtStar.goalCosts.length - 1];
                        var rad_x = c_best/2;
                        var rad_y = Math.sqrt(Math.pow(c_best,2) - Math.pow(rrtStar.c_min,2))/2;        
                        ctx.beginPath(); 
                        ctx.ellipse(rrtStar.xCenterEllipse, rrtStar.yCenterEllipse, rad_x, rad_y, rrtStar.ellipseAngle, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
                }            
            }
        }          

            if (rrtStar.pathFound == true){
                var numRoutes = rrtStar.goalCosts.length - 1;
                rrtStar.goalCosts.shift();
                rrtStar.goalCosts = rrtStar.goalCosts.map(function(each_element){
                    return Number(each_element.toFixed(2));
                });
                for (let i = 0; i <= rrtStar.Waypoints.length-2; i+=1){
                   drawWaypoint(ctx, rrtStar.Waypoints[i], rrtStar.Waypoints[i+1], i+counter);
                }
                document.getElementById("algoresults").innerHTML = `Path found! No. Waypoints: ` + rrtStar.numWaypoints.toString() + ` and   ` + ` Distance: ` + rrtStar.goalCosts + `, ` + numRoutes.toString() + ` paths available, displaying shortest calculated path!`;
            }
            else{
                document.getElementById("algoresults").innerHTML = `No path found, max limit of 1500 iterations has been reached, try again!`
            }

        }

    //if using A-Star
    if (selectedAlgo=="AStar"){
        document.getElementById("algoresults").innerHTML = `Please wait: calculating route, do not refresh!, No. of Explorations: 0`
        setObstacleButton.innerHTML = 'Obstacles Set!';

        //run the A-Star algorithm
        const aStar = new AStarAlgorithm(startPos, goalPos, grid);
        var i = 0;

        function aStarFunction() {      
            setTimeout(function() { 
                i++;                    
                var bool = aStar.getPossibleMoves();
                if (bool == true){
                    if (aStar.goalFound() == true){
                        var pathPoints = aStar.findBestPath();
                        document.getElementById("algoresults").innerHTML = `Path found, loading route in red! No. of Explorations: ` + i + `  and  Distance: ` + aStar.moves_to_goal;
                        for (let j = 0; j < pathPoints.length; j +=1 ){
                            drawPoint(pathPoints[j][0],pathPoints[j][1],j);
                        }
                        return;
                    }
                aStar.exploreNextMove();
                document.getElementById("algoresults").innerHTML = `Please wait: calculating route, do not refresh!, No. of Explorations: [` + i + `]; Currently searching: [` + aStar.pos.toString() +  `]; Distance to Goal: ` + aStar.heuristic(aStar.pos).toString();
                ctx.beginPath();
                ctx.fillStyle = "cyan";   
                ctx.rect(aStar.pos[0], aStar.pos[1], 2, 2);
                ctx.fill(); 
                }
                else{
                    document.getElementById("algoresults").innerHTML = `Goal not reached! ` + i + ` points explored`;
                    return;
                }
              if (i < 1200000) {        
                aStarFunction();             
                }                    
            }, 4)
        }
    aStarFunction(); 
    }
}

function drawTree(ctx, begin, end, i) {
    setTimeout(function() {
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(...begin);
        ctx.lineTo(...end);
        ctx.stroke();
        ctx.fillStyle = "red";
        ctx.beginPath(); 
        ctx.arc(begin[0], begin[1], 3, 0, 2 * Math.PI);
        ctx.fill();
        }, 15*i);
}

function drawWaypoint(ctx, begin, end, i) {
    setTimeout(function() {
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(...begin);
        ctx.lineTo(...end);
        ctx.stroke();
        ctx.fillStyle = "yellow";
        ctx.beginPath(); 
        ctx.arc(begin[0], begin[1], 3, 0, 2 * Math.PI);
        ctx.fill();
        var text = Math.round(begin[0]).toString() + ', ' + Math.round(begin[1]).toString();
        ctx.fillText(text, begin[0], begin[1]+10)}, 15*i);        
}

function drawPoint(xpos,ypos,i){
    setTimeout(function(){
    ctx.beginPath();
    ctx.fillStyle = "red";   
    ctx.rect(xpos, ypos, 2, 2);   
    ctx.fill();   
    }, 1*i);
}


function drawCrosshairs(x,y,colorSetting){
    x = Math.floor(x) + 0.5;
    y = Math.floor(y) + 0.5;
    ctx.strokeWidth = 5;
    
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y + 10);
    
    ctx.moveTo(x - 10,  y);
    ctx.lineTo(x + 10,  y);
    
    // Line color
    ctx.strokeStyle = colorSetting;
    ctx.stroke();    
}