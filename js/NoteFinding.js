"use strict"

function findAllPixelsInNote(startingPixel){ // finds and stores the rest of the pixels in a note
    note = {left:0,right:0,top:0,bottom:0,center:0};
    examineRows(startingPixel);
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