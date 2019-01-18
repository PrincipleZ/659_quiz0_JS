video = document.getElementById("video");
canvas = document.getElementById("mainCanvas");
context = canvas.getContext("2d");

width = document.documentElement.clientWidth;
height = document.documentElement.clientHeight;
colorPicked = null;
mousePos = { x:0, y:0 };
frame = null;
canvas.width = width;
canvas.height = height;

start();


function start(){
    // from https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Manipulating_video_using_canvas

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: {
            facingMode: "environment",
            width: 1280
        } }).then(function(stream) {
            // video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
            requestAnimationFrame(step);
        });
    }
    // document.documentElement.requestFullscreen(); 
    function step(){
        context.drawImage(video, 0, 0, width, height);
        frame = context.getImageData(0, 0, width, height);
        length = frame.data.length/4;
        if (colorPicked != null){
            for (let i = 0; i < length; i++){

                r = frame.data[i * 4]
                g = frame.data[i * 4 + 1]
                b = frame.data[i * 4 + 2]

                if (r == colorPicked[0] && g == colorPicked[1] && b == colorPicked[2]){
                    frame.data[i * 4] = 0;
                    frame.data[i * 4 + 1] = 0;
                    frame.data[i * 4 + 2] = 0;
                }
                // console.log(colorPicked)
            }
            context.putImageData(frame, 0, 0);
        }
        requestAnimationFrame(step);
    }
    registerEvents();
    // for (let i = 0; i < frame.data.length; i++) {
    //     console.log(frame.data[i])
    //     // if (colorPicked != null) && (frame.data[i])
    // }
}

function registerEvents(){
    // partially from http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html
    // Set up mouse events for drawing
    var picking = false;
    canvas.addEventListener("mousedown", function (e) {
        picking = true;
        mousePos = getMousePos(canvas, e);
        colorPicked = pickColor(mousePos.x, mousePos.y);
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        picking = false;
    }, false);
    // canvas.addEventListener("mousemove", function (e) {
    //     mousePos = getMousePos(canvas, e);
    //     console.log(pickColor(mousePos.x, mousePos.y));
    // }, false);

    // Get the position of the mouse relative to the canvas
    function getMousePos(canvasDom, mouseEvent) {
      var rect = canvasDom.getBoundingClientRect();
      return {
        x: mouseEvent.clientX - rect.left,
        y: mouseEvent.clientY - rect.top
      };
    }

    canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }, false);
    canvas.addEventListener("touchend", function (e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    }, false);
    // canvas.addEventListener("touchmove", function (e) {
    //     var touch = e.touches[0];
    //     var mouseEvent = new MouseEvent("mousemove", {
    //         clientX: touch.clientX,
    //         clientY: touch.clientY
    //     });
    //     canvas.dispatchEvent(mouseEvent);
    // }, false);

    // Get the position of a touch relative to the canvas
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };
    }
}

function pickColor(x, y){
    return context.getImageData(x, y, 1, 1).data; 
}

function replaceColor(oldColor){

}