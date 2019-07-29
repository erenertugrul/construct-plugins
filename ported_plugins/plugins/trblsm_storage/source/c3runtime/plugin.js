"use strict";
function json_encode(object) {
    return JSON.stringify(object);
}

function json_decode(JSONstring) {
    return JSON.parse(JSONstring);
}

function isset(object) {
    if (typeof object !== 'undefined' && object !== null) {
	return true;
    }
    return false;
}

function is_array(object) {
    if (typeof object === 'array' || typeof object === 'object') {
	return true;
    }
    return false;
}

function is_int(object, valueCheck) {

    if (is_bool(valueCheck) == false) {
	valueCheck = false;
    }
    if (valueCheck) {
	var num = /^-?[0-9]+$/;
	if (num.test(object.toString())) {
	    return true;
	} else {
	    return false;
	}
    }
    if (typeof object == 'number' && object.toString() != 'NaN' && object.toString() != 'Infinity') {
	return true;
    }
    return false;
}

function is_string(object) {
    if (typeof object == 'string') {
	return true;
    }
    return false;
}

function is_bool(object) {
    if (typeof object == 'boolean') {
	return true;
    }
    return false;
}

function count(object) {

    //I dont like relying on .length as it doesnt always work as expected

    var x = 0;

    if (is_array(object)) {
	for (var i in object) {
	    ++x;
	}
    }

    var charArray = new Array;

    if (is_string(object)) {
	charArray = object.split('');
	for (var i in charArray) {
	    ++x;
	}
    }

    if (is_int(object)) {
	var string = object.toString();
	charArray = string.split('');
	for (var i in charArray) {
	    ++x;
	}
    }

    return x;
}

{
	C3.Plugins.trblsm_storage = class trblsm_storagePlugin extends C3.SDKPluginBase
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