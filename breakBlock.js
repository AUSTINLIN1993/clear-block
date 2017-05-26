var BOX_WIDTH = 400;
var	BOX_HEIGHT = 600;
var BLOCK_WIDTH = BOX_WIDTH/10;
var BLOCK_HEIGHT = BLOCK_WIDTH/2;
var BLOCK_COLUMN = 10;
var BALL_R = 10;
const color = ["#663300","#CCCCCC","#FFCC00"];
var ballNum = 50;
var game;

var PLAY_HEIGHT = 5;
var PLAY_WIDTH = 80;
var player = (BOX_WIDTH-PLAY_WIDTH)/2;
var ball = [BOX_WIDTH/2,BOX_HEIGHT-BALL_R-PLAY_HEIGHT,10*Math.random()-5,-10*Math.random()];
var blocks = [];
var block = [];
var hitBlock = [];
var score = 0;
var lecel = 1;

window.onload = function (){
	var canvas = document.getElementById('breakBlock');
	canvas.width = BOX_WIDTH;
	canvas.height = BOX_HEIGHT;
	var context = canvas.getContext('2d');
	initBlocks();

	//玩家控制块
	document.onkeydown=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
              if(e && e.keyCode==37){ // 按 左 
              	if(player>=20){
                  player  -= 20;
              	}
                }
              if(e && e.keyCode==39){ // 按 右
              	if(player+PLAY_WIDTH<=BOX_WIDTH-20){
                  player +=20;
              	}
                }            
         }; 

	
	game = setInterval(function(){
		context.clearRect(0,0,BOX_WIDTH,BOX_HEIGHT);
		contro(context);
		ballUpdate(context);
		buildBloks(context);
		playBlock();
		blockUpdate();
	},20);
}
function contro(ctx){
	ctx.beginPath();
	ctx.rect(player,BOX_HEIGHT-PLAY_HEIGHT,PLAY_WIDTH,PLAY_HEIGHT);
	ctx.stroke();
}

//更新小球位置，并绘制小球
function ballUpdate(ctx){
	ctx.beginPath();
	ctx.arc(ball[0],ball[1],BALL_R,0,2*Math.PI);
	ctx.stroke();
	ball[0] += ball[2];
	ball[1] += ball[3];
	if(ball[0]<=BALL_R || ball[0]>=BOX_WIDTH-BALL_R){
		ball[2] = -ball[2];
	}
	if(ball[1]<=BALL_R){
		ball[3] = -ball[3];
	}
	if(ball[1]>=BOX_HEIGHT+BALL_R){
		window.clearInterval(game);
		alert("游戏结束 最终得分："+score);
	}
}
function initBlocks(){
	for(i=0;i<5;i++){
		var row = [];
		for(j=0;j<10;j++){
			var ran = 5*Math.random();
			if(ran<=3.5){
				row[j] = 0;
			}else if(ran<=4.5){
				row[j] = 1;
			}else{
				row[j] = 2;
			}
			// row[j] = parseInt(3*Math.random());
		}
		blocks[i] = row;
	}
}
//控制板碰撞
function playBlock(){
	var xRangL = player;
	var xRangR = player+PLAY_WIDTH;
	var yRang = BOX_HEIGHT-BALL_R-PLAY_HEIGHT;
	if((ball[0]>xRangL&&ball[0]<xRangR)&&(ball[1]>yRang)){
		ball[3] = -ball[3];
	}

}
//砖块碰撞
function blockUpdate(){
	for(i=0;i<5;i++){
		for(j=0;j<10;j++){
			if(blocks[i][j]!=-1){
				var xRangL = j*BLOCK_WIDTH-BALL_R;
				var xRangR = xRangL+BLOCK_WIDTH+2*BALL_R;
				var yRangT = i*BLOCK_HEIGHT-BALL_R;
				var yRangB = yRangT+BLOCK_HEIGHT+2*BALL_R;
				if((ball[0]>xRangL&&ball[0]<xRangR)&&(ball[1]>yRangT&&ball[1]<yRangB)){
					var xLength = Math.abs(ball[0]-xRangL)<Math.abs(xRangR-ball[0])?Math.abs(ball[0]-xRangL):Math.abs(xRangR-ball[0]);
					var yLength = Math.abs(ball[1]-yRangT)<Math.abs(yRangB-ball[1])?Math.abs(ball[1]-yRangT):Math.abs(yRangB-ball[1]);
					scro(blocks[i][j]);
					console.log(score);
					blocks[i][j] = -1;
					ballNum--;
					if(ballNum==0){
						window.clearInterval(game);
						alert("游戏通关");
					}
					if(xLength/Math.abs(ball[2])<yLength/Math.abs(ball[3])){
						// console.log("水平方向")
						if(ball[2]>0){
							ball[0] -= xLength;
						}else{
							ball[0] += xLength;
						}
						ball[2] = -ball[2];
					}else{
						// console.log("竖直方向")
						if(ball[3]>0){
							ball[1] -= yLength;
						}else{
							ball[1] += yLength;
						}
						ball[3] = -ball[3];
					}
				}
			}
		}
	}
}

//计分函数，灰色1分，银色3分，金色5分
function scro(c){
	if(c==0){
		score++;
	}else if(c==1){
		score += 3;
	}else{
		score +=5;
	}
}
//绘制砖块
function buildBloks(ctx){
	for(i=0;i<5;i++){
		for(j=0;j<10;j++){
			if(blocks[i][j]!=-1){
				ctx.beginPath();
				ctx.rect(j*BLOCK_WIDTH,i*BLOCK_HEIGHT,BLOCK_WIDTH,BLOCK_HEIGHT);
				ctx.stroke();
				ctx.fillStyle = color[blocks[i][j]];
				ctx.fill();
				// ctx.stroke();
			}
		}
	}
}