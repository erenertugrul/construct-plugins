"use strict";
    var isFirebase3x = function () {
        return (window["FirebaseV3x"] === true);
    };

    var isFullPath = function (p) {
        return (p.substring(0, 8) === "https://");
    };
        var get_key = function (obj) {
        return (!isFirebase3x()) ? obj["key"]() : obj["key"];
    };

    var get_refPath = function (obj) {
        return (!isFirebase3x()) ? obj["ref"]() : obj["ref"];
    };

    var get_root = function (obj) {
        return (!isFirebase3x()) ? obj["root"]() : obj["root"];
    };

    var serverTimeStamp = function () {
        if (!isFirebase3x())
            return window["Firebase"]["ServerValue"]["TIMESTAMP"];
        else
            return window["Firebase"]["database"]["ServerValue"];
    };

    var get_timestamp = function (obj) {
        return (!isFirebase3x()) ? obj : obj["TIMESTAMP"];
    };
{
	C3.Plugins.Rex_Firebase_CurTime = class Rex_Firebase_CurTimePlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}