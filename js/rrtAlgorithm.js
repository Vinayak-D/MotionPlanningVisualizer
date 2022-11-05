//tree node class
export class treeNode{
	constructor(locationX, locationY){
		this.locationX = locationX;
		this.locationY = locationY;
		this.children = [];
		this.parent = null;
	}
}

//RRT Algorithm class
export class RRTAlgorithm{
	constructor(start, goal, numIterations, grid, stepSize){
		this.randomTree = new treeNode(start[0], start[1]);			//root position
		this.goal = new treeNode(goal[0], goal[1]);					//goal position
		this.nearestNode = null;									//nearest Node
		this.iterations = numIterations;							//number of iterations
		this.grid = grid;											//the map
		this.rho = stepSize;										//length of each branch
		this.path_distance = 0;										//total path distance	
		this.nearestDist = 10000;									//distance to nearest Node
		this.numWaypoints = 0;										//number of waypoints
		this.Waypoints = [];										//the waypoints
		this.serializedTree = [];									//the serialized tree
		this.pathFound = false;										//trigger if a path is found
	}
	
	//add the node to the nearest node, and add goal if necessary  
	addChild(locationX, locationY){
		if (locationX == this.goal.locationX){
			this.nearestNode.children.push(this.goal);
			this.goal.parent = this.nearestNode;
			this.pathFound = true;
		}
		else{
			const tempNode = new treeNode(locationX,locationY);
			this.nearestNode.children.push(tempNode);
			tempNode.parent = this.nearestNode;
		}
	}
	
	//sample a random point within grid limits
	sampleAPoint(){
		var x = Math.floor(Math.random() * this.grid[0].length-1) + 1;
		var y = Math.floor(Math.random() * this.grid.length-1) + 1;
		var point = [x,y];
		return point;
	}

	//steer a distance stepSize from start location to end location (keep in mind the grid limits)
	steerToPoint(locationStart, locationEnd){
		var u_vec = this.unitVector(locationStart, locationEnd);
		var offset = [this.rho*u_vec[0], this.rho*u_vec[1]];
		var point = [locationStart.locationX + offset[0], locationStart.locationY + offset[1]];
		if (point[0] >= this.grid[0].length){
			point[0] = this.grid[0].length-1;
		}	
		if (point[1] >= this.grid.length){
			point[1] = this.grid.length-1;
		}
		return point		
	}

    //check if obstacle lies between the start and end point of the edge
    isInObstacle(locationStart, locationEnd){
		var u_hat = this.unitVector(locationStart, locationEnd);
		var testPoint = [0.0, 0.0];
		for (let i = 0; i < this.rho; i+=1){
			testPoint[0] = Math.min(locationStart.locationX + i*u_hat[0], this.grid[0].length-1);
			testPoint[1] = Math.min(locationStart.locationY + i*u_hat[1], this.grid.length-1);
			if (testPoint[0] <= 0){
				testPoint[0] = 0;
			}
			if (testPoint[1] <= 0){
				testPoint[1] = 0;
			}			
			if (this.grid[Math.round(testPoint[1])][Math.round(testPoint[0])] == 1){
				return true;
			}
		}
		return false;
	}

	//find the unit vector between node and a point
	unitVector(locationStart, locationEnd){
		var v = [locationEnd[0] - locationStart.locationX, locationEnd[1] - locationStart.locationY];
		var norm = Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2));
		if (norm < 1.0){
			norm = 1.0;
		}
		var u_hat = [v[0]/norm, v[1]/norm];
		return u_hat;
	}	

	//find the nearest node from a given (unconnected) point (Euclidean distance)
	findNearest(root, point){
		if (!root){
			return;
		}
		var dist = this.distance(root, point);
		if (dist <= this.nearestDist){
			this.nearestNode = root;
			this.nearestDist = dist;
		}
		for (let i = 0; i <= root.children.length; i += 1){
			this.findNearest(root.children[i], point);
		}
	}

	//find euclidean distance between a node and a point
    distance(node1, point){
		var dist = Math.sqrt(Math.pow(node1.locationX - point[0], 2) + Math.pow(node1.locationY - point[1], 2));
		return dist;
	}
	
	//check if goal reached within step size
	goalFound(point){
		if (this.distance(this.goal, point) <= this.rho){
			return true;
		}
		else{
			return false;
		}
	}

	//reset nearestNode and nearestDistance
	resetNearestValues(){
		this.nearestNode = null;
		this.nearestDist = 10000;
	}

	//retrace path from goal to start
    retraceRRTPath(goal){
        if (goal.locationX == this.randomTree.locationX){
			var start = [this.randomTree.locationX, this.randomTree.locationY];
			this.Waypoints.push(start);
			this.Waypoints.push(start);
			return;
		}
        this.numWaypoints += 1;
        var currentPoint = [goal.locationX, goal.locationY];
        this.Waypoints.push(currentPoint);
        this.path_distance += this.rho;
        this.retraceRRTPath(goal.parent);
	}

}