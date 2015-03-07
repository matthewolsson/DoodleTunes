// http://stackoverflow.com/questions/13385335/setting-uint8clampedarray-to-imagedata-is-very-slow-in-firefox

"use strict"

var c,ctx,img,playMusicBtn,findNotesBtn,musicPlaying,fps,frameCount,difference,greySensitivity,stick,noteSensitivity,allFoundPixels,boundingBox,noteArray;

window.onload = init;

function init(){
    c = document.getElementById("musicalPic");
    ctx = c.getContext("2d");

    $('#imageUploader').change(function () {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageIsLoaded;
            reader.readAsDataURL(this.files[0]);
        }
    });

    img=document.getElementById("myImg");
    
    playMusicBtn=document.getElementById("playMusic");
    playMusicBtn.onclick = playMusic;
    findNotesBtn=document.getElementById("findNotes");
    findNotesBtn.onclick = searchForNotes;


    musicPlaying = false;
    img.hidden = true;
    fps = 60;
    frameCount = 0;
    difference = 0;
    greySensitivity = 180; // higher is less sensitive
    noteSensitivity = 8; // lower is less sensitive (must be an increment of 4)
    allFoundPixels = [];
    noteArray = [];
    boundingBox = {topLeft:{x:999,xIndex:0,y:999,yIndex:0,index:0},bottomRight:{x:0,xIndex:0,y:0,yIndex:0,index:0},height:0,width:0};

    main();
}

function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
    ctx.clearRect(0,0,c.width,c.height);
    resetEverything();
    drawImage();
}

function resetEverything(){
    frameCount = 0;
    difference = 0;
    allFoundPixels = [];
    noteArray = [];
    boundingBox = {topLeft:{x:999,xIndex:0,y:999,yIndex:0,index:0},bottomRight:{x:0,xIndex:0,y:0,yIndex:0,index:0},height:0,width:0};
}

// 4 seconds with 16 beats. (2 measures of 4/4 time)
function playMusic(){
    musicPlaying = true;
    console.log("MusicPlayingStart");
}

function searchForNotes(){
    // array of all pixels in image, 4 indexes for each pixel. R,G,B,A - for loop indexes by pixel not value
    var imageData = ctx.getImageData(2,2,c.width-4,c.height-4);

    for(var i = 0; i < imageData.data.length; i+=4){
        flagPixels(imageData,i); // colors all pixels that aren't white or black, green.
    }

    for(var i = 0; i < allFoundPixels.length; i++){
        if(testPixel(imageData,allFoundPixels[i])){
            detectCorners(imageData,allFoundPixels[i]); // sets the top left and bottom right of the picture
        }
    }
    calculateCornerIndexes(imageData,boundingBox); // calculates the pixel position and actual x and y of the corners/draws bounding box

    // exclude top, bottom, left, and right bars --- allFoundPixels should be shorter by now

    for(var i = 0; i < allFoundPixels.length; i++){
        if(testForNotePixel(allFoundPixels[i])){ // if a note has been found
            findAllPixelsInNote(startingPixel,imageData,noteArray) // find all the pixels in that note and calculate its center
        }
    }

    for(var i = 0; )

    // for debugging purposes, eventually combine find notes into play music
    console.log("done");

    ctx.putImageData(imageData,2,2);

    boundingBox.topLeft.y = boundingBox.topLeft.y+2;
    boundingBox.topLeft.x = boundingBox.topLeft.x+2;

    stick = new Stick(ctx,boundingBox.topLeft.x,boundingBox.topLeft.y,boundingBox.height,boundingBox.width);

    // find notes
    console.log("searchForNotes");
}

function testForNotePixel(imageData,index){
    if(!(imageData.data[index] === 255 && imageData.data[index+1] === 0 && imageData.data[index+2] === 0)){
        if(testPixel(imageData,(index+noteSensitivity))){ // checks to the right
            if(testPixel(imageData,(index-noteSensitivity))){ // checks to the left
                if(testPixel(imageData,(index+(imageData.width*noteSensitivity)))){ // checks below
                    if(testPixel(imageData,(index-(imageData.width*noteSensitivity)))){ // checks above
                        return(true);
                    }
                }
            }
        }
    }
    return false;
}

