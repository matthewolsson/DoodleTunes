"use strict"

var Stick = function(ctx,x,y,height,width){
	this.height = height;
	this.x = x;
	this.y = y;

	this.update = function(){
		this.x += width/240;
	}

	this.draw = function(){
		ctx.beginPath();
		ctx.strokeStyle = 'purple';
		ctx.fillStyle = 'purple';
		ctx.rect(this.x,this.y,5,this.height);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}
}