$(document).ready(function () {
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");
  var isDrawing = false;
  var eraseMode = false;
  var currentColor = "black";
  var currentOpacity = 1;
  var currentSize = 5;
  var strokes = [];
  var currentStroke = null;

  function startStroke() {
    currentStroke = {
      color: currentColor,
      size: currentSize,
      opacity: currentOpacity,
      points: [],
    };
  }

  function addPoint(x, y) {
    currentStroke.points.push({ x: x, y: y });
  }

  function endStroke() {
    if (currentStroke) {
      strokes.push(currentStroke);
      currentStroke = null;
    }
  }

  function handleStart(e) {
    e.preventDefault();
    var x = e.clientX || e.touches[0].clientX;
    var y = e.clientY || e.touches[0].clientY;
    isDrawing = true;
    startDrawing(x, y);
    startStroke();
    addPoint(x - canvas.offsetLeft, y - canvas.offsetTop);
  }

  function handleMove(e) {
    e.preventDefault();
    var x = e.clientX || e.touches[0].clientX;
    var y = e.clientY || e.touches[0].clientY;
    draw(x, y);
    if (isDrawing) {
      addPoint(x - canvas.offsetLeft, y - canvas.offsetTop);
    }
  }

  function handleEnd(e) {
    e.preventDefault();
    stopDrawing();
    endStroke();
  }

  canvas.addEventListener('mousedown', handleStart);
  canvas.addEventListener('mousemove', handleMove);
  canvas.addEventListener('mouseup', handleEnd);
  canvas.addEventListener('mouseleave', handleEnd);
  canvas.addEventListener('touchstart', handleStart);
  canvas.addEventListener('touchmove', handleMove);
  canvas.addEventListener('touchend', handleEnd);

  function startDrawing(x, y) {
    isDrawing = true;
    context.beginPath();
    context.moveTo(x - canvas.offsetLeft, y - canvas.offsetTop);
  }

  function draw(x, y) {
    if (!isDrawing) return;
    context.lineWidth = currentSize;
    context.lineCap = "round";

    if (eraseMode) {
      context.strokeStyle = "white"; // Erase with white color
    } else {
      context.strokeStyle = currentColor;
    }

    context.lineTo(x - canvas.offsetLeft, y - canvas.offsetTop);
    context.stroke();
  }

  function stopDrawing() {
    isDrawing = false;
    context.closePath();
  }

  document.getElementById("erase").addEventListener("click", toggleErase);
  document.getElementById("clear").addEventListener("click", clearCanvas);
  var colorRadioInputs = document.querySelectorAll(
    'input[type="radio"][name="color"]'
  );
  colorRadioInputs.forEach(function (input) {
    input.addEventListener("change", changeColor);
  });
  document
    .getElementById("opacityRange")
    .addEventListener("input", changeOpacity);
  document.getElementById("sizeRange").addEventListener("input", changeSize);
  document.getElementById("undo").addEventListener("click", undoStroke);

  function toggleErase() {
    eraseMode = !eraseMode;
    if (eraseMode) {
      document.getElementById("erase").classList.add("active");
    } else {
      document.getElementById("erase").classList.remove("active");
    }
  }

  function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  function changeColor() {
    currentColor = document.querySelector(
      'input[type="radio"][name="color"]:checked'
    ).value;
  }

  function changeOpacity() {
    currentOpacity = parseFloat(document.getElementById("opacityRange").value);
    context.globalAlpha = currentOpacity;
  }

  function changeSize() {
    currentSize = parseInt(document.getElementById("sizeRange").value);
  }

  function undoStroke() {
    if (strokes.length > 0) {
      strokes.pop();
      redrawStrokes();
    }
  }

  function redrawStrokes() {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    for (var i = 0; i < strokes.length; i++) {
      var stroke = strokes[i];
      context.strokeStyle = stroke.color;
      context.lineWidth = stroke.size;
      context.globalAlpha = stroke.opacity;
      context.beginPath();
      context.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (var j = 1; j < stroke.points.length; j++) {
        context.lineTo(stroke.points[j].x, stroke.points[j].y);
      }
      context.stroke();
    }
  }
});
