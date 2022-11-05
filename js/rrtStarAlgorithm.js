//import required classes
import {RRTAlgorithm} from "./rrtAlgorithm.js";

export class RRTStarAlgorithm extends RRTAlgorithm{
    constructor(start, goal, numIterations, grid, stepSize){
        super(start, goal, numIterations, grid, stepSize);
        this.searchRadius = this.rho*2;                                                           //neighbourhood search radius          
        this.neighbouringNodes = [];                                                              //neighbouring nodes
        this.goalArray = [goal[0], goal[1]];                                                      //goal array
        this.goalCosts = [10000];                                                                 //costs to goal                  
        this.ellipseAngle = Math.atan2(goal[1]-start[1], goal[0]-start[0]);                       //ellipse angle          
        this.xCenterEllipse = 0.5*(start[0]+goal[0]);                                             //x center ellipse
        this.yCenterEllipse = 0.5*(start[1]+goal[1]);                                             //y center ellipse  
        this.c_min = Math.sqrt(Math.pow(goal[1]-start[1],2) + Math.pow(goal[0]-start[0],2));      //min cost from start to goal
    }

    //new method: check if point is in ellipse
    checkIfInEllipse(pointX, pointY, c_best){
        var rad_x = c_best/2;
        var rad_y = Math.sqrt(Math.pow(c_best,2) - Math.pow(this.c_min,2))/2;
        if ( (((pointX - this.xCenterEllipse)*Math.cos(-this.ellipseAngle) + (pointY - this.yCenterEllipse)*Math.sin(-this.ellipseAngle))**2/rad_x**2 + 
        ((pointX - this.xCenterEllipse)*Math.sin(-this.ellipseAngle) + (pointY - this.yCenterEllipse)*Math.cos(-this.ellipseAngle))**2/rad_y**2 ) < 1){
            return true;
        }
        return false;          
    }
    

    //add a child (replaces addChild in RRT)
    addAChild(treeNode){
        if (treeNode.locationX == this.goal.locationX){
            this.nearestNode.children.push(this.goal);
            this.goal.parent = this.nearestNode;
            this.pathFound = true;
        }
        else{
            this.nearestNode.children.push(treeNode);
            treeNode.parent = this.nearestNode;
        }    
    }

    //reset values (overrides RRT)
	resetNearestValues(){
		this.nearestNode = null;
		this.nearestDist = 10000;
        this.neighbouringNodes = [];
	}    

    //new method: find neighbouring nodes
    findNeighbouringNodes(root,point){
		if (!root){
			return;
		}
        var dist = this.distance(root, point)
        //add to neighbouringNodes if within radius
        if (dist <= this.searchRadius && dist > 0.00001){
            this.neighbouringNodes.push(root);
        }
        for (let i = 0; i <= root.children.length; i += 1){
            this.findNeighbouringNodes(root.children[i], point)
        }    
    }

    //new method: find unique path length from root of a node
    findPathDistance(node){
        var costFromRoot = 0;
        while (node.locationX != this.randomTree.locationX){
            if (node.parent != null) {
                costFromRoot += this.distance(node, [node.parent.locationX, node.parent.locationY]);   
                node = node.parent;
            }
            else{
                costFromRoot = this.distance(node, [this.randomTree.locationX, this.randomTree.locationY]);
                node = this.randomTree;
                break;
            }
        }
        return costFromRoot;
    }

    //retracePath (replaces retraceRRTPath in RRT)
    retracePath(){
        this.numWaypoints = 0;
        this.Waypoints = [];
        var goalCost = 0;
        var goal = this.goal;
        while (goal.locationX != this.randomTree.locationX){
            this.numWaypoints += 1;
            var currentPoint = [goal.locationX, goal.locationY];
            this.Waypoints.push(currentPoint);
            goalCost += this.distance(goal, [goal.parent.locationX, goal.parent.locationY]);
            goal = goal.parent;
        }      
        this.goalCosts.push(goalCost);
    }

}