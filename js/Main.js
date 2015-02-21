"use strict"

var c,ctx,img,playMusicBtn,findNotesBtn,musicPlaying,fps,count;

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
    // array of all pixels in image, 4 indexes for each pixel. R,G,B,A
    var imageData = ctx.getImageData(2,2,c.width-4,c.height-4);
    for(var i = 0; i < (imageData.height*imageData.width*4); i++){
        switch(i % 4){
            case 0:{
                if(imageData.data[i] > 75 && imageData.data[i+1] < 75 && imageData.data[i+1] < 75){
                    //debugger;
                    imageData.data[i] = 0;
                    imageData.data[i+1] = 255;
                    imageData.data[i+2] = 0;
                    i += 3;
                }
                //imageData.data[i] = processValue(imageData.data[i], "red"); 
            } break; // red
            case 1:{
                //imageData.data[i] = processValue(imageData.data[i], "green"); 
            } break; // green
            case 2:{
                //imageData.data[i] = processValue(imageData.data[i], "blue");
            } break; // blue
            case 3:{

            } break; // alpha
        }
    }
    console.log("done");
    ctx.putImageData(imageData,2,2);
    // find rectangle
    // find notes
    console.log("searchForNotes");
}

function processValue(value, color){
    if(value > 175){
        if(color == "green"){
            value = 255;
        } else {
            value = 0;
        }
    }
    return value;
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