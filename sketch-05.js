const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [1080, 1080],
};

let manager;
let text = "A";
let fontSize = 1200;
let fontFamily = "serif";
let fontWeight = "normal";
let fontStyle = "normal";
let cell = 10;
const img = new Image();
const typeCanvas = document.createElement("canvas");
const typeContext = typeCanvas.getContext("2d");

const sketch = ({ context, width, height }) => {
  return ({ context, width, height }) => {
    let cols = Math.floor(width / cell);
    console.log(cell);
    let rows = Math.floor(height / cell);
    const numCells = cols * rows;

    typeCanvas.width = cols;
    typeCanvas.height = rows;
    typeContext.fillStyle = "black";
    typeContext.fillRect(0, 0, cols, rows);

    context.textBaseline = "middle";
    context.textAlign = "center";

    fontSize = cols * 1.1;
    typeContext.fillStyle = "white";
    typeContext.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    typeContext.textBaseline = "top";

    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft;
    const mh =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const x = cols / 2 - mw / 2 - mx;
    const y = rows / 2 - mh / 2 - my;

    typeContext.save();

    typeContext.drawImage(img, 0, 0, cols, rows);

    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;
    context.drawImage(img, 0, 0, width, height);

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const index = (col + row * cols) * 4;
      const r = typeData[index + 0];
      const g = typeData[index + 1];
      const b = typeData[index + 2];
      const a = typeData[index + 3];
      const glyph = getGlyph(r, g, b, a);
      context.font = `${3 * cell * Math.random() + cell / 4}px ${fontFamily}`;

      context.fillStyle = `rgb(${r}, ${g}, ${b})`;
      // context.fillStyle = 'white';

      context.save();
      context.translate(x, y);

      context.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
      context.translate(cell / 2, cell / 2);

      context.fillText(glyph, 0, 0);

      context.restore();
    }
    // create edges
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const index = (col + row * cols) * 4;
      const r = typeData[index + 0];
      const g = typeData[index + 1];
      const b = typeData[index + 2];
      const a = typeData[index + 3];
      if (getGlyph(r, g, b, a) === "🌊") {
        context.save();
        context.translate(x, y);
        context.lineWidth = 5;
        context.strokeStyle = "white";
        context.tipStyle = "round";
        context.beginPath();
        if (row > 0) {
          const indexAbove = (col + (row - 1) * cols) * 4;
          const rAbove = typeData[indexAbove + 0];
          const gAbove = typeData[indexAbove + 1];
          const bAbove = typeData[indexAbove + 2];
          const aAbove = typeData[indexAbove + 3];
          if (getGlyph(rAbove, gAbove, bAbove, aAbove) !== "🌊") {
            context.moveTo(0, 0);
            context.lineTo(cell, 0);
          }
        }
        if (col < cols - 1) {
          const indexRight = (col + 1 + row * cols) * 4;
          const rRight = typeData[indexRight + 0];
          const gRight = typeData[indexRight + 1];
          const bRight = typeData[indexRight + 2];
          const aRight = typeData[indexRight + 3];
          if (getGlyph(rRight, gRight, bRight, aRight) !== "🌊") {
            context.moveTo(cell, 0);
            context.lineTo(cell, cell);
          }
        }
        if (row < rows - 1) {
          const indexBelow = (col + (row + 1) * cols) * 4;
          const rBelow = typeData[indexBelow + 0];
          const gBelow = typeData[indexBelow + 1];
          const bBelow = typeData[indexBelow + 2];
          const aBelow = typeData[indexBelow + 3];
          if (getGlyph(rBelow, gBelow, bBelow, aBelow) !== "🌊") {
            context.moveTo(cell, cell);
            context.lineTo(0, cell);
          }
        }
        if (col > 0) {
          const indexLeft = (col - 1 + row * cols) * 4;
          const rLeft = typeData[indexLeft + 0];
          const gLeft = typeData[indexLeft + 1];
          const bLeft = typeData[indexLeft + 2];
          const aLeft = typeData[indexLeft + 3];
          if (getGlyph(rLeft, gLeft, bLeft, aLeft) !== "🌊") {
            context.moveTo(0, cell);
            context.lineTo(0, 0);
          }
        }
        context.stroke();
        context.restore();
      }
    }
  };
};

const getGlyph = (r, g, b, a) => {
  // snow
  if (r > 180 && g > 180 && b > 180) return "❄️";
  //sand
  if (r > 164 && g > 128 && b > 88 && r > g && r > b && (r + g + b) / 3 > 180)
    return "🏖️";
  if (r < 246 && g < 214 && b < 154 && r > 164 && g > 133 && b > 89 && r > g)
    return "⛰️";
  //mountains
  if (r < 241 && g < 218 && b < 189 && r > 102 && g > 37 && b > 13 && r > g)
    return "🏔️";
  // grass
  if (r < 177 && g < 189 && b < 154 && r > 62 && g > 89 && b > 52 && g > b)
    if (Math.random() > 0.8) {
      return "🌿";
    } else if (Math.random() > 0.6) {
      return "🌳";
    } else if (Math.random() > 0.4) {
      return "🌱";
    } else if (Math.random() > 0.2) {
      return "🍀";
    } else {
      return "🌲";
    }

  // water
  if (r > 50 && g > 88 && b > 95 && b >= r) return "🌊";
  // sand
  if (r > 200 && g > 200 && b < 100) return "🏖️";
  // desert
  if (r > 200 && g > 200 && b > 200) return "🏜️";
  // forest
  if (g > b) return "🌿";
  else if (b > g) return "🌊";
};
const onKeyUp = (e) => {
  if (e.key === "ArrowUp") {
    cell += 1;
  } else if (e.key === "ArrowDown") {
    cell -= 1;
  } else if (e.key === "ArrowRight") {
    fontWeight = fontWeight === "bold" ? "normal" : "bold";
  } else if (e.key === "ArrowLeft") {
    fontStyle = fontStyle === "italic" ? "normal" : "italic";
  } else {
    text = e.key.toUpperCase();
  }

  manager.render();
};

document.addEventListener("keyup", onKeyUp);

const start = async () => {
  const img = await loadMeSomeImage();
  console.log("image width", img.width);
  console.log("image height", img.height);
  console.log("image loading...");
  manager = await canvasSketch(sketch, settings);
};

const loadMeSomeImage = () => {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = "europe.jpg";
  });
};

start();
