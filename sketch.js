let xs = []
let ys = []
let rgbs = []

function setup() {
  createCanvas(400,600)
}
let rgb = [255,255,255]
function draw() {
  background(rgb)
  for (i = 0; i < xs.length; i++){
    fill(rgbs[i])
    ellipse(xs[i],ys[i],24)
    xs[i] += random(-4,4)
    ys[i] += random(-4,4)
  }
}

function mousePressed() {
  for (i = 0; i < 3; i++){
    rgb[i] = random(255)
  }
  let x = mouseX
  xs.push(x)
  let y = mouseY
  ys.push(y)
  let rgbEllipse = [random(0, 255),random(0, 255),random(0, 255)]
  rgbs.push(rgbEllipse)
}

