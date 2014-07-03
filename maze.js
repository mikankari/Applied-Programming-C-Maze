

function Maze(){
	this.data;
	this.startX;
	this.startY;
	this.finishX;
	this.finishY;
	this.playerX;
	this.playerY;
	this.playerCounter;
	this.isFinish;
	this.genericStack;
	this.filename = "C:/Users/1223066/Desktop/応用プログラミングC/第3回レポート/maze.txt";
	this.filename2 = "C:/Users/1223066/Desktop/応用プログラミングC/第3回レポート/ans.txt";

	this.init();
}

Maze.prototype = {
	init: function (){
		this.importEmptyData(100, 100);
		this.playerCounter = 0;
		this.isFinish = false;
		this.genericStack = [];
	}

	, importEmptyData: function (width, height){
		var data = [];
		for(var i = 0; i < height; i++){
			var data_row = [];
			data_row.push(1);
			for (var j = 1; j < width - 1; j++) {
				var value;
				if(i == 0 || i == height - 1){
					value = 1;
				}else if(i == 1 && j == 1){
					value = 2;
				}else if((height % 2 == 0 ? i == height - 3 : i == height - 2) && (width % 2 == 0 ? j == width - 3 : j == width - 2)){
					value = 3;
				}else{
					value = 0;
				}
				data_row.push(value);
			}
			data_row.push(1);
			data.push(data_row);
		}
		this.importData(data);
	}

	, importData: function (data){
		this.data = data;
		for(var i = 0; i < this.data.length; i++){
			for(var j = 0; j < this.data[i].length; j++){
				switch(this.data[i][j]){
					case 2:	this.startX = j;	this.startY = i;	break;
					case 3:	this.finishX = j;	this.finishY = i;	break;
				}
			}
		}
		this.playerX = this.startX;
		this.playerY = this.startY;
	}

	, movePlayer: function (index, type){
		var playernextX = this.playerX;
		var playernextY = this.playerY;
		switch(index){
			case 1:	playernextY--;	break;
			case 2:	playernextX++;	break;
			case 3:	playernextY++;	break;
			case 4:	playernextX--;	break;
		}
		if(!(playernextX >= 1 && playernextX < this.data[0].length - 1 && playernextY >= 1 && playernextY < this.data.length - 1)){
			return false;
		}
		var result = false;
		switch(type){
			case "move":	// 4 or 5 を書き込む
				if(this.data[playernextY][playernextX] != 1){
					if(this.data[this.playerY][this.playerX] == 4){
						this.data[this.playerY][this.playerX] = 5;
					}
					this.playerX = playernextX;
					this.playerY = playernextY;
					this.playerCounter++;
					if(this.data[this.playerY][this.playerX] != 2 && this.data[this.playerX][this.playerY] != 3){
						this.data[this.playerY][this.playerX] = 4;
					}
					if(this.playerX == this.finishX && this.playerY == this.finishY){
						this.isFinish = true;
					}
				}
				break;
			case "movedepth":
				if(this.genericStack.length != 0){
					var moveable = this.getMoveable();
					var direction = -1;
					for(var i = 0; i < moveable.length; i++){
						if(this.getNextState(moveable[i]) == 0 || this.getNextState(moveable[i]) == 3){
							direction = moveable[i];
							break;
						}
					}
					if(direction != -1){
						this.movePlayer(direction, "move");
						this.genericStack.push(direction);
					}else{
						direction = this.genericStack.pop();
						if(direction <= 2){
							direction += 2;
						}else{
							direction -= 2;
						}
						this.movePlayer(direction, "move");
					}
					if(this.playerX == this.finishX && this.playerY == this.finishY){
						this.isFinish = true;
					}
					result = true;
				}
				break;
			case "putway2":	// 0 を書き込む
				// 未完成
				var moveable = this.getUnmoveable2();
				if(moveable.length != 0){
					var direction = moveable[Math.floor(Math.random() * moveable.length)];
					this.movePlayer(direction, "putway");
					result = true;
				}
				if(maze.getWayPercentage() > 0.51 && maze.getFinishMoveable().length != 0){
					this.isFinish = true;
				}
				break;
			case "putway":
				if(this.data[playernextY][playernextX] != 2 && this.data[playernextY][playernextX] != 3){
					this.data[playernextY][playernextX] = 0;
				}
				switch(index){
					case 1:	playernextY--;	break;
					case 2:	playernextX++;	break;
					case 3:	playernextY++;	break;
					case 4:	playernextX--;	break;
				}
				if(this.data[playernextY][playernextX] != 2 && this.data[playernextY][playernextX] != 3){
					this.data[playernextY][playernextX] = 0;
				}
				this.playerX = playernextX;
				this.playerY = playernextY;
				this.playerCounter += 2;
				break;

				// if(!(playernextX2 >= 1 && playernextX2 <= this.data[0].length - 2 && playernextY2 >= 1 && playernextY2 <= this.data.length - 2)){
				// 	return false;
				// }
				// if(this.data[playernextY2][playernextX2] == 1){
				// 	this.playerX = playernextX;
				// 	this.playerY = playernextY;
				// 	this.playerCounter++;
				// 	this.data[this.playerY][this.playerX] = 0;
				// 	this.playerX = playernextX2;
				// 	this.playerY = playernextY2;
				// 	this.playerCounter++;
				// 	this.data[this.playerY][this.playerX] = 0;
				// 	// result = true;
				// }
				// result = true;
				// break;
		}
		return result;
	}

	, getNextState: function (direction){
		var playernextX = this.playerX;
		var playernextY = this.playerY;
		switch(direction){
			case 1:	playernextY--;	break;
			case 2:	playernextX++;	break;
			case 3:	playernextY++;	break;
			case 4:	playernextX--;	break;
		}
		var state = this.data[playernextY][playernextX];
		return state;
	}

	, getMoveable: function (){
		var moveable = [];
		if(this.data[this.playerY - 1][this.playerX] != 1){
			moveable.push(1);
		}
		if(this.data[this.playerY][this.playerX + 1] != 1){
			moveable.push(2);
		}
		if(this.data[this.playerY + 1][this.playerX] != 1){
			moveable.push(3);
		}
		if(this.data[this.playerY][this.playerX - 1] != 1){
			moveable.push(4);
		}
		return moveable;
	}

	, getFinishMoveable: function (){
		var moveable = [];
		if(this.data[this.finishY - 1][this.finishX] != 1){
			moveable.push(1);
		}
		if(this.data[this.finishY][this.finishX + 1] != 1){
			moveable.push(2);
		}
		if(this.data[this.finishY + 1][this.finishX] != 1){
			moveable.push(3);
		}
		if(this.data[this.finishY][this.finishX - 1] != 1){
			moveable.push(4);
		}
		return moveable;
	}

	, getNextState2: function (direction){
		var playernextX = this.playerX;
		var playernextY = this.playerY;
		switch(direction){
			case 1:	playernextY-=2;	break;
			case 2:	playernextX+=2;	break;
			case 3:	playernextY+=2;	break;
			case 4:	playernextX-=2;	break;
		}
		var state = this.data[playernextY][playernextX];
		return state;
	}

	, getUnmoveable2: function (){
		var unmoveable = [];
		if(this.playerY - 2 > 0 && this.data[this.playerY - 2][this.playerX] != 0){
			unmoveable.push(1);
		}
		if(this.playerX + 2 < this.data[0].length - 1 && this.data[this.playerY][this.playerX + 2] != 0){
			unmoveable.push(2);
		}
		if(this.playerY + 2 < this.data.length - 1 && this.data[this.playerY + 2][this.playerX] != 0){
			unmoveable.push(3);
		}
		if(this.playerX - 2 > 0 && this.data[this.playerY][this.playerX - 2] != 0){
			unmoveable.push(4);
		}
		return unmoveable;
	}

	, getNext2Range: function (direction){

	}

	, getWayPercentage: function (){
		var ways = 0;
		var count = 0;
		for(var i = 1; i < (this.data.length - 2); i++){
			for(var j = 1; j < this.data[i].length - 2; j++){
				if(this.data[i][j] != 1){
					ways++;
				}
				count++;
			}
		}
		var percentage = ways / count;
		return percentage;
	}

	, readFile: function (filename){
		var filesystem = new ActiveXObject("Scripting.FileSystemObject");
		var reader = filesystem.OpenTextFile(filename, 1);
		var maze_text = reader.ReadALL();
		reader.Close();
		var data = [];
		var maze_text_row = maze_text.split("\n");
		for(var i = 0; i < maze_text_row.length; i++){
			var data_row = [];
			var maze_text_column = maze_text_row[i].split(" ");
			for(var j = 0; j < maze_text_column.length; j++){
				var value = parseInt(maze_text_column[j]);
				data_row.push(value);
			}
			data.push(data_row);
		}
		return data;
	}

	, writeFile: function (filename, data){
		var maze_text = [];
		for (var i = 0; i < data.length; i++) {
			maze_text.push(data[i].join(" "));
		}
		maze_text = maze_text.join("\n");
		var filesystem = new ActiveXObject("Scripting.FileSystemObject");
		var writer = filesystem.OpenTextFile(filename, 2);
		writer.Write(maze_text);
		writer.Close();
		return data;
	}

}
