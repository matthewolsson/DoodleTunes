"use strict"

function findAllPixelsInNote(startingPixel){ // finds and stores the rest of the pixels in a note
    note = {left:0,right:0,top:0,bottom:0,center:{x:0,y:0},timing:0,assignedNote:""};
    examineRows(startingPixel);

    note.center.x = 3+(note.left + (note.right-note.left)/2);
    note.center.y = 2+(note.top + (note.bottom-note.top)/2);
    noteArray.push(note);
}

function examineRows(startingPixel){
    notePixels = [];
    notePixels.push(startingPixel); // stores the first (found) pixel in the row

    LookRight(startingPixel+4); // stores the rest of the pixels to the left and right
    LookLeft(startingPixel-4);

    for(var i = 0; i < notePixels.length; i++){ // colors all the pixels in this row red
        imageData.data[notePixels[i]] = 255;
        imageData.data[notePixels[i]+1] = 0;
        imageData.data[notePixels[i]+2] = 0;
    }

    setNoteValues(); // updates the notes values

    var nextRowFound = false; // looks for another row
    for(var i = 0; (i < notePixels.length && !nextRowFound); i++){
        if(testForNotePixel(notePixels[i] + (imageData.width*4))){
            nextRowFound = true;
            examineRows(notePixels[i] + (imageData.width*4));
        }
    }
}

function setNoteValues(){
    for(var i = 0; i < notePixels.length; i++){
        if((notePixels[i]/(imageData.width*4) < note.top) || (note.top === 0)){
            note.top = (notePixels[i]/(imageData.width*4));
        }
        if(notePixels[i]/(imageData.width*4) > note.bottom){
            note.bottom = (notePixels[i]/(imageData.width*4));
        }
        if((((notePixels[i]%(imageData.width*4))/4) < note.left) || note.left === 0){
            note.left = (notePixels[i]%(imageData.width*4))/4;
        }
        if(((notePixels[i]%(imageData.width*4))/4) > note.right){
            note.right = ((notePixels[i]%(imageData.width*4))/4);
        }
    }
}

function LookLeft(pixel){
    if(testForNotePixel(pixel)){ // if the pixel to the right is part of the note
        notePixels.push(pixel);
        LookLeft(pixel-4);
    }
}

function LookRight(pixel){
    if(testForNotePixel(pixel)){ // if the pixel to the left is part of the note
        notePixels.push(pixel);
        LookRight(pixel+4);
    }
}
// if two notes are right next to eachother then delete them and create one between them. This should get rid of multiple notes being detected on just one.
function removeDuplicates(){
    for(var i = 0; i < noteArray.length; i++){
        if(noteArray[i] != undefined){
            for(var k = i+1; k < noteArray.length; k++){
                if(noteArray[k] != undefined){
                    var tempX = 0;
                    var tempY = 0;
                    tempX = (noteArray[i].center.x - noteArray[k].center.x)*(noteArray[i].center.x - noteArray[k].center.x);
                    tempY = (noteArray[i].center.y - noteArray[k].center.y)*(noteArray[i].center.y - noteArray[k].center.y);
                    var temp = Math.sqrt(tempX + tempY);
                    if(temp < 10){ // if the two notes are too close together
                        var tempNote = {left:0,right:0,top:0,bottom:0,center:{x:0,y:0},timing:0,assignedNote:""};
                        tempNote.center.x = (noteArray[i].center.x-noteArray[k].center.x)/2 + noteArray[k].center.x;
                        tempNote.center.y = (noteArray[i].center.y-noteArray[k].center.y)/2 + noteArray[k].center.y;
                        delete noteArray[k];
                        delete noteArray[i];
                        noteArray.push(tempNote);
                        i = -1;
                        break;
                    }
                }
            }
        }
    }
    noteArray = noteArray.filter(function(n){ return n != undefined }); // removes undefined values
}

function assignNotes(){
    var numberOfNotes = 13;
    for(var i = 0; i < noteArray.length; i++){
        var adjustedY = noteArray[i].center.y-boundingBox.topLeft.y;
        var percentageY = adjustedY/boundingBox.height*100;
        if(percentageY > (100/numberOfNotes*0) && percentageY <= (100/numberOfNotes*1)){ noteArray[i].assignNote = "E5"; continue; }
        if(percentageY > (100/numberOfNotes*1) && percentageY <= (100/numberOfNotes*2)){ noteArray[i].assignNote = "D5"; continue; }
        if(percentageY > (100/numberOfNotes*2) && percentageY <= (100/numberOfNotes*3)){ noteArray[i].assignNote = "C5"; continue; }
        if(percentageY > (100/numberOfNotes*3) && percentageY <= (100/numberOfNotes*4)){ noteArray[i].assignNote = "B5"; continue; }
        if(percentageY > (100/numberOfNotes*4) && percentageY <= (100/numberOfNotes*5)){ noteArray[i].assignNote = "A5"; continue; }
        if(percentageY > (100/numberOfNotes*5) && percentageY <= (100/numberOfNotes*6)){ noteArray[i].assignNote = "G4"; continue; }
        if(percentageY > (100/numberOfNotes*6) && percentageY <= (100/numberOfNotes*7)){ noteArray[i].assignNote = "F4"; continue; }
        if(percentageY > (100/numberOfNotes*7) && percentageY <= (100/numberOfNotes*8)){ noteArray[i].assignNote = "E4"; continue; }
        if(percentageY > (100/numberOfNotes*8) && percentageY <= (100/numberOfNotes*9)){ noteArray[i].assignNote = "D4"; continue; }
        if(percentageY > (100/numberOfNotes*9) && percentageY <= (100/numberOfNotes*10)){ noteArray[i].assignNote = "C4"; continue; }
        if(percentageY > (100/numberOfNotes*10) && percentageY <= (100/numberOfNotes*11)){ noteArray[i].assignNote = "B4"; continue; }
        if(percentageY > (100/numberOfNotes*11) && percentageY <= (100/numberOfNotes*12)){ noteArray[i].assignNote = "A4"; continue; }
        if(percentageY > (100/numberOfNotes*12) && percentageY <= (100/numberOfNotes*13)){ noteArray[i].assignNote = "G3"; continue; }
    }
    for(var i = 0; i < noteArray.length; i++){
        var adjustedX = noteArray[i].center.x-boundingBox.topLeft.x;
        var percentageX = adjustedX/boundingBox.width*100;
        noteArray[i].timing = percentageX;
    }
}

function setNoteTimers(){
    for(var i = 0; i < noteArray.length; i++){
        //setInterval(function(){alert("Hello")}, 3000);
    }
}