function calculateCornerIndexes(imageData,boundingBox){
    var tempx = Math.floor(boundingBox.topLeft.yIndex/(imageData.width*4));
    var tempy = Math.floor(boundingBox.topLeft.xIndex/(imageData.width*4));
    var difference = tempy-tempx;
    boundingBox.topLeft.index = boundingBox.topLeft.xIndex-(difference*(imageData.width*4));

    tempx = Math.floor(boundingBox.bottomRight.yIndex/(imageData.width*4));
    tempy = Math.floor(boundingBox.bottomRight.xIndex/(imageData.width*4));
    difference = tempy-tempx;
    boundingBox.bottomRight.index = boundingBox.bottomRight.xIndex-(difference*(imageData.width*4));

    boundingBox.width = boundingBox.bottomRight.x-boundingBox.topLeft.x;
    boundingBox.height = boundingBox.bottomRight.y-boundingBox.topLeft.y;
    drawBoundingBox(imageData,boundingBox);
}

function testPixel(imageData,index){
    // if the pixel is green OR red
    if((imageData.data[index] === 255 && imageData.data[index+1] === 0 && imageData.data[index+2] === 0) || (imageData.data[index] === 0 && imageData.data[index+1] === 255 && imageData.data[index+2] === 0)){ return true; }
    else{return false;}
}

function drawBoundingBox(imageData,boundingBox){
    for(var i = 0; i < boundingBox.width; i++){
        imageData.data[boundingBox.topLeft.index + (i*4)] = 0;
        imageData.data[boundingBox.topLeft.index + (i*4) +1] = 0;
        imageData.data[boundingBox.topLeft.index + (i*4) +2] = 255;
        imageData.data[boundingBox.bottomRight.index - (i*4)] = 0;
        imageData.data[boundingBox.bottomRight.index - (i*4) +1] = 0;
        imageData.data[boundingBox.bottomRight.index - (i*4) +2] = 255;
    }

    for(var i = 0; i < boundingBox.height; i++){
        imageData.data[boundingBox.topLeft.index + (i*imageData.width*4)] = 0;
        imageData.data[boundingBox.topLeft.index + (i*imageData.width*4) + 1] = 0;
        imageData.data[boundingBox.topLeft.index + (i*imageData.width*4) + 2] = 0;
        imageData.data[boundingBox.bottomRight.index - (i*imageData.width*4)] = 0;
        imageData.data[boundingBox.bottomRight.index - (i*imageData.width*4) + 1] = 0;
        imageData.data[boundingBox.bottomRight.index - (i*imageData.width*4) + 2] = 0;
    }
}

function flagPixels(imageData,index){
    if(imageData.data[index] > greySensitivity && imageData.data[index+1] > greySensitivity && imageData.data[index+2] > greySensitivity){ // if it's too close to white
        return false;
    }
    else { // pixel is not white
        // calculates how grey it is
        difference = Math.abs(imageData.data[index] - imageData.data[index+1]);
        difference += Math.abs(imageData.data[index] - imageData.data[index+2]);
        difference += Math.abs(imageData.data[index+1] - imageData.data[index+2]);
        if(difference < greySensitivity/2.5){ // catches greys
            return false;
        }
        else {
            imageData.data[index] = 0;
            imageData.data[index+1] = 255; // make green
            imageData.data[index+2] = 0;
            allFoundPixels[allFoundPixels.length] = index;
        }
    }
}

function detectCorners(imageData,index){
    if((index%(imageData.width*4))/4 < boundingBox.topLeft.x){
        boundingBox.topLeft.x = (index%(imageData.width*4))/4;
        boundingBox.topLeft.xIndex = index;
    }
    if((index/(imageData.width*4)) < boundingBox.topLeft.y){
        boundingBox.topLeft.y = (index/(imageData.width*4));
        boundingBox.topLeft.yIndex = index;
    }
    if((index%(imageData.width*4))/4 > boundingBox.bottomRight.x){
        boundingBox.bottomRight.x = (index%(imageData.width*4))/4;
        boundingBox.bottomRight.xIndex = index;
    }
    if((index/(imageData.width*4)) > boundingBox.bottomRight.y){
        boundingBox.bottomRight.y = (index/(imageData.width*4));
        boundingBox.bottomRight.yIndex = index;
    }
}

function main(){
    if(musicPlaying){
        frameCount++;
        draw();
        update();
    }
    if(frameCount >= 240){
        frameCount = 0;
        musicPlaying = false;
        console.log("MusicPlayingFinish");
    }
    setTimeout(function() {
        requestAnimationFrame(main);
    }, 1000 / fps);
}

function update(){
    stick.update();
}

function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    drawImage();
    stick.draw();
}

function drawImage(){
    ctx.drawImage(img,2,2, c.width-4, c.height-4)
    ctx.beginPath();
    ctx.strokeStyle = 'black';
    ctx.rect(0,0,c.width,c.height); // border
    ctx.stroke();
    ctx.closePath();
}