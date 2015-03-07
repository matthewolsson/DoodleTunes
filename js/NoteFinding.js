"use strict"

function findAllPixelsInNote(startingPixel,imageData,noteArray){ // finds and stores the rest of the pixels in a note
    var notePixels = [];
    var note = {left:0,right:0,top:0,bottom:0,center:0};
    examineRow(startingPixel,imageData,notePixels);
    setNoteValues(note,notePixels,imageData);
    // continue onto next row
}

function setNoteValues(note,notePixels,imageData){
    for(var i = 0; i < notePixels; i++){
        if(((notePixels[i]/(imageData.width*4) < note.top) || (note.top === 0)){note.top = (notePixels[i]/(imageData.width*4);}
        if((notePixels[i]/(imageData.width*4) > note.bottom){note.bottom = (notePixels[i]/(imageData.width*4);}
        if((((notePixels[i]%(imageData.width*4))/4) < note.left) || (note.left === 0)){note.left = (notePixels[i]%(imageData.width*4))/4);}
        if(((notePixels[i]%(imageData.width*4))/4) > note.right){note.right = (notePixels[i]%(imageData.width*4))/4);}
    }
}

function examineRow(startingPixel,imageData,notePixels){
    notePixels.push(startingPixel); // stores the first (found) pixel in the row

    LookRight(startingPixel+4,imageData,notePixels); // stores the rest of the pixels to the left and right
    LookLeft(startingPixel-4,imageData,notePixels);
}

function LookLeft(pixel,imageData,notePixels){
    notePixels.push(pixel);
    if(testForNotePixel(imageData.data[pixel-4])){ // if the pixel to the right is part of the note
        LookRight(pixel-4,doneLookingLeft,imageData);
    }
}
function LookRight(pixel,imageData,notePixels){
    notePixels.push(pixel);
    if(testForNotePixel(imageData.data[pixel+4])){ // if the pixel to the left is part of the note
        LookRight(pixel+4,doneLookingRight,imageData);
    }
}