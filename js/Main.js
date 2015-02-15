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
    findNotesBtn.onclick = function(){searchForRectangle(); searchForNotes();};


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

function searchForRectangle(){
    console.log("searchForRectangle");
}

function searchForNotes(){
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