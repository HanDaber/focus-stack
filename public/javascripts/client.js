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
    next_frame = 0,
    $file = $('#file'),
    $yt = $('#yt'),
    $grab = $('#grab'),
    $fps = $('.fps'),
    $fps_range = $('#fps_range'),
    $video = $('.video'),
    $fps_display = document.getElementById("fps"),
    $imgs = $('#imgs'),
    $saving = $('#saving'),
    $save = $('#save'),
    $stack = $('#stack'),
    $grab_span = $('#grab span'),
    $show = $('#show'),
    $done = $('#done'),
    $stacking = $('#stacking'),
    $yt_id = $('#yt_id');

// input.addEventListener('change', handleFiles);
ctxDraw = canvasDraw.getContext('2d');

$file.on('click', function ( event ) {
    event.preventDefault();
});

$yt.on('click', function ( event ) {
    event.preventDefault();

    var id = $yt_id.val() || $yt_id.attr('placeholder');

    if( !id ) return;

    console.log( id )

    var done_timer;

    $stacking.removeClass('hide');

    $.post('/video', { video_id: id }, function( data, status ){
        // times out
        console.log( data )
        console.log( status )

        // window.open("/images/stacked.png")

        // if( status === 'success' ) {

        //     $stacking.addClass('hide');

        //     // $show.on('click', function ( e ) {
        //     //     e.preventDefault();

        //     //     window.open("/images/stacked.png");
        //     // });
        //     $show.removeClass('hide');
        // } else {
        //     console.log('fail or timeout')
        // }
    }).error(function(){
        console.log('errrrrk')
        clearTimeout( done_timer )
    })

    done_timer = setTimeout( pollForImage, 5000 )
});


function pollForImage(){
    console.log('pollForImage ing')
    $.get('/images/stacked.png', function(){
        
        // window.open("/images/stacked.png")
        $stacking.addClass('hide')
        $done.find('img').attr('src', '/images/stacked.png')
        $done.removeClass('hide')

    }).error(function( e ){
        if( e.status == 404 ){
            setTimeout( pollForImage, 5000 )
        }
    })
}


function handleFiles(e) {

    var data;

    if( e.target.files !== 'undefined' ) {
        data = e.target.files[0];
    } else {
        data = e.dataTransfer.files[0];
    }

    video.src = URL.createObjectURL( data );

    $grab.removeClass('hide');
    $fps.removeClass('hide');
    $fps_range.removeClass('hide');
    $video.removeClass('hide');

}



var fps_range = {
    'render': function () {
        var value = range.value;
        $fps_display.innerHTML = value;
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

    $imgs.html('');

    video.addEventListener('ended', function ( e ) {

        imgs.appendChild( images_buffer );

        $save.removeClass('hide');
        $save.removeClass('disabled');
        $grab_span.html('Try again');

    }, false);

    video.addEventListener('timeupdate', function ( e ) {

        if( video.currentTime > next_frame ) {
            // console.log('current time: ' + video.currentTime);
            // console.log('capturing frame ' + next_frame);
            next_frame += 1 / parseFloat( range.value );
            capture();
        }

    }, false);

    video.play();
};


function save_stack () {

    var frag = document.createDocumentFragment(),
        images = $imgs.find('img');

    // console.log(images.length + ' images');

    $saving.removeClass('hide');

    var start_button_interval = setInterval(function () {
        if( $imgs.find('img').length > 0 ) {
            
        } else {
            $saving.addClass('hide');
            $save.addClass('disabled');
            $stack.removeClass('hide');
            clearInterval( start_button_interval );
        }
    }, 500);

    images.each(function ( i, elem ) {

        var image_name = 'stack_' + (i < 10 ? '00' : '0') + i + '.png';

        setTimeout(function () {
            $.post('/stack', { img: elem.src, name: image_name }, function ( data, status ) {
                // console.dir(status);
            })
        }, 100 );

        $(this).fadeOut(300).remove();
    });
}


function start_stacking () {
    
    $save.addClass('disabled');

    $stack.addClass('disabled');
    
    $stacking.removeClass('hide');

    $.post('/start', {a: 'b'}, function ( data, status ) {
        // console.dir(status);

        if( status === 'success' ) {

            $stacking.addClass('hide');

            $show.on('click', function ( e ) {
                e.preventDefault();

                window.open("/images/stacked.png");
            });
            $show.removeClass('hide');
        }
    });
}


function capture () {

    video.pause();

    var data;

    ctxDraw.clearRect( 0, 0, w, h );

    ctxDraw.drawImage( video, 0, 0, w, h );
    ctxDraw.save();

    // console.dir( canvasFromVideo );

    data = Canvas2Image.convertToImage( canvasFromVideo, 1920, 1080, 'tif' );

    // console.dir( data );

    images_buffer.appendChild( data );

    setTimeout(function(){
        video.play();
    }, 1 )
}





