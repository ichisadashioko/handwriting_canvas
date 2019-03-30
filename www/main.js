const MIN_RADIUS = 4;
const MAX_RADIUS = 5;
const MIN_DISTANCE = 4; //MIN_RADIUS / 4.0;
const MAX_DISTANCE = 96;

const PAD_WIDTH = 320;
const PAD_HEIGHT = 320;

var lastClear = Date.now();
var lastSave = Date.now();

var clearCounter = 0;
const CLEAR_TOUCHES_REQUIRE = 16;
var clearTime = 300;
var CLEAR_GESTURE = 3;

var saveCounter = 0;
const SAVE_TOUCHES_REQUIRE = 16;
var saveTime = 500;
var SAVE_GESTURE = 2;

var brushStyle = 'rgb(255,255,255)';
var bgStyle = 'rgb(0,0,0)';

var canvas;
var ctx;
var scale = 1;
var penDown = false;
var mouse = {
    x: 0,
    y: 0,
    radius: MIN_RADIUS
}

var canvasOffset = {
    x: 0,
    y: 0,
}

function doResize() {

    var c = $('#canvas')

    var new_scale = Math.min(
        window.innerWidth / PAD_WIDTH,
        window.innerHeight / PAD_HEIGHT
    );

    scale = new_scale

    c.css('transform', ('scale(' + new_scale + ')'))
    c.css('left', '0')
    canvasOffset.x = 0;

    var ui_container = $('#ui-container')

    var ui_width = window.innerWidth - new_scale * PAD_WIDTH;

    if (ui_width == 0) {
        ui_width = window.innerWidth;
    }

    var ui_height = window.innerHeight - new_scale * PAD_HEIGHT;

    if (ui_height == 0) {
        ui_height = window.innerHeight;
        canvasOffset.x = ui_width;
        c.css('left', ui_width)
        ui_container.css('left', '0')
        ui_container.css('right', '')
    }

    ui_container.css('width', ('' + ui_width + 'px'))
    ui_container.css('height', ('' + ui_height + 'px'))
}

function clearCanvas() {
    penDown = false;
    clearCounter = 0;
    lastClear = Date.now();

    var width = canvas.width;
    var height = canvas.height;

    ctx.fillStyle = bgStyle;
    ctx.fillRect(0, 0, width, height);
}

function saveCanvas() {
    penDown = false;
    saveCounter = 0;
    lastSave = Date.now();

    var imageData = canvas.toDataURL().replace(/data:image\/png;base64,/, '');

    clearCanvas();

    var pms = cordova.plugins.permissions;

    pms.checkPermission(pms.WRITE_EXTERNAL_STORAGE, function (status) {
        if (status.hasPermission) {
            // console.log("Yes")

            cordova.exec(function (msg) {
                    console.log(msg)
                },
                function (err) {
                    console.log(err)
                },
                "Canvas2ImagePlugin",
                "saveImageDataToLibrary",
                [imageData]
            );
        } else {
            console.log("Saved failed. Lack permission: WRITE_EXTERNAL_STORAGE")
            pms.requestPermissions(pms.WRITE_EXTERNAL_STORAGE, function (status) {
                if (status.hasPermission) {
                    console.log("Yes")

                    cordova.exec(function (msg) {
                            console.log(msg)
                        },
                        function (err) {
                            console.log(err)
                        },
                        "Canvas2ImagePlugin",
                        "saveImageDataToLibrary",
                        [imageData]
                    );
                } else {
                    console.log("Saved failed. Lack permission: WRITE_EXTERNAL_STORAGE")
                }
            })

        }
    })
}

function touchstart(evt) {
    penDown = true;
    mouse.x = (evt.x - canvasOffset.x) / scale;
    mouse.y = (evt.y - canvasOffset.y) / scale;

}

function touchmove(evt) {

    if (!penDown) return;

    var x = mouse.x;
    var y = mouse.y;
    var r = mouse.radius;

    var dX = (evt.x - canvasOffset.x) / scale - x;
    var dY = (evt.y - canvasOffset.y) / scale - y;

    var distance = Math.sqrt(dX ** 2 + dY ** 2)

    var step = distance / MIN_DISTANCE;
    var deltaX = dX / step;
    var deltaY = dY / step;

    for (let i = 0; i < step; i++) {
        ctx.fillStyle = brushStyle;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.fill();

        x += deltaX;
        y += deltaY;
    }

    mouse.x = x;
    mouse.y = y;
    mouse.radius = r;

}

function touchend(evt) {
    penDown = false;
}


window.onload = function () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    doResize();
    clearCanvas();


    canvas.addEventListener('mousedown', touchstart, false)
    canvas.addEventListener('touchstart', (evt) => {
        evt.preventDefault();
        var touches = evt.changedTouches;

        $('#touchstart').text(`touchstart: ${touches.length}`)

        for (let i = 0; i < touches.length; i++) {
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
        }
        // else if (touches.length == SAVE_GESTURE) {

        //     if ((now - lastSave) > saveTime) {
        //         saveCounter++;
        //         if (saveCounter > SAVE_TOUCHES_REQUIRE) {
        //             saveCanvas();
        //         }
        //     }
        // }

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
    })


}