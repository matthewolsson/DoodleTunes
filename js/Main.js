"use strict"

var c,ctx,img,playMusicBtn,findNotesBtn,musicPlaying,fps,count,difference,sensitivity;

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

    main();
}

function imageIsLoaded(e) {
    $('#myImg').attr('src', e.target.result);
    ctx.clearRect(0,0,c.width,c.height);

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
                imageData.data[i] = 0;
                imageData.data[i+1] = 255;
                imageData.data[i+2] = 0;
            }
        }
    }
    console.log("done");
    ctx.putImageData(imageData,2,2);
    // find rectangle
    // find notes
    console.log("searchForNotes");
}

function main(){
    if(musicPlaying){
        count++;
        update();
        draw();
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
    // update music stick
}

function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    drawImage();
    // draw music stick
}

function drawImage(){
    ctx.strokeStyle = 'black';
    ctx.rect(0,0,c.width,c.height);
    ctx.stroke();
    ctx.drawImage(img,2,2, c.width-4, c.height-4)
}