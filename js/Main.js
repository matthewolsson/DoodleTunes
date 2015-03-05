// http://stackoverflow.com/questions/13385335/setting-uint8clampedarray-to-imagedata-is-very-slow-in-firefox

"use strict"

var c,ctx,img,playMusicBtn,findNotesBtn,musicPlaying,fps,count,difference,greySensitivity,topLeftOfTune,bottomRightOfTune,stick,noteSensitivity,foundPixels;

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
    count = 0;
    difference = 0;
    greySensitivity = 180; // higher is less sensitive
    noteSensitivity = 8; // lower is less sensitive (must be an increment of 4)
    topLeftOfTune = {x:999,y:999,xindex:0,yindex:0,index:0};
    bottomRightOfTune = {x:0,y:0,xindex:0,yindex:0,index:0};
    foundPixels = [];

    main();
}

function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
    ctx.clearRect(0,0,c.width,c.height);

    topLeftOfTune = {x:999,y:999};
    bottomRightOfTune = {x:0,y:0};

    drawImage();
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

    for(var i = 0; i < foundPixels.length; i++){
        if(testPixel(imageData,foundPixels[i])){
            detectCorners(imageData,foundPixels[i]); // sets the top left and bottom right of the picture
        }
    }
    calculateCornerIndexes(imageData,topLeftOfTune,bottomRightOfTune);

    // exclude top, bottom, left, and right bars --- foundPixels should be shorter by now
    for(var i = 0; i < foundPixels.length; i++){
        // looks for pixels that meet note qualifications (tests below, above, right, and left) NEEDS OPTIMIZING
        if(testPixel(imageData,(foundPixels[i]+noteSensitivity))){ // checks to the right
            if(testPixel(imageData,(foundPixels[i]-noteSensitivity))){ // checks to the left
                if(testPixel(imageData,(foundPixels[i]+(imageData.width*noteSensitivity)))){ // checks below
                    if(testPixel(imageData,(foundPixels[i]-(imageData.width*noteSensitivity)))){ // checks above
                        //processNotePosition(imageData,foundPixels[i]) // Not implemented
                        imageData.data[foundPixels[i]] = 255;
                        imageData.data[foundPixels[i]+1] = 0; // make green
                        imageData.data[foundPixels[i]+2] = 0;   
                    }
                }
            }
        }
    }

    // for debugging purposes, eventually combine find notes into play music
    console.log("done");

    ctx.putImageData(imageData,2,2);
    
    /*ctx.beginPath();
    ctx.arc(topLeftOfTune.x+2, topLeftOfTune.y+2, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();*/

    /*ctx.beginPath();
    ctx.arc(bottomRightOfTune.x+2, bottomRightOfTune.y+2, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();*/

    stick = new Stick(ctx,topLeftOfTune.x+2,topLeftOfTune.y+2,(bottomRightOfTune.y-topLeftOfTune.y),(bottomRightOfTune.x-topLeftOfTune.x));

    // find notes
    console.log("searchForNotes");
}

function calculateCornerIndexes(imageData,topLeftOfTune,bottomRightOfTune){
    var tempx = Math.floor(topLeftOfTune.yindex/(imageData.width*4));
    var tempy = Math.floor(topLeftOfTune.xindex/(imageData.width*4));
    var difference = tempy-tempx;
    topLeftOfTune.index = topLeftOfTune.xindex-(difference*(imageData.width*4));

    imageData.data[topLeftOfTune.index] = 0;
    imageData.data[topLeftOfTune.index+1] = 0; // make green
    imageData.data[topLeftOfTune.index+2] = 255; 

    tempx = Math.floor(bottomRightOfTune.yindex/(imageData.width*4));
    tempy = Math.floor(bottomRightOfTune.xindex/(imageData.width*4));
    difference = tempy-tempx;
    bottomRightOfTune.index = bottomRightOfTune.xindex-(difference*(imageData.width*4));

    imageData.data[bottomRightOfTune.index] = 0;
    imageData.data[bottomRightOfTune.index+1] = 0; // make green
    imageData.data[bottomRightOfTune.index+2] = 255; 
    
    drawBoundingBox(imageData,topLeftOfTune,bottomRightOfTune);
}

function testPixel(imageData,index){
    if(imageData.data[index] === 255 && imageData.data[index+1] === 0 && imageData.data[index+2] === 0){ return true; }
    else{
        if(imageData.data[index] === 0 && imageData.data[index+1] === 255 && imageData.data[index+2] === 0){ return true; }
        else{return false;}
    }
}

function drawBoundingBox(imageData,topLeftOfTune,bottomRightOfTune){
    
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
            foundPixels[foundPixels.length] = index;
        }
    }
}

function detectCorners(imageData,index){
    if((index%(imageData.width*4))/4 < topLeftOfTune.x){
        topLeftOfTune.x = (index%(imageData.width*4))/4;
        topLeftOfTune.xindex = index;
    }
    if((index/(imageData.width*4)) < topLeftOfTune.y){
        topLeftOfTune.y = (index/(imageData.width*4));
        topLeftOfTune.yindex = index;
    }
    if((index%(imageData.width*4))/4 > bottomRightOfTune.x){
        bottomRightOfTune.x = (index%(imageData.width*4))/4;
        bottomRightOfTune.xindex = index;
    }
    if((index/(imageData.width*4)) > bottomRightOfTune.y){
        bottomRightOfTune.y = (index/(imageData.width*4));
        bottomRightOfTune.yindex = index;
    }
}

// When a pixel is detected that has a pixel above, left, right, and below it that are also detected then it's put here for processing, In this function the program jumps up in horizontal line an arbitrary width to find the top of the note, then do the same thing down to find the bottom of the note, then left along a line the height of the note to find the left, and right to do the same. Then assign the center of the note to be the center of the created rectangle, and white the whole note out so it doesn't get caught again when the program continues to run. 
function processNotePosition(imageData,index){
}

function main(){
    if(musicPlaying){
        count++;
        draw();
        update();
    }
    if(count >= 240){
        count = 0;
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