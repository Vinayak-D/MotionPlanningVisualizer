//javascript for the vegasmap.html file

//import required classes
import {AStarAlgorithm} from "./aStarAlgorithm.js";

//get canvas
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();
var width = 1800;
var height = 650;

//empty 2d array binary image grid
var grid = Array(height).fill().map(() => Array(width).fill(0));

//show popup
window.addEventListener("load",function(){
    const img = new Image();
    img.src = "img/vegasmap.png";
    img.onload = function(){
        ctx.drawImage(img, 0, 0);
    };	
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

//get buttons by ID
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

//set Start
setStartButton.addEventListener("click", setStart);
function setStart(){
    canvas.removeEventListener("click", goalClick);
    canvas.addEventListener("click", startClick);
    setStartButton.innerHTML = 'Double click grid';
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
            ctx.fillStyle = "blue";  
            startPos[0] = Math.round(x);
            startPos[1] = Math.round(y);
            // fill a circle
            ctx.beginPath();           
            document.getElementById("startCoords").innerHTML = `[` + startPos[0] + ` ` + startPos[1] + `]`;      
            //ctx.arc(x, y, 3, 0, 2 * Math.PI); 
            //ctx.fill();
            drawCrosshairs(startPos[0],startPos[1],"red");
			setStartButton.innerHTML = 'Start Set!';
        }
    }
}

//set Goal
setGoalButton.addEventListener("click", setGoal);
function setGoal(){
    canvas.removeEventListener("click", startClick);
    canvas.addEventListener("click", goalClick);
    setGoalButton.innerHTML = 'Double click grid';
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
            //ctx.arc(x, y, 2, 0, 2 * Math.PI); 
            //ctx.fill();
            drawCrosshairs(goalPos[0],goalPos[1],"rgba(244, 104, 11, " + 255 + ")");
            setGoalButton.innerHTML = 'Goal Set!';
        }
      }
}

//run selected Algorithm
runAlgorithmButton.addEventListener("click", runAlgorithm);

function runAlgorithm(){
    runAlgorithmButton.innerHTML = "Running A*";
    document.getElementById("algoresults").innerHTML = `Please wait: calculating route, do not refresh!, No. of Explorations: 0`

   //process canvas (convert to 2D array)
    var imageData = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < imageData.data.length; i += 4){
    var x = (i / 4) % width;
    var y = Math.floor((i / 4) / width);
    if ((imageData.data[i] + imageData.data[i+1] + imageData.data[i+2] == 0) && imageData.data[i+3] >= 240){
          grid[y][x] = 1;
       }
    }
    
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
            //drawPoint(aStar.pos[0],aStar.pos[1],i,"explored");
            ctx.beginPath();
            ctx.fillStyle = "cyan";   
            ctx.rect(aStar.pos[0], aStar.pos[1], 1, 1);
            ctx.fill(); 
            }
            else{
                document.getElementById("algoresults").innerHTML = `Goal not reached! ` + i + ` points explored`;
                return;
            }
          if (i < 1000000) {        
            aStarFunction();             
            }                    
        }, 4)
    }
    aStarFunction(); 
 
}

function drawPoint(xpos,ypos,i){
    setTimeout(function(){
    ctx.beginPath();
    ctx.fillStyle = "red";   
    ctx.rect(xpos, ypos, 3, 3);
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