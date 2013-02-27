var fs = require('fs');

/*
 * GET home page.
 */

exports.index = function ( req, res ) {
  res.render('index', { title: 'focus stack' });
};

exports.upload = function ( req, res, next ) {
	if( req.files ) {
		console.dir(req.files.vid.path)

		save_file(req.files.vid.path, 'public/video/vid.mp4', next);

	} else {
		res.send('no file');
	}
};

exports.save = function( req, res ) {
	save_file('public/images/stack_' + Date.now);
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

	        if ( next != null ) next();

	    });
	});
}