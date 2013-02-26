var videoId = 'video'; // ?????????

var video = document.getElementById("video"),
    canvasDraw = document.getElementById('imageView'),
    w = canvasDraw.width,
    h = canvasDraw.height,
    ctxDraw = canvasDraw.getContext('2d'),
    images_buffer = document.createDocumentFragment();

var imgs = document.getElementById("imgs"),
    // ImageURItoShow = "",
    canvasFromVideo = document.getElementById("imageView"),
    range = document.getElementById("farps");

var fps_range = {
    'render': function () {
        var value = range.value;
        document.getElementById("fps").innerHTML = value;
    },
    'interval': function () {
        return (1000 / range.value);
    }
};

var frame_grabber = new FrameGrabber();

// display the value of the framerate range selector
fps_range.render();


function FrameGrabber () {}
FrameGrabber.prototype.start = function () {

    video.play();

    var frame_interval = setInterval(this.run, fps_range.interval());

    video.addEventListener('ended', function ( e ) {
        
        clearInterval( frame_interval );

        imgs.appendChild( images_buffer );

    }, false)
};
FrameGrabber.prototype.run = function () {

    // video.pause();
    console.log('capturing.....')
    
    capture();
    
    // video.play();
};


function submit_stack () {

    var images = imgs.getElementsByTagName('img'),
        input = document.createElement('input'),
        form = document.getElementById('stack');

    for(var i=0, l=images.length; i<l; i++) {
        input.type = 'file';
        input.name = 'stack_' + i;
        console.log( encodeURIComponent(images[i].src) );
        form.appendChild( input );
    }
}


function capture () {

    var data;

    ctxDraw.clearRect(0, 0, w, h);

    ctxDraw.drawImage(video, 0, 0, w, h);
    ctxDraw.save();

    data = Canvas2Image.convertToImage(canvasFromVideo, 960, 540, 'png');

    // $.post('/stack', { stack: data });

    images_buffer.appendChild( data );
}