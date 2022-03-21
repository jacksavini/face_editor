//this class keeps track of the points
class Point {
  constructor(x, y, context, type, side){
    this.className = "Point"

    this.x = x;
    this.y = y;
    this.fType = type
    this.side = side
    this.ctx = context;

    this.sibling = null;
    this.shiftRight = false
    this.centered = false

    this.xStart = x;
    this.yStart = y;

    this.selected = false;

    this.lines = []
    this.pts = []

    this.color = "#000000"
  }

  select(){
    if(!this.selected){
      starterFace.selectArray.push(this)
      this.selected = true;
    }
  }

  deselect(){
    if(this.selected){
      starterFace.selectArray.splice(starterFace.selectArray.indexOf(this), 1)
      this.selected = false;
    }
  }

  //checks if the point is in the mouse's select rectangle
  checkRect(){
    if(isInRect(this.x, this.y, mouse.xStart, mouse.yStart, mouse.xOffset, mouse.yOffset)){
      this.select()
    }

    else{
      if(this.sibling==null || !isInRect(this.sibling.x, this.sibling.y, mouse.xStart, mouse.yStart, mouse.xOffset, mouse.yOffset)){
        this.deselect()
      }
    }
  }

  draw(){
    let outline = false
    if(this.selected) {
      this.color = "#0000FF"
      outline = true
    }

    else{
      this.color = "#000000"

      for(let i=0; i<this.lines.length; i++){
        if(this.lines[i].selected) this.color = "#FF0000"
      }
    }
    if(!(this.color=="#000000")){
      drawX(this.x, this.y, this.color, outline)
    }
  }
}

//this class keeps track of the lines
class Line {
  constructor(pt1, pt2){
    this.pt1 = pt1;
    this.pt2 = pt2;

    pt1.lines.push(this)
    pt2.lines.push(this)

    this.ctx = ctxE

    this.color = "#000000";
    this.width = 4;

    this.className = "Line"

    this.selected = false
  }

  select(){
    if(!this.selected){
      starterFace.selectArray.push(this)
      this.selected = true;
    }
  }

  deselect(){
    if(this.selected){
      starterFace.selectArray.splice(starterFace.selectArray.indexOf(this), 1)
      this.selected = false;
    }
  }

  draw(){
    let sCnt = 0
    if(this.pt1.selected) sCnt++
    if(this.pt2.selected) sCnt++

    if(sCnt==0) this.color = "#000000"
    if(sCnt==1) this.color = "#FF0000"
    if(sCnt==2 || this.selected) this.color = "#0000FF"

    if(sCnt == 2 || this.selected){
      this.ctx.lineWidth = 14
      this.ctx.strokeStyle = "#FFFF00"
      this.ctx.beginPath()
      this.ctx.moveTo(this.pt1.x, this.pt1.y)
      this.ctx.lineTo(this.pt2.x, this.pt2.y)
      this.ctx.stroke()
    }

    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.width;

    this.ctx.beginPath()
    this.ctx.moveTo(this.pt1.x, this.pt1.y)
    this.ctx.lineTo(this.pt2.x, this.pt2.y)
    this.ctx.stroke()
  }
}

//this class is for the panels on the left of the screen
class MiniPic {
  constructor(x, y, w, h){
    this.color = "#DDDDDD"
    this.x = x;
    this.y = y;

    this.w = canvasP.width;
    this.h = canvasP.width;

    this.part = "mouth"

    this.pts = []
    this.lines = []

    this.hover = false

  }

  //self explanatory
  generateNose(){
    this.pts = []
    this.lines = []

    let x = this.x + this.w/2
    let y = this.y + 32
    //ptNum = 3 + Math.floor(Math.random() * 2)
    this.pts.push({
      x:x,
      y:y,
      side:2,
      sibling:null
    })


    let rpx1 = x - 64 * Math.random()
    let rpy1 = y + 64 + 64 * Math.random()

    let rpx2 = rpx1 + 24 - Math.random() * 64
    let rpy2 = rpy1 + 64 * Math.random()

    this.pts.push({x:rpx1, y:rpy1, side:2, sibling:null})
    this.pts.push({x:rpx2, y:rpy2, side:2, sibling:null})
    this.pts.push({x:x + 20, y:y + 128, side:2, sibling:null})

    this.lines.push({
      pt1:0,
      pt2:1
    })

    this.lines.push({
      pt1:1,
      pt2:2
    })

    this.lines.push({
      pt1:2,
      pt2:3
    })


  }

