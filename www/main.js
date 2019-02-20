const MIN_RADIUS = 8;
const MAX_RADIUS = 12;
const MIN_DISTANCE = 4; //MIN_RADIUS / 4.0;
const MAX_DISTANCE = 96;

// var radius_pixel_ratio = 0;
var lastClear = Date.now();
var lastSave = Date.now();

var clearCounter = 0;
const CLEAR_TOUCHES_REQUIRE = 16;
var clearTime = 500;
var CLEAR_GESTURE = 3;

var saveCounter = 0;
const SAVE_TOUCHES_REQUIRE = 16;
var saveTime = 1000;
var SAVE_GESTURE = 2;

var brushStyle = 'rgba(127,127,127,0.75)';
var bgStyle = 'rgb(0,0,0)';

var canvas;
var ctx;
var penDown = false;
var mouse = {
    x: 0,
    y: 0,
    radius: MIN_RADIUS
}

function getViewPort() {
    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof (window.innerWidth) != 'undefined') {
        viewPortWidth = window.innerWidth;
        viewPortHeight = window.innerHeight;
    }
    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line the document)
    else if (typeof (document.documentElement) != 'undefined' && typeof (document.documentElement.clientWidth) != 'undefined' && typeof (document.documentElement.clientHeight) != 'undefined') {
        viewPortWidth = document.documentElement.clientWidth;
        viewPortHeight = document.documentElement.clientHeight;
    }
    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth;
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight;
    }
    return [viewPortWidth, viewPortHeight];
}

function doResize() {
    var canvas = document.getElementById('canvas');

    var width, height;

    [width, height] = getViewPort();

    // console.log(`width = ${width}, height = ${height}`)

    canvas.width = width;
    canvas.height = height;
}

function clearCanvas() {
    penDown = false;
    clearCounter = 0;
    lastClear = Date.now();

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, width, height);
}

function saveCanvas() {
    penDown = false;
    saveCounter = 0;
    lastSave = Date.now();
    // var dataURL = canvas.toDataURL('image/png');
    // console.log(dataURL)
    navigator.screenshot.save(function (error, res) {
        if (error) {
            console.error(error);
        } else {
            console.log('OK', res.filePath);
            clearCanvas();
        }
    })
}

function touchstart(evt) {
    penDown = true;
    mouse.x = evt.x;
    mouse.y = evt.y;

}

function touchmove(evt) {

    if (!penDown) return;

    var x = mouse.x;
    var y = mouse.y;
    var r = mouse.radius;

    var dX = evt.x - x;
    var dY = evt.y - y;

    var distance = Math.sqrt(dX ** 2 + dY ** 2)

    if (distance > MAX_DISTANCE) {
        // ctx.fillStyle = 'rgb(200, 0, 0)'
        // ctx.beginPath()
        // ctx.arc(evt.x, evt.y, 16, 0, Math.PI * 2, false);
        // ctx.fill();

        // ctx.beginPath()
        // ctx.arc(x, y, 16, 0, Math.PI * 2, false);
        // ctx.fill();
        return;
    }

    var step = distance / MIN_DISTANCE;
    var deltaX = dX / step;
    var deltaY = dY / step;

    // console.log(`distance ${distance}`)

    // var radiusStep = 1;
    // var dR = (MAX_RADIUS / (distance / 0.1)) - r;
    // var deltaRadius = dR / radiusStep;

    // console.log(`dX=${dX}, dY=${dY}, distance=${distance}, step=${step}`)

    for (let i = 0; i < step; i++) {
        ctx.fillStyle = brushStyle;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fill();

        // console.log(`draw circle at (${x}, ${y})`)

        x += deltaX;
        y += deltaY;
        // r += deltaRadius;

        // if (r < MIN_RADIUS) r = MIN_RADIUS;
        // if (r > MAX_RADIUS) r = MAX_RADIUS;
    }

    mouse.x = x;
    mouse.y = y;
    mouse.radius = r;

}

function touchend(evt) {
    penDown = false;
}


window.onload = function () {
    doResize();
    clearCanvas();

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.addEventListener('mousedown', touchstart, false)
    canvas.addEventListener('touchstart', (evt) => {
        evt.preventDefault();
        var touches = evt.changedTouches;

        $('#touchstart').text(`touchstart: ${touches.length}`)

        for (let i = 0; i < touches.length; i++) {
            // console.log(`touchstart: ${i}`)
            var _evt = {
                x: touches[i].pageX,
                y: touches[i].pageY
            }
            touchstart(_evt);
        }
    }, false)

    canvas.addEventListener('mousemove', touchmove, false)
    canvas.addEventListener('touchmove', (evt) => {
        evt.preventDefault();
        var touches = evt.changedTouches;

        $('#touchmove').text(`touchmove: ${touches.length}`)

        var now = Date.now();

        if (touches.length == 1) {
            var _evt = {
                x: touches[0].pageX,
                y: touches[0].pageY
            }
            touchmove(_evt);
        } else if (touches.length == CLEAR_GESTURE) {
            if ((now - lastClear) > clearTime) {
                clearCounter++;
                if (clearCounter > CLEAR_TOUCHES_REQUIRE) {
                    clearCanvas();
                }
            }
        } else if (touches.length == SAVE_GESTURE) {

            if ((now - lastSave) > saveTime) {
                saveCounter++;
                if (saveCounter > SAVE_TOUCHES_REQUIRE) {
                    saveCanvas();
                }
            }
        }

        $('#touchmove').text(`touchmove: ${touches.length} | clearCounter: ${clearCounter} | saveCounter: ${saveCounter}`)

    }, false)

    canvas.addEventListener('mouseleave', (evt) => {
        penDown = false;
    })

    canvas.addEventListener('mouseup', touchend, false)
    // canvas.addEventListener('touchend', (evt) => {
    //     touchend(evt);
    // }, false)

    window.addEventListener('resize', function (e) {
        doResize();
        clearCanvas();
    })


}