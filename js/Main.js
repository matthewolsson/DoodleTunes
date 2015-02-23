"use strict"

var c,ctx,img,playMusicBtn,findNotesBtn,musicPlaying,fps,count,difference,sensitivity,topLeftOfTune,bottomRightOfTune,stick;

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
    sensitivity = 180; // higher is less sensitive
    topLeftOfTune = {x:999,y:999};
    bottomRightOfTune = {x:0,y:0};

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
    for(var i = 0; i < (imageData.height*imageData.width*4); i+=4){
        if(imageData.data[i] > sensitivity && imageData.data[i+1] > sensitivity && imageData.data[i+2] > sensitivity){ // if it's too close to white
            // leave it alone
        }
        else { // make that shit green

            difference = Math.abs(imageData.data[i] - imageData.data[i+1]);
            difference += Math.abs(imageData.data[i] - imageData.data[i+2]);
            difference += Math.abs(imageData.data[i+1] - imageData.data[i+2]);
            if(difference < sensitivity/2.5){ // hopefully catches grays
                // leave them alone
            }
            else {
                // sets the top left and bottom right of the picture
                if((i%(imageData.width*4))/4 < topLeftOfTune.x){
                    topLeftOfTune.x = (i%(imageData.width*4))/4;
                }
                if((i/(imageData.width*4)) < topLeftOfTune.y){
                    topLeftOfTune.y = (i/(imageData.width*4)); 
                }
                if((i%(imageData.width*4))/4 > bottomRightOfTune.x){
                    bottomRightOfTune.x = (i%(imageData.width*4))/4; 
                }
                if((i/(imageData.width*4)) > bottomRightOfTune.y){
                    bottomRightOfTune.y = (i/(imageData.width*4)); 
                }
                imageData.data[i] = 0;
                imageData.data[i+1] = 255; // make green
                imageData.data[i+2] = 0;
            }
        }
    }
    console.log("done");

    ctx.putImageData(imageData,2,2);
    ctx.beginPath();
    ctx.arc(topLeftOfTune.x, topLeftOfTune.y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(bottomRightOfTune.x, bottomRightOfTune.y, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    stick = new Stick(ctx,topLeftOfTune.x,topLeftOfTune.y,(bottomRightOfTune.y-topLeftOfTune.y),(bottomRightOfTune.x-topLeftOfTune.x));

    // find notes
    console.log("searchForNotes");
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