  generateMouth(){
    this.pts = []
    this.lines = []

    let x = this.x + this.w/2
    let y = this.y + 128
    //ptNum = 3 + Math.floor(Math.random() * 2)
    this.pts.push({x:x, y:y, side:2,
sibling:null})

    let l = this.pts.length

    this.pts.push({
      x:getRandPt(x, -25, -5),
      y:getRandPt(y, -6, 6),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -10, 0),
      y:getRandPt(this.pts[l-1].y, -6, 6),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -10, 0),
      y:getRandPt(this.pts[l-1].y, -6, 6),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(x, -12, -2),
      y:getRandPt(y, -6, 0),
      side:0,
sibling:null
    })

    this.pts.push({
      x:x,
      y:getRandPt(y, 0, 10),
      side:2,
sibling:null
    })

    let newPts = []

    for(let i=4; i>0; i--){
      this.pts.push({
        x:2 * x - this.pts[i].x,
        y:this.pts[i].y,
        side:1,
sibling:i
      })

      this.pts[i].sibling = this.pts.length - 1
    }

    this.lines.push({
      pt1:3,
      pt2:2
    })

    this.lines.push({
      pt1:2,
      pt2:1
    })

    this.lines.push({
      pt1:1,
      pt2:0
    })

    this.lines.push({
      pt1:0,
      pt2:9
    })

    this.lines.push({
      pt1:9,
      pt2:8
    })

    this.lines.push({
      pt1:8,
      pt2:7
    })

    this.lines.push({
      pt1:0,
      pt2:4
    })

    this.lines.push({
      pt1:4,
      pt2:1
    })

    this.lines.push({
      pt1:0,
      pt2:6
    })

    this.lines.push({
      pt1:6,
      pt2:9
    })

    this.lines.push({
      pt1:1,
      pt2:5
    })

    this.lines.push({
      pt1:5,
      pt2:9
    })
  }

  generateFace(){
    this.pts = []
    this.lines = []
    scale = 1

    let x = this.x + this.w/2
    let y = this.y + 32
    //ptNum = 3 + Math.floor(Math.random() * 2)
    this.pts.push({x:x, y:y, side:2,
sibling:null})

    let l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -50, -30),
      y:getRandPt(this.pts[l-1].y, -15, 15),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -25, 0),
      y:getRandPt(this.pts[l-1].y, 0, 25),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -20, 20),
      y:getRandPt(this.pts[l-1].y, 25, 37),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -12, 0),
      y:getRandPt(this.pts[l-1].y, 25, 37),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -12, 13),
      y:getRandPt(this.pts[l-1].y, 0, 6),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, -12, 38),
      y:getRandPt(this.pts[l-1].y, 25, 37),
      side:0,
sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:x,
      y:getRandPt(this.pts[l-1].y, 0, 50),
      side:2,
sibling:null
    })

    for(let i=6; i>0; i--){
      this.pts.push({
        x:2 * x - this.pts[i].x,
        y:this.pts[i].y,
        side:1,
sibling:i
      })
      this.pts[i].sibling = this.pts.length - 1
    }

    for(let i=0; i<this.pts.length - 1; i++){
      this.lines.push({
        pt1:i,
        pt2:i+1
      })
    }

    this.lines.push({
      pt1:this.pts.length - 1,
      pt2:0
    })

    scale = 3

  }

  generateEyes(){
    scale = 1
    this.pts = []
    this.lines = []

    let x = this.x + this.w/2
    let y = this.y + 128

    this.pts.push({
      x:x - 10,
      y:y,
      side:0,
      sibling:null
    })

    let l = this.pts.length

    this.pts.push({
      x:getRandPt(this.pts[l-1].x, 0, -86),
      y:getRandPt(this.pts[l-1].y, 0, -32),
      side:0,
      sibling:null
    })

    l = this.pts.length

    this.pts.push({
      x:32,
      y:getRandPt(y, -25, 25),
      side:0,
      sibling:null
    })

    let yOff = getRandPt(0, 5, 25)

    this.pts.push({
      x:this.pts[1].x,
      y:this.pts[1].y + yOff,
      side:0,
      sibling:null
    })

    let tempX = this.pts[2].x + Math.random() * (this.pts[1].x - this.pts[2].x)

    this.pts.push({
      x:tempX,
      y:getYOnLine(tempX, this.pts[1], this.pts[2]) + yOff,
      side:0,
      sibling:null
    })

    tempX = this.pts[4].x + Math.random() * (this.pts[0].x - this.pts[4].x)
    l = this.pts.length

    this.pts.push({
      x:tempX,
      y:getRandPt(this.pts[l - 1].y, 0, 32),
      side:0,
      sibling:null
    })

    tempX = this.pts[1].x + Math.random() * (this.pts[0].x - this.pts[1].x)
    l = this.pts.length

    this.pts.push({
      x:tempX,
      y:getYOnLine(tempX, this.pts[0], this.pts[1]) + yOff,
      side:0,
      sibling:null
    })



    for(let i=6; i>-1; i--){
      this.pts.push({
        x:2 * x - this.pts[i].x,
        y:this.pts[i].y,
        side:1,
        sibling:i
      })

      this.pts[i].sibling = this.pts.length - 1
    }

    this.lines.push({
      pt1:0,
      pt2:1
    })

    this.lines.push({
      pt1:1,
      pt2:2
    })

    this.lines.push({
      pt1:3,
      pt2:4
    })

    this.lines.push({
      pt1:4,
      pt2:5
    })

    this.lines.push({
      pt1:5,
      pt2:6
    })

    this.lines.push({
      pt1:6,
      pt2:3
    })

    this.lines.push({
      pt1:7,
      pt2:8
    })

    this.lines.push({
      pt1:8,
      pt2:9
    })

    this.lines.push({
      pt1:9,
      pt2:10
    })

    this.lines.push({
      pt1:10,
      pt2:7
    })

    this.lines.push({
      pt1:11,
      pt2:12
    })

    this.lines.push({
      pt1:12,
      pt2:13
    })

    scale = 3
  }

  //checks if the mouse is hovering over the element, so it is selected when
  //the mouse clicks
  checkHover(){
    if(isInRect(mouse.x, mouse.y, this.x, this.y, this.w, this.h)){
      this.hover = true
      return true
    }

    else{
      this.hover = false
      return false
    }
  }

  //draws the panels on the left
  draw(){

    ctxP.fillStyle = this.color
    ctxP.strokeStyle = "#000000"
    ctxP.lineWidth = 4

    ctxP.beginPath()
    ctxP.moveTo(this.x, this.y)
    ctxP.lineTo(this.x, this.y + this.h)
    ctxP.lineTo(this.x + this.w, this.y + this.h)
    ctxP.lineTo(this.x + this.w, this.y)
    ctxP.closePath()
    ctxP.fill()
    ctxP.stroke()

    ctxP.beginPath()

    let pt1
    let pt2

    for(let i=0; i<this.lines.length; i++){
      pt1 = this.pts[ this.lines[i].pt1 ]
      pt2 = this.pts[ this.lines[i].pt2 ]

      ctxP.moveTo(pt1.x, pt1.y)
      ctxP.lineTo(pt2.x, pt2.y)
    }

    ctxP.stroke()
  }

  //converts coordinates from the panels to coordinates on the canvas
  placeFeatures(start, xScale, yScale){
    let ptList = []

    let newX
    let newY

    for(let i=0; i<this.pts.length; i++){
      newX = start[0] + (this.pts[i].x - this.pts[0].x) * xScale
      newY = start[1] + (this.pts[i].y - this.pts[0].y) * yScale

      ptList.push(new Point(
        newX,
        newY,
        ctxE,
        this.part,
        this.pts[i].side
      ))

      if(this.part == "face" && i > 7){
        ptList[i].x += (20 * starterFace.scale)
        ptList[i].shiftRight = true
      }

      if(this.part == "eyes" && i > 6){
        ptList[i].x = starterFace.x * 2 - ptList[13 - i].x
      }

      if(this.part == "nose" && i == 3){
        ptList[i].x = starterFace.x
      }

      if(this.pts[i].side == 2 && ptList[i].x == starterFace.x){
        ptList[i].centered = true
      }

      ptList[i].sibling = ptList[this.pts[i].sibling]
    }

    for(let i=0; i<this.pts.length; i++){
      ptList[i].sibling = ptList[this.pts[i].sibling]
    }

    starterFace.pts[this.part] = ptList

    for(let i=0; i<this.lines.length; i++){
      let pt1 = ptList[this.lines[i].pt1]
      let pt2 = ptList[this.lines[i].pt2]

      starterFace.lines[this.part].push(new Line(
        pt1,
        pt2
      ))
    }

    starterFace.concatStuff()
  }

  //deletes a facial feature on screen and replaces is
  swap(){
    let part = this.part

    starterFace.pts[part] = []
    starterFace.lines[part] = []

    let xScale
    let yScale
    let coords

    if(part == "nose"){
      xScale = (starterFace.noseCoords[1][1] - starterFace.noseCoords[0][1])/128
      yScale = xScale
      coords = starterFace.noseCoords[0]
    }

    if(part == "mouth"){
      xScale = starterFace.scale/4
      yScale = xScale
      coords = starterFace.mouthCoords
    }

    if(part == "face"){
      coords = starterFace.faceCoords
      xScale = (starterFace.faceWidth/(this.pts[12].x - this.pts[2].x))
      yScale = (starterFace.faceHeight/(this.pts[7].y - this.pts[0].y))
    }

    if(part == "eyes"){
      xScale = starterFace.eyeScale
      yScale = xScale
      coords = starterFace.noseCoords[0]
    }

    this.placeFeatures(coords, xScale, yScale)
    starterFace.updateFeatureCoords()
  }
}

//this class handles all the elements put together
class Face {
  constructor(scale, context){
    this.x = canvas.width/2;
    this.y = 300;

    this.ctx = context;
    this.scale = scale

    this.types = ["face", "mouth", "eyes", "nose", "ear"]

    this.pts = {
      "face":[],
      "mouth":[],
      "nose":[],
      "eyes":[],
      "ear":[]
    }
    this.lines = {
      "face":[],
      "mouth":[],
      "nose":[],
      "eyes":[],
      "ear":[]
    }

    this.selectArray = []

    this.getData()
  }

  //getData() is where the random generation happens. It's very long, since each
  //point is unique in how and where its created in relation to others
  getData(){

    this.pts["face"].push(new Point(this.x, this.y, this.ctx, "face", 2))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][0].x, -70, -50),
      getRandPt(this.pts["face"][0].y, -15, 15),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][1].x, -25, 0),
      getRandPt(this.pts["face"][1].y, 0, 25),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][2].x, -20, 20),
      getRandPt(this.pts["face"][2].y, 25, 37),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][3].x, -12, 0),
      getRandPt(this.pts["face"][3].y, 25, 37),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][4].x, -12, 13),
      getRandPt(this.pts["face"][4].y, 0, 6),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      getRandPt(this.pts["face"][5].x, -12, 38),
      getRandPt(this.pts["face"][5].y, 25, 37),
      this.ctx,
      "face",
      0
    ))

    this.pts["face"].push(new Point(
      this.x,
      getRandPt(this.pts["face"][6].y, 0, 50),
      this.ctx,
      "face",
      2
    ))

    for(let i=6; i>0; i--){
      this.pts["face"].push(new Point(
        this.x + (this.x - this.pts["face"][i].x),
        this.pts["face"][i].y,
        this.ctx,
        this.pts["face"][i].fType,
        1
      ))

      this.pts["face"][i].sibling = this.pts["face"][this.pts["face"].length - 1]
      this.pts["face"][this.pts["face"].length - 1].sibling = this.pts["face"][i]

      this.pts["face"][i].shiftRight = true;
      this.pts["face"][i].x += (20 * this.scale)
    }

    for(let i=1; i<this.pts["face"].length; i++){
      this.lines["face"].push(new Line(this.pts["face"][i-1], this.pts["face"][i]))
    }

    this.lines["face"].push(new Line(this.pts["face"][13], this.pts["face"][0]))

    //mouth start

    this.pts["mouth"].push(new Point(
      this.x,
      getRandPt(this.pts["face"][5].y, 0, 25),
      this.ctx,
      "mouth",
      2
    ))

    this.pts["mouth"].push(new Point(
      getRandPt(this.x, -5, -25),
      getRandPt(this.pts["mouth"][this.pts["mouth"].length - 1].y, -6, 6),
      this.ctx,
      "mouth",
      0
    ))

    this.pts["mouth"].push(new Point(
      getRandPt(this.pts["mouth"][this.pts["mouth"].length - 1].x, 0, -10),
      getRandPt(this.pts["mouth"][this.pts["mouth"].length - 1].y, -6, 6),
      this.ctx,
      "mouth",
      0
    ))

    this.pts["mouth"].push(new Point(
      getRandPt(this.pts["mouth"][this.pts["mouth"].length - 1].x, 0, -10),
      getRandPt(this.pts["mouth"][this.pts["mouth"].length - 1].y, -6, 6),
      this.ctx,
      "mouth",
      0
    ))

    this.pts["mouth"].push(new Point(
      getRandPt(this.x, -2, -12),
      getRandPt(this.pts["mouth"][0].y, 0, -6),
      this.ctx,
      "mouth",
      0
    ))

    this.pts["mouth"].push(new Point(
      this.x,
      getRandPt(this.pts["mouth"][0].y, 0, 10),
      this.ctx,
      "mouth",
      2
    ))

    for(let i=4; i>0; i--){
      this.pts["mouth"].push(new Point(
        this.x + (this.x - this.pts["mouth"][i].x),
        this.pts["mouth"][i].y,
        this.ctx,
        this.pts["mouth"][i].fType,
        1
      ))

      this.pts["mouth"][i].sibling = this.pts["mouth"][this.pts["mouth"].length - 1]
      this.pts["mouth"][this.pts["mouth"].length - 1].sibling = this.pts["mouth"][i]
    }

    for(let i=0; i<3; i++){
      this.lines["mouth"].push(new Line(this.pts["mouth"][i], this.pts["mouth"][i+1]))
    }

    this.lines["mouth"].push(new Line(this.pts["mouth"][0], this.pts["mouth"][9]))

    for(let i=9; i>7; i--){
      this.lines["mouth"].push(new Line(this.pts["mouth"][i], this.pts["mouth"][i-1]))
    }

    this.lines["mouth"].push(new Line(this.pts["mouth"][1], this.pts["mouth"][4]))
    this.lines["mouth"].push(new Line(this.pts["mouth"][4], this.pts["mouth"][0]))

    this.lines["mouth"].push(new Line(this.pts["mouth"][9], this.pts["mouth"][6]))
    this.lines["mouth"].push(new Line(this.pts["mouth"][6], this.pts["mouth"][0]))

    this.lines["mouth"].push(new Line(this.pts["mouth"][1], this.pts["mouth"][5]))
    this.lines["mouth"].push(new Line(this.pts["mouth"][5], this.pts["mouth"][9]))

    //nose

    this.pts["nose"].push(new Point(
      this.x - 5 * this.scale,
      this.pts["face"][3].y,
      this.ctx,
      "nose",
      2
    ))

    this.pts["nose"].push(new Point(
      getRandPt(this.pts["nose"][0].x, -12, 0),
      getRandPt(this.pts["nose"][0].y, 20, 45),
      this.ctx,
      "nose",
      2
    ))

    this.pts["nose"].push(new Point(
      this.x,
      getRandPt(this.pts["mouth"][0].y, -15, 0),
      this.ctx,
      "nose",
      2
    ))

    this.lines["nose"].push(new Line(this.pts["nose"][0], this.pts["nose"][1]))
    this.lines["nose"].push(new Line(this.pts["nose"][1], this.pts["nose"][2]))

    //brows
    this.pts["eyes"][0] = new Point(
      this.pts["nose"][0].x,
      this.pts["nose"][0].y,
      this.ctx,
      "eyes",
      0
    )

    this.pts["eyes"][1] = new Point(
      getRandPt(this.pts["eyes"][0].x, 0, -37),
      getRandPt(this.pts["eyes"][0].y, 0, -25),
      this.ctx,
      "eyes",
      0
    )

    let tempX = this.pts["face"][2].x + Math.random() * (this.pts["face"][3].x - this.pts["face"][2].x)

    this.pts["eyes"][2] = new Point(
      tempX,
      getYOnLine(tempX, this.pts["face"][2], this.pts["face"][3]),
      this.ctx,
      "eyes",
      0
    )

    this.pts["eyes"][3] = new Point(
      this.pts["eyes"][1].x,
      this.pts["eyes"][1].y + 5 * this.scale,
      this.ctx,
      "eyes",
      0
    )

    tempX = this.pts["eyes"][2].x + Math.random() * (this.pts["eyes"][1].x - this.pts["eyes"][2].x)

    this.pts["eyes"][4] = new Point(
      tempX,
      getYOnLine(tempX, this.pts["eyes"][1], this.pts["eyes"][2]) + 5 * this.scale,
      this.ctx,
      "eyes",
      0
    )

    tempX = this.pts["eyes"][1].x + Math.random() * (this.pts["eyes"][0].x - this.pts["eyes"][1].x)

    this.pts["eyes"][6] = new Point(
      tempX,
      getYOnLine(tempX, this.pts["eyes"][0], this.pts["eyes"][1]) + 5 * this.scale,
      this.ctx,
      "eyes",
      0
    )

    tempX = this.pts["eyes"][2].x + Math.random() * (this.pts["eyes"][0].x - this.pts["eyes"][2].x)

    this.pts["eyes"][5] = new Point(
      tempX,
      getRandPt(Math.max(this.pts["eyes"][4].y, this.pts["eyes"][6].y), 0, 20),
      this.ctx,
      "eyes",
      0
    )

    for(let i=6; i>-1; i--){
      this.pts["eyes"].push(new Point(
        this.x + (this.x - this.pts["eyes"][i].x),
        this.pts["eyes"][i].y,
        this.ctx,
        this.pts["eyes"][i].fType,
        1
      ))

      this.pts["eyes"][i].sibling = this.pts["eyes"][this.pts["eyes"].length - 1]
      this.pts["eyes"][this.pts["eyes"].length - 1].sibling = this.pts["eyes"][i]
    }

    for(let i=0; i<7; i++){
      if(i!=2 && i!=6){
        this.lines["eyes"].push(new Line(this.pts["eyes"][i], this.pts["eyes"][i+1]))
        this.lines["eyes"].push(new Line(this.pts["eyes"][13 - i], this.pts["eyes"][13 - (i+1)]))
      }
    }
    this.lines["eyes"].push(new Line(this.pts["eyes"][3], this.pts["eyes"][6]))
    this.lines["eyes"].push(new Line(this.pts["eyes"][7], this.pts["eyes"][10]))

    let xMax = 0

    for(let i=0; i<this.pts["face"].length; i++){
      xMax = Math.max(xMax, this.pts["face"][i].x)
    }

    this.pts["ear"].push(new Point(
      getRandPt(xMax, 5, 10),
      getRandPt(this.pts["face"][3].y, 0, 5),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][0].x, -2, 2),
      getRandPt(this.pts["ear"][0].y, 10, 15),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][1].x, 5, 15),
      getRandPt(this.pts["ear"][1].y, 5, 10),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][2].x, 6, 12),
      getRandPt(this.pts["ear"][2].y, -10, -5),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][3].x, 0, -5),
      getRandPt(this.pts["ear"][3].y, -6, -12),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][4].x, 0, 6),
      getRandPt(this.pts["ear"][4].y, -5, -10),
      this.ctx,
      "ear",
      2
    ))

    this.pts["ear"].push(new Point(
      getRandPt(this.pts["ear"][5].x, -5, -20),
      getRandPt(this.pts["ear"][5].y, -10, 5),
      this.ctx,
      "ear",
      2
    ))

    for(let i=0; i<6; i++){
      this.lines["ear"].push(new Line(this.pts["ear"][i], this.pts["ear"][i+1]))
    }

    this.lines["ear"].push(new Line(this.pts["ear"][6], this.pts["ear"][0]))

    this.pts["face"][0].centered = true
    this.pts["face"][7].centered = true
    this.pts["mouth"][0].centered = true
    this.pts["mouth"][5].centered = true
    this.pts["nose"][2].centered = true

    this.updateFeatureCoords()
    this.concatStuff()
    this.updateSymmetry()
  }

  //updates the coordinates of where features should be placed when selected
  //from a panel
  updateFeatureCoords(){
    if(this.pts["face"].length == 14 && this.pts["eyes"].length == 14){
      this.faceWidth = (this.pts["face"][0].x - this.pts["eyes"][2].x)*2
      this.faceHeight = (this.pts["face"][7].y - this.pts["face"][0].y)

      this.faceCoords = [
        this.pts["face"][0].x,
        this.pts["face"][0].y
      ]

      let avgW = this.pts["face"][0].x-(this.pts["face"][2].x + this.pts["face"][3].x)/2
      this.eyeScale = (avgW)/96

      this.hairCoords = [this.pts["face"][2].x, this.pts["face"][12].x]
    }

    if(this.pts["mouth"].length == 10){
      this.mouthCoords = [this.pts["mouth"][0].x, this.pts["mouth"][0].y]
    }

    if(this.pts["nose"].length >= 3){
      let noseBottom = this.pts["nose"][this.pts["nose"].length - 1]

      this.noseCoords = [
        [this.pts["nose"][0].x, this.pts["nose"][0].y],
        [noseBottom.x, noseBottom.y]
      ]
    }
  }

  //concatenates the Face's internal lists into the global "points" & "lines" lists
  concatStuff(){
    points = []
    lines = []

    for(let i=0; i<this.types.length; i++){
      points = points.concat(this.pts[this.types[i]])
      lines = lines.concat(this.lines[this.types[i]])
    }
  }

  //this updates the symmetry on the opposite side of the users selected point
  updateSymmetry(){
    let lineSelect
    let side
    let l = points.length

    for(let i=0; i<l; i++){
      side = points[i].side
      lineSelect = false

      if(side != 2){

        for(let j=0; j<points[i].lines.length; j++){
          if(points[i].lines[j].selected) lineSelect = true
        }

        if((points[i].selected || lineSelect) && points[i].sibling != null){

          points[i].sibling.x = this.x + (this.x - points[i].x)
          points[i].sibling.y = points[i].y

          if(points[i].shiftRight || points[i].sibling.shiftRight){
            points[i].sibling.x += (20 * this.scale)
          }
        }
      }

      else{
        for(let j=0; j<points[i].lines.length; j++){
          if(points[i].lines[j].selected) lineSelect = true
        }

        if((points[i].selected || lineSelect) && points[i].centered){
          points[i].x = this.x
        }
      }
    }
  }

  //checks to see if points are in the rectangle to be selected
  updatePts(){
    for(let i=0; i<points.length; i++){
      points[i].checkRect()
    }
  }

  //draws the points when theyre selected
  drawPts(){
    for(let i=0; i<points.length; i++){
      points[i].draw()
    }
  }

  //fills in parts of the face that need it
  fillShape(ptArr, color){
    ctxE.fillStyle = color;

    ctxE.beginPath()
    ctxE.moveTo(ptArr[0].x, ptArr[0].y)

    for(let i=1; i<ptArr.length; i++){
      ctxE.lineTo(ptArr[i].x, ptArr[i].y)
    }

    ctxE.closePath()
    ctxE.fill()
  }

  //deselects all elements
  deselectAll(){
    while(this.selectArray.length > 0){
      this.selectArray[0].deselect()
    }
  }

  //updates the start position of all points
  updateStarts(){
    for(let i=0; i<points.length; i++){
      points[i].xStart = points[i].x;
      points[i].yStart = points[i].y;
    }
  }

  //draws the face.
  draw(){
    for(let i=0; i<this.types.length; i++){
      let type = this.types[i]

      if(type == "face" && this.pts["face"].length > 0 ||
      type == "nose" && this.pts["nose"].length > 0 ||
      type == "ear" && this.pts["ear"].length > 0){
        this.fillShape(this.pts[type], "#FFFFFF")
      }

      if(type == "mouth" && this.pts["mouth"].length == 10){
        this.fillShape([this.pts[type][0], this.pts[type][1], this.pts[type][4]], "#FFFFFF")
        this.fillShape([this.pts[type][9], this.pts[type][0], this.pts[type][6]], "#FFFFFF")
        this.fillShape([this.pts[type][1], this.pts[type][5],
          this.pts[type][9], this.pts[type][0]], "#FFFFFF")
      }

      if(type == "eyes" && this.pts["eyes"].length == 14){
        this.fillShape([this.pts[type][3], this.pts[type][4],
          this.pts[type][5], this.pts[type][6]], "#FFFFFF")

        this.fillShape([this.pts[type][7], this.pts[type][8],
          this.pts[type][9], this.pts[type][10]], "#FFFFFF")
      }

      for(let j=0; j<this.lines[type].length; j++){
        this.lines[type][j].draw()
      }
    }
  }
}
