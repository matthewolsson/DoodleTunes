"use strict"

function(ctx,height,x,y,distance){
	this.height = height;
	this.x = x;
	this.y = y;

	var update = function(){
		this.x += distance/240;
	}

	var draw = function(){
		ctx.strokeStyle = 'red';
		ctx.fillStyle = 'red';
		ctx.rect(this.x,this.y,this.height,5);
		ctx.stroke();
		ctx.fill();
	}
}