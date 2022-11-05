//A-Star Algorithm Class
export class AStarAlgorithm{
    constructor(start, goal, grid){
        this.pos = start;
        this.pos_str = start.toString();
        this.pos_depth = 0;
        this.goal_str = goal.toString();
        this.goal = goal;
        this.explored = {};
        this.not_explored = {};
        this.not_explored[start.toString()] = 0;
        this.grid = grid;
        this.path = Array(grid.length).fill().map(() => Array(grid[0].length).fill(0));
        this.best_path = Array(grid.length).fill().map(() => Array(grid[0].length).fill(0));
        this.moves_to_goal = 0;    
        this.goal_reached = false;    
    }

    //check if dictionary is empty
    isEmptyDictionary(dict) {
        for (var name in dict) {
            return false;
        }
        return true;
    }

    //find the key in the dictionary which gives the minimum value (must be nonempty)
    findMinKeyValue(dict){
        var key = "temp";
        var value = 100000;
        for (var item in dict){
            if (dict[item] < value){
                value = dict[item];
                key = item;
            }
        }
        return key;
    }

    //get possible moves
	getPossibleMoves(){
        var potential_moves = this.generatePotentialMoves(this.pos);
        for (let i = 0; i < potential_moves.length; i+=1){
            if (this.validMove(potential_moves[i]) == false){
                continue;
            }
            if ((potential_moves[i].toString() in this.explored == false) && (potential_moves[i].toString() in this.not_explored == false)){
                this.not_explored[potential_moves[i].toString()] = this.pos_depth + 1 + this.heuristic(potential_moves[i])
            }
        }
        this.explored[this.pos.toString()] = 0;
        delete this.not_explored[this.pos.toString()];

        if (this.isEmptyDictionary(this.not_explored)){
            return false;
        }
        else{
            return true;
        }
	}

    //check if goal found
	goalFound(){
        if (this.goal_str in this.not_explored == true){
            this.pos = this.goal;
            //this.pos_heuristic = this.not_explored[this.goal_str]
            this.pos_depth = this.not_explored[this.goal_str]
            this.path[this.goal[1]][this.goal[0]] = this.pos_depth;
            this.goal_reached = true;
            return true;
        }
        return false;        
	}

    //explore next move
	exploreNextMove(){
        var minKey = this.findMinKeyValue(this.not_explored);    
        this.pos = this.stringToArray(minKey); 
        this.pos_depth = this.not_explored[minKey] - this.heuristic(this.pos);      
        this.path[this.pos[1]][this.pos[0]] = Math.round(this.pos_depth, 1);
        return true;
	}

    //heuristic cost
	heuristic (move){
		var cost = Math.sqrt(Math.pow(move[0] - this.goal[0],2) + Math.pow(move[1] - this.goal[1],2));
		return Math.round(cost, 1);
	}

    //generate potential moves
	generatePotentialMoves(pos){
		const u = [0, -1];
		const d = [0, 1];
		const l = [-1, 0];
		const r = [1, 0];
		var potential_moves = [[pos[0] + u[0], pos[1] + u[1]], [pos[0] + d[0], pos[1] + d[1]], [pos[0] + l[0], pos[1] + l[1]], [pos[0] + r[0], pos[1] + r[1]],
        [pos[0] + u[0] + r[0], pos[1] + u[1] + r[1]], [pos[0] + d[0] + r[0], pos[1] + d[1] + r[1]], [pos[0] + u[0] + l[0], pos[1] + u[1] + l[1]], [pos[0] + d[0] + l[0], pos[1] + d[1] + l[1]]];
		return potential_moves;
	}

    //check if valid move (within boundaries and obstacle free)
	validMove(move){
		//Check if out of boundary.
        if ((move[0] < 0) || (move[0] >= this.grid[0].length)){
            return false;
        }
        if ((move[1] < 0) || (move[1] >= this.grid.length)){
            return false;
        }
        //Check if wall or obstacle exists.
        if (this.grid[move[1]][move[0]] > 0.9){
            return false;
        }
        return true;
	}

    //string "x,y" to array [x,y]
    stringToArray(string){
        var strsplit = string.split(","); 
        var array = [parseInt(strsplit[0]), parseInt(strsplit[1])];
        return array;
    }

    //find best path
    findBestPath(){
        var pos = this.goal;
        var pathPoints = [];
        while (true){
            this.best_path[pos[1]][pos[0]] = 1;
            var h_pos = Math.round(this.path[pos[1]][pos[0]], 1);
            if (h_pos == 1){
                return pathPoints;
                break;
            }
            var potential_moves = this.generatePotentialMoves(pos);
            for (let i = 0; i < potential_moves.length; i += 1){
                if (this.validMove(potential_moves[i]) == false){
                    continue;
                }     
                var h_move = this.path[potential_moves[i][1]][potential_moves[i][0]];  
                if (h_move == (h_pos - 1)){
                    pathPoints.push(pos);
                    this.moves_to_goal += 1;
                    pos = potential_moves[i];
                    break;                    
                }
            }
        }
    }
    
}