/* 
 * Node.JS Android Drawables View
 * 
 * Creates an index.html file that shows all Android project image resources in comparison sizes.
 *  
 *  My primary use: Inspect /res/ directory to see what's missing, what's inconsistent.
 * 
 * 
 * Resources:
 *  http://developer.android.com/guide/topics/resources/drawable-resource.html
 * 
 *  http://androiddrawables.com/
 *  http://androiddrawableexplorer.appspot.com/
 * 
 * Author: Michael Lakhia
 */

/*
Mini-Plan:

1. We start with a /res/ directory and we look for all "drawable-" directories, also handle /drawable/ only for .png
2. index them and their contents
3. which directory has the most drawables.png? this is our upper limit, 
     and the directory we'll use as the primary to create the first mappings
4. create a 2D map using the drawable_name.png as the first key for the upper limit drawables directory
5. the secondary keys will be ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi
6. fill map with the other drawables directory, adding to the existing keys if possible, creating new keys if they don't exist
7. print the 2d map in console
8. dynamically create an html file
9. print the 2d map in html
*/

var path = require('path');
var fs = require('fs');

var jsdom = require("jsdom").jsdom;
var document = jsdom("<html><head></head><body>hello world</body></html>");

var resDir;

// Prints all Passed Arguments - " $ node script.js arg1 arg2 "arg3" etc"
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
});

// Gets current scripts filename
function getCurrentScriptName(){
	if(process.argv[1]){
		var arr = process.argv[1].split("/");
		return arr[arr.length-1]
	}else{
		console.log("\n  ??? What\'s going on? \n");
	}
}

// Take /res/ folder
if(process.argv[2]){
	resDir = process.argv[2];
	console.log("\nCurrent /res/ dir path:\n" + resDir);
}else{
	console.log("\n  You\'re running it wrong. Please use as follows:\n\n    node "+getCurrentScriptName()+" /path/to/res/\n");
	return;
}

var big2d = {};

// read /res/ directory
fs.readdir(resDir, function (err, list) {
    if (err) throw err;

    // find all dirs that have drawable in them
    var drawableDirList = [];
    var drawableKey = "drawable";
    for(var i = 0; i < list.length; i++){
    	if(list[i].substring(0, drawableKey.length) === drawableKey){
    		drawableDirList.push(list[i]);
    	}
    }
    // print all drawable dirs found
    console.log("\nDrawable Directories Detected:\n\n"+drawableDirList.join("\n")+"\n");
    
    // iterate over all drawable dirs
    console.log("============= Processing =============");
    var i = 0;
    (function next() {
        var dir = drawableDirList[i++];

        if (!dir) {
            return null;
        }

        if(dir.indexOf("DS_Store") !== -1){
          return next();
        }

        var currentDirPath = resDir+"/"+dir;
        
        // isFile or isDir
        var stats = fs.statSync(currentDirPath);
        if(stats.isFile()){
        	console.log("File     : "+dir);
        }
        if(stats.isDirectory()){
        	console.log("Directory: "+dir);
        }

        big2d[dir] = {};

        // get all contents from the subdirectory. ex: drawable-ldpi
        var currentDirContent = fs.readdirSync(currentDirPath);
		for(var a=0; a<currentDirContent.length; a++){
			
			var file = currentDirContent[a];

			// exclude all non .png files
			if(file.indexOf(".png") == -1){
				
			}else{
				//console.log(file);
				big2d[dir][path.basename(file, '.png')] = resDir + "/" + dir + "/" + file;
			}

		}

        next();
    })();
    console.log("============== Finished ==============");

    //console.log("Results:");
    //console.log(big2d);

    var theTable = document.createElement('table');
    var tr, td;

    for(var drawableDir in big2d){
        console.log(drawableDir + " : " + big2d[drawableDir]);

        tr = document.createElement('tr');
        
        var th = document.createElement('th');
            th.appendChild(document.createTextNode(subDir));

        for(var subDir in big2d[drawableDir]){
            console.log(subDir + " : " + big2d[drawableDir][subDir]);

            

            td = document.createElement('td');
            var img = document.createElement('img')
                img.src = big2d[drawableDir][subDir];
            td.appendChild(img);
            tr.appendChild(th);
            tr.appendChild(td);
            theTable.appendChild(tr);

        }

    }

    //var theHtml = '<html><head><script>var arr2d = \''+JSON.stringify(big2d)+'\'; var obj = JSON.parse(arr2d); </script></head><body></body></html>';
    var theHtml = '<html><head></head><body><table>'+theTable.innerHTML+'</table></body></html>';

    fs.writeFile("index.html", theHtml, function(err) {
	    if(err) {
	        console.log(err);
	    } else {
	        console.log("The file was saved!");
	    }
	});

});