var fs = require('fs');
var youtubedl = require('youtube-dl');



/*
 * GET home page.
 */

exports.index = function ( req, res ) {
  res.render('index', { title: 'focus stack' });
};

exports.video = function ( req, res, next ) {

	console.log('Downloading video')

	var video = youtubedl('http://www.youtube.com/watch?v='+req.body.video_id,
		// Optional arguments passed to youtube-dl.
		['--format=18'],
		// Additional options can be given for calling `child_process.execFile()`.
		{ cwd: __dirname });

	// Will be called when the download starts.
	video.on('info', function(info) {
	  console.log('Download started');
	  console.log('filename: ' + info.filename);
	  console.log('size: ' + info.size);
	});

	video.on('end', function(){
		console.log('Download finished')

		next();
	})

	var dir = 'tests/temp';

	if ( ! fs.existsSync( dir ) ){
	    fs.mkdirSync( dir )
	}

	video.pipe( fs.createWriteStream( dir+'/stack_me.mp4'));
};

exports.save = function ( req, res, next ) {

	var data = req.body.img.replace(/^data:image\/\w+;base64,/, "");
	var name = req.body.name;
	var buf = new Buffer(data, 'base64');

	fs.writeFile('tests/temp/' + name, buf, next);

};

function save_file ( file, dest, next ) {

	var tmp_path = file;

	// set where the file should actually exists - in this case it is in the "images" directory
	var target_path = dest;// + req.files.upload.name;

	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
	    if (err) throw err;

	    // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
	    fs.unlink(tmp_path, function() {
	        if (err) throw err;

	        if ( next !== null ) next();

	    });
	});
}