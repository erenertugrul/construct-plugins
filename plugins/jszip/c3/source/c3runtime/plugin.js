"use strict";
	var path = null;
    var fs = null;
	// https://stackoverflow.com/questions/31645738/how-to-create-full-path-with-nodes-fs-mkdirsync/40686853#40686853
	var  mkDirByPathSync = function(targetDir, { isRelativeToScript = false } = {}) {
	  const sep = path.sep;
	  const initDir = path.isAbsolute(targetDir) ? sep : '';
	  const baseDir = isRelativeToScript ? __dirname : '.';

	  return targetDir.split(sep).reduce((parentDir, childDir) => {
	    const curDir = path.resolve(baseDir, parentDir, childDir);
	    try {
	      fs.mkdirSync(curDir);
	    } catch (err) {
	      if (err.code === 'EEXIST') { // curDir already exists!
	        return curDir;
	      }

	      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
	      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
	        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
	      }

	      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
	      if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
	        throw err; // Throw if it's just the last created dir.
	      }
	    }

	    return curDir;
	  }, initDir);
	}

{
	C3.Plugins.eren_jszip = class eren_jszipPlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
			if (C3.Platform.IsDesktopApp)
			{
				fs = require('fs');
				path = require('path');
			}
		}
		
		Release()
		{
			super.Release();
		}
	};
}