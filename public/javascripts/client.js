// $.event.props.push('dataTransfer');

var video = document.getElementById("video"),
    canvasDraw = document.getElementById('imageView'),
    w = canvasDraw.width,
    h = canvasDraw.height,
    images_buffer = document.createDocumentFragment(),
    imgs = document.getElementById("imgs"),
    canvasFromVideo = document.getElementById("imageView"),
    range = document.getElementById("farps"),
    input = document.getElementById('files-upload'),
    dropArea = document.getElementById("drop-area"),
    next_frame = 0;

input.addEventListener('change', handleFiles);
ctxDraw = canvasDraw.getContext('2d');

$('#file').on('click', function ( event ) {
    event.preventDefault();
});



function handleFiles(e) {

    var data;

    if( e.target.files !== 'undefined' ) {
        data = e.target.files[0];
    } else {
        data = e.dataTransfer.files[0];
    }

    video.src = URL.createObjectURL( data );

    $('#grab').removeClass('hide');
    $('.fps').removeClass('hide');
    $('#fps_range').removeClass('hide');
    $('.video').removeClass('hide');

}



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

    $('#imgs').html('');

    video.addEventListener('ended', function ( e ) {

        imgs.appendChild( images_buffer );

        $('#save').removeClass('hide');
        $('#save').removeClass('disabled');
        $('#grab span').html('Try again');

    }, false);

    video.addEventListener('timeupdate', function ( e ) {

        if( video.currentTime > next_frame ) {
            console.log('current time: ' + video.currentTime);
            console.log('capturing frame ' + next_frame);
            next_frame += 1 / parseFloat( range.value );
            capture();
        }

    }, false);

    video.play();
};


function save_stack () {

    var frag = document.createDocumentFragment(),
        images = $('#imgs').find('img');

    console.log(images.length + ' images');

    $('#saving').removeClass('hide');

    var start_button_interval = setInterval(function () {
        if( $('#imgs').find('img').length > 0 ) {
            
        } else {
            $('#saving').addClass('hide');
            $('#save').addClass('disabled');
            $('#stack').removeClass('hide');
            clearInterval( start_button_interval );
        }
    }, 500);

    images.each(function ( i, elem ) {

        var image_name = 'stack_' + (i < 10 ? '00' : '0') + i + '.png';

        setTimeout(function () {
            $.post('/stack', { img: elem.src, name: image_name }, function ( data, status ) {
                console.dir(status);
            })
        }, 10);

        $(this).fadeOut(300).remove();
    });
}


function start_stacking () {
    
    $('#save').addClass('disabled');

    $('#stack').addClass('disabled');
    
    $('#stacking').removeClass('hide');

    $.post('/start', {a: 'b'}, function ( data, status ) {
        console.dir(status);

        if( status === 'success' ) {

            $('#stacking').addClass('hide');

            $('#show').on('click', function ( e ) {
                e.preventDefault();

                window.open("/images/stacked.png");
            });
            $('#show').removeClass('hide');
        }
    });
}


function capture () {

    var data;

    ctxDraw.clearRect(0, 0, w, h);

    ctxDraw.drawImage(video, 0, 0, w, h);
    ctxDraw.save();

    console.dir( canvasFromVideo );

    data = Canvas2Image.convertToImage( canvasFromVideo, 1920, 1080, 'tif' );

    console.dir( data );

    images_buffer.appendChild( data );

}





