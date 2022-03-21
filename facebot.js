//The canvas is where I draw the hair and the background color. I keep these
//separate from the rest of the drawing so I don't have to color in the whole
//canvas for each frame
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext("2d");

//This canvas is where I draw the whole face, other than the hair
const canvasE = document.getElementById('editorCanvas')
const ctxE = canvasE.getContext("2d");

//The panel canvas is where I draw the randomized panels
const canvasP = document.getElementById('panelCanvas')
const ctxP = canvasP.getContext("2d");

//This container holds all the canvases and overlaps them
const container = document.getElementById('container')

//cb1 is the symmetry checkbox
const cb1 = document.getElementById('checkbox1')

//These are the basic dimensions of the canvas
const screenR = 1/2
const screenW = 1536
const screenH = 1024

canvas.width = screenW;
canvas.height = screenH;

canvasE.width = screenW;
canvasE.height = screenH;

canvasP.width = screenH/4;
canvasP.height = screenH;

//The pen is a turtle like object that takes in a theta, and draws a line in
//its direction relative to its last angle. I use it to draw the hair.
var pen = {
  x:500,
  y:500,
  theta:((1/20) * Math.PI),
  turnRate:0,
  gravity:5,
  acc:-20
}
pen.drawLine = function(theta) {

  ctx.strokeStyle = "#000000"
  ctx.lineWidth = 4

  this.theta += theta * Math.random() + this.turnRate

  this.x = this.x + 10 * Math.cos(this.theta)
  this.y = this.y + 10 * Math.sin(this.theta)

  this.y += this.gravity

  ctx.lineTo(this.x, this.y)

}

//The mouse object handles everything to do with the mouse interactions on screen
var mouse = {
  x:0,
  y:0,

  down:false,
  hold:false,
  rect:false,
  drag:false,

  xStart:0,
  yStart:0,

  xOffset:0,
  yOffest:0,

  selectSide:0,
  closest:null
}

//This Draws the select rectangle
mouse.drawSquare = function(){
  ctxE.beginPath()
  ctxE.fillStyle = "#FF0000"
  ctxE.globalAlpha = 0.5

  ctxE.fillRect(this.xStart, this.yStart, this.xOffset, this.yOffset)
  ctxE.globalAlpha = 1
}

//these functions help the mouse select the closest element on screen
mouse.getValidPoint = function(){
  let min = 1000
  let output
  let side

  for(let i=0; i<points.length; i++){
    if(getPtDist(points[i], mouse) <= min){
      output = points[i]
      min = getPtDist(points[i], mouse)
    }
  }

  if(min > 15) return(null)
  else{
    mouse.selectSide = output.side
    return(output)
  }
}
mouse.getValidLine = function(){
  if(lines.length == 0) return null

  let min = 1000
  let output
  let dist
  let coords

  for(let i=0; i<lines.length; i++){
    let data = getLineDist(mouse, lines[i])
    dist = data[0]
    coords = data[1]

    if(dist <= min){
      output = lines[i]
      min = dist
    }
  }

  if(min > 15) return(null)

  else{
    mouse.selectSide = Math.min(output.pt1.side, output.pt2.side)
    return(output)
  }
}
mouse.selectClosest = function(){
  let newSelect = this.getValidPoint()

  if(newSelect == null){
    newSelect = this.getValidLine()
  }

  if(newSelect != null){
    newSelect.select()
  }

  return(newSelect)
}

//These functions execute depending on whether the user is holding down the
//cursor or just clicking it
mouse.held = function(){
  if(mouse.down){

    mouse.hold = true

    if(mouse.closest != null) mouse.drag = true;

    else mouse.rect = true;
  }
}
mouse.click = function(e){
  mouse.selectClosest()

  for(let i=0; i<panel.length; i++){
    if(panel[i].checkHover()){
      panel[i].swap()
    }
  }
}

//updateCoords - updates mouse position

//updateStart - updates the mouse's starting point, to keep track of its
//offset when moving elements on screen

//updateOffset - updates mouse offset from mouse.start

//moveSelected - moves the selected points based on the offset of the mouse
mouse.updateCoords = function(){
  let rect = canvas.getBoundingClientRect();
  this.x = (event.clientX - rect.left) * (1/screenR),
  this.y = (event.clientY - rect.top) * (1/screenR)
}
mouse.updateStart = function(){
  this.xStart = this.x
  this.yStart = this.y
}
mouse.updateOffset = function(){
  this.xOffset = this.x - this.xStart
  this.yOffset = this.y - this.yStart
}
mouse.moveSelected = function(){
  for(let i=0; i<starterFace.selectArray.length; i++){
    if(starterFace.selectArray[i].className == "Point"){
      starterFace.selectArray[i].x = starterFace.selectArray[i].xStart + this.xOffset
      starterFace.selectArray[i].y = starterFace.selectArray[i].yStart + this.yOffset
    }
    if(starterFace.selectArray[i].className == "Line"){
      starterFace.selectArray[i].pt1.x = starterFace.selectArray[i].pt1.xStart + this.xOffset
      starterFace.selectArray[i].pt1.y = starterFace.selectArray[i].pt1.yStart + this.yOffset
      starterFace.selectArray[i].pt2.x = starterFace.selectArray[i].pt2.xStart + this.xOffset
      starterFace.selectArray[i].pt2.y = starterFace.selectArray[i].pt2.yStart + this.yOffset
    }
  }
}

//This checks for the delete key being pressed, and if so, deletes selected points
window.onkeydown = function() {
    var key = event.keyCode || event.charCode;
    if( key == 8 || key == 46 ) deleteFeatures()
};

//This runs when clicking the 'generate face' button on screen
function button1Press(){
  points = []
  lines = []

  starterFace = new Face(4, ctxE)
  shuffleHair()

  update()
}
//This checks the symmetry checkbox and updates if its checked/unchecked
function symmetrize(){
  symmetry = cb1.checked
  starterFace.x = starterFace.pts["face"][0].x

  update()
}

//These shuffle functions each relate to the ones on screen. When a button is
//pushed, it runs one of these
function shuffleNose(){
  for(let i=0; i<panel.length; i++){
    panel[i].part = "nose"
    panel[i].generateNose()
    panel[i].draw()
  }
  update()
}
function shuffleMouth(){
  for(let i=0; i<panel.length; i++){
    panel[i].part = "mouth"
    panel[i].generateMouth()
    panel[i].draw()
  }
  update()
}
function shuffleFace(){
  for(let i=0; i<panel.length; i++){
    panel[i].part = "face"
    panel[i].generateFace()
    panel[i].draw()
  }
  update()
}
function shuffleEyes(){
  for(let i=0; i<panel.length; i++){
    panel[i].part = "eyes"
    panel[i].generateEyes()
    panel[i].draw()
  }
  update()
}
function shuffleHair(){
  ctx.fillStyle = "#CCCCCC"
  ctx.fillRect(0,0,canvas.width, canvas.height)

  pen.gravity = 2 + Math.random() * 9
  pen.theta = Math.PI/2

  let newTheta = 3 - 6 * Math.random()
  let sparseness = Math.floor(Math.random() * 3) + 1
  let length = 50 + Math.random() * 25

  let start = (starterFace.hairCoords[0] - 50 * Math.random())
  let end = (starterFace.hairCoords[1] + 100 + 50 * Math.random())

  let arc =50 + Math.random() * 100

  let width = end - start

  let oldX = null
  let oldY = null

  for (let i=start; i<end; i+=sparseness){
    if(Math.random()>0.5){
      newTheta *= -1
    }

    newY = (Math.pow(((2 * (i - start))/width) - 1, 2))*arc
    newY += (i * 25 * scale)/width - 20 * scale
    newY += 10*scale - Math.random() * 20*scale
    newY += 100

    pen.x = i
    pen.y = newY

    ctx.beginPath()

    if(oldX!=null && oldY!=null){

      ctx.moveTo(oldX, oldY)
      ctx.lineTo(pen.x, pen.y + 10)
      ctx.stroke()

      ctx.beginPath()
    }
    else ctx.moveTo(pen.x, pen.y)

    oldX = pen.x
    oldY = pen.y

    for(let i=0; i<length; i++){
      pen.drawLine(newTheta)

      pen.y += pen.acc

      if(pen.acc > 0)pen.acc-=0.1
      pen.acc = Math.max(0, pen.acc)
    }
    ctx.stroke()
  }
}

//deletes selected features
function deleteFeatures(){
  for(let f=0; f<starterFace.types.length; f++){
    let feature = starterFace.types[f]
    let lineList = starterFace.lines[feature]


    for(let i = lineList.length-1; i>-1; i--){
      let line = lineList[i]

      if(line.selected || line.pt1.selected || line.pt2.selected){

        let area = [starterFace.lines[feature], line.pt1.lines, line.pt2.lines]

        for(let j=0; j<area.length; j++){
          area[j].splice(area[j].indexOf(line), 1)
        }
      }
    }

    let ptList = starterFace.pts[feature]

    for(let i = ptList.length-1; i>-1; i--){
      let pt = ptList[i]

      if(pt.selected){
        area = [starterFace.pts[feature]]
        if(pt.sibling != null){
          pt.sibling.sibling = null
        }

        for(let j=0; j<area.length; j++){
          area[j].splice(area[j].indexOf(pt), 1)
        }
      }
    }
  }
  starterFace.concatStuff()
  update()
}

//draws a circle (used to be an X) where a point is
function drawX(x, y, color, outline){

  if(outline){
    ctxE.lineWidth = 14
    ctxE.strokeStyle = "#FFFF00";

    ctxE.beginPath()
    ctxE.arc(x, y, 4, 0, 2*Math.PI);
    ctxE.stroke();
  }

  ctxE.lineWidth = 6


  ctxE.beginPath()
  ctxE.strokeStyle = color;
  ctxE.fillStyle = color;
  ctxE.arc(x, y, 4, 0, 2*Math.PI);
  ctxE.closePath()
  ctxE.fill()
  ctxE.stroke();

  ctxE.lineWidth = 4

}

//gets distance from the mouse to an element
function getPtDist(pt1, pt2){
  let dist = (
    Math.sqrt(
      Math.pow(pt1.x - pt2.x, 2) + Math.pow(pt1.y - pt2.y, 2)
    )
  )

  return(dist)
}
function getLineDist(pt, line){
  let x1 = line.pt1.x;
  let x2 = line.pt2.x;
  let y1 = line.pt1.y;
  let y2 = line.pt2.y;
  let px = pt.x
  let py = pt.y

  let m1 = (y1 - y2)/(x1 - x2)
  let m2 = -(1/m1)

  let b1 = y1 - x1 * m1
  let b2 = py - px * m2

  let finX = (b2 - b1) / (m1 - m2)
  let finY = m1 * finX + b1

  let dist = Math.sqrt(
    Math.pow(finX - px, 2) + Math.pow(finY - py, 2)
  )

  if((finX < Math.min(x1, x2) || finX > Math.max(x1, x2)) &&
  (finY < Math.min(y1, y2) || finY > Math.max(y1, y2))){
    if(getPtDist(pt, line.pt1) < getPtDist(pt, line.pt2)){
      dist = (getPtDist(pt, line.pt1))
      finX = line.pt1.x
      finY = line.pt1.y
    }

    else{
      dist = (getPtDist(pt, line.pt2))
      finX = line.pt2.x
      finY = line.pt2.y
    }
  }



  return([dist, [finX, finY]])
}

//checks if a point is in a rectangle
function isInRect(px, py, rx, ry, rw, rh){
  if(rw<0){
    rx = rx + rw
    rw = Math.abs(rw)
  }

  if(rh<0){
    ry = ry + rh
    rh = Math.abs(rh)
  }

  return(
    (px >= rx) && (px <= rx + rw) && (py >= ry) && (py <= ry + rh)
  )
}

//self explanatory
function drawSymmetryLine(){
  ctxE.beginPath()
  ctxE.strokeStyle = "#FF0000";
  ctxE.lineWidth = 4;
  ctxE.moveTo(starterFace.x, starterFace.y - 100*starterFace.scale)
  ctxE.lineTo(starterFace.x, starterFace.y + 400 * starterFace.scale)
  ctxE.stroke()
}

//updates the starting coordinates of the mouse and all points
function updateStarts(){

  mouse.updateCoords()
  mouse.updateStart()
  starterFace.updateStarts()
}

//used for generating random facial features
function getRandPt(start, minOffset, maxOffset){
  return(start + (minOffset + Math.random() * (maxOffset - minOffset)) * scale)
}

//given an x coordinate and two points, it finds the y coordinate on the line
//between the points
function getYOnLine(xOut, pt1, pt2){
  let m = (pt1.y - pt2.y)/(pt1.x-pt2.x)
  let b = pt1.y - (m * pt1.x)

  let yOut = m * xOut + b

  return yOut
}

var starterFace
var scale = 3
var symmetry

//I store all of the points and lines here
var points = [];
var lines = [];

//this is where the left panels are stored
var panel = []

panel[0] = new MiniPic(0, 0)
panel[1] = new MiniPic(0, 256)
panel[2] = new MiniPic(0, 512)
panel[3] = new MiniPic(0, 768)

//These functions run when the mouse is pressed, moved, or unpressed respectively
function mouseDown(){
  mouse.closest = mouse.selectClosest()

  mouse.down = true;

  if(!event.shiftKey){
    starterFace.deselectAll()
  }

  setTimeout(mouse.held, 200)

  mouse.click(event)

  mouse.updateCoords()
  mouse.updateOffset()
  updateStarts()

  update()
}
function mouseMove(){
  mouse.updateCoords()

  if(mouse.hold){
    mouse.drawSquare()
    mouse.updateOffset()
  }

  if(mouse.drag){
    mouse.moveSelected()
  }

  if(mouse.rect){
    mouse.drawSquare()
    starterFace.updatePts()
  }

  update()

}
function mouseUp(){
  mouse.xOffset = 0;
  mouse.yOffset = 0;

  mouse.hold = false;
  mouse.down = false;
  mouse.drag = false;
  mouse.rect = false;

  update()

}

//this is the main function that updates everything in order
function update(){
  ctxE.clearRect(0,0,canvas.width, canvas.height)

  starterFace.updateFeatureCoords()

  if(symmetry){
    starterFace.updateSymmetry()
  }

  starterFace.draw()
  starterFace.drawPts()

  if(mouse.rect){
    mouse.drawSquare()
  }

  if(symmetry){
    drawSymmetryLine()
  }

  panel[0].draw()
  panel[1].draw()
  panel[2].draw()
  panel[3].draw()
}

button1Press()
shuffleFace()
