// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.ExtraExps = function (runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.ExtraExps.prototype;
	
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function (plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};
	
	var typeProto = pluginProto.Type.prototype;
	
	// called on startup for each object type
	typeProto.onCreate = function ()  {};
	
	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function (type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// any other properties you need, e.g...
		// this.myValue = 0;
	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	// called whenever an instance is created
	instanceProto.onCreate = function ()
	{
		// note the object is sealed after this call; ensure any properties you'll ever need are set on the object
		// e.g...
		// this.myValue = 0;
	};
	
	// only called if a layout object
	instanceProto.draw = function (ctx)  {};
	
	//////////////////////////////////////
	// Conditions
	pluginProto.cnds = {};
	var cnds = pluginProto.cnds;
	
	// the example condition
	//	cnds.MyCondition = function (myparam)
	//	{
	//		// return true if number is positive
	//		return myparam >= 0;
	//	};
	
	//////////////////////////////////////
	// Actions
	pluginProto.acts = {};
	var acts = pluginProto.acts;
	
	// the example action
	//	acts.MyAction = function (myparam)
	//	{
	//		// alert the message
	//		alert(myparam);
	//	};
	
	//////////////////////////////////////
	// Expressions
	pluginProto.exps = {};
	var exps = pluginProto.exps;
	
	// the example expression
	//	exps.MyExpression = function (ret)	// 'ret' must always be the first parameter - always return the expression's result through it!
	//	{
	//		ret.set_int(1337);				// return our value
	//		// ret.set_float(0.5);			// for returning floats
	//		// ret.set_string("Hello");		// for ef_return_string
	//		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	//	};
	
	// case sensitive string search function
	exps.find = function (ret, text, source)
	{
		ret.set_int(source.search(new RegExp(cr.regexp_escape(text), "")));
	};
	
	// character to charcode
	exps.char2code = function (ret, character)
	{
		ret.set_int(character.charCodeAt(0));
	};
	
	// charcode to character
	exps.code2char = function (ret, code)
	{
		ret.set_string(String.fromCharCode(code));
	};
	
	// cosine interpolation
	exps.cosp = function (ret, a, b, t)
	{
		var i;
		i = (1 - Math.cos(t * Math.PI)) / 2;
		ret.set_float(a * (1 - i) + b * i);
	}
	
	// X offset
	exps.offsetX = function (ret, x, angle, dist)
	{
		ret.set_float(x + Math.cos(cr.to_radians(angle)) * dist);
	}
	
	// Y offset
	exps.offsetY = function (ret, y, angle, dist)
	{
		ret.set_float(y + Math.sin(cr.to_radians(angle)) * dist);
	}
	
	// snap to grid
	exps.snap = function (ret, x, grid)
	{
		ret.set_float(Math.round(x / grid) * grid);
	}
	
	// encode to Base64
	exps.encode = function (ret, text)
	{
		ret.set_string(Base64.encode(text));
	}
	
	exps.decode = function (ret, text)
	{
		ret.set_string(Base64.decode(text));
	}

	exps.findToken = function(ret, text, token, delim, csent)
	{
		var casesent = csent === 1 ? true : false;
		var tokens = null;
		if(casesent)
		{
			tokens = text.split(delim);
			ret.set_int(tokens.indexOf(token));
		}
		else
		{
			tokens = text.toLowerCase();
			tokens = tokens.split(delim);
			ret.set_int(tokens.indexOf(token.toLowerCase()));
		}
	}
	
	/////////////////////////////////////
	// the Base64 algorithm
	var Base64 =
	{
		// private property
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		
		// public method for encoding
		encode : function (input)
		{
			var output = "";
			var chr1,
			chr2,
			chr3,
			enc1,
			enc2,
			enc3,
			enc4;
			var i = 0;
			
			input = Base64._utf8_encode(input);
			while (i < input.length)
			{
				
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				
				if (isNaN(chr2))
				{
					enc3 = enc4 = 64;
				}
				else if (isNaN(chr3))
				{
					enc4 = 64;
				}
				
				output = output +
					Base64._keyStr.charAt(enc1) + Base64._keyStr.charAt(enc2) +
					Base64._keyStr.charAt(enc3) + Base64._keyStr.charAt(enc4);
			}
			
			return output;
		},
		
		// public method for decoding
		decode : function (input)
		{
			var output = "";
			var chr1,
			chr2,
			chr3;
			var enc1,
			enc2,
			enc3,
			enc4;
			var i = 0;
			
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while (i < input.length)
			{
				enc1 = Base64._keyStr.indexOf(input.charAt(i++));
				enc2 = Base64._keyStr.indexOf(input.charAt(i++));
				enc3 = Base64._keyStr.indexOf(input.charAt(i++));
				enc4 = Base64._keyStr.indexOf(input.charAt(i++));
				
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				
				output = output + String.fromCharCode(chr1);
				
				if (enc3 != 64)
				{
					output = output + String.fromCharCode(chr2);
				}
				if (enc4 != 64)
				{
					output = output + String.fromCharCode(chr3);
				}
			}
			
			output = Base64._utf8_decode(output);
			return output;
		},
		
		// private method for UTF-8 encoding
		_utf8_encode : function (string)
		{
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			
			for (var n = 0; n < string.length; n++)
			{
				var c = string.charCodeAt(n);
				
				if (c < 128)
				{
					utftext += String.fromCharCode(c);
				}
				else if ((c > 127) && (c < 2048))
				{
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				}
				else
				{
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}
			}
			return utftext;
		},
		
		// private method for UTF-8 decoding
		_utf8_decode : function (utftext)
		{
			var string = "";
			var i = 0;
			var c = 0,
			c1 = 0,
			c2 = 0;
			while (i < utftext.length)
			{
				c = utftext.charCodeAt(i);
				
				if (c < 128)
				{
					string += String.fromCharCode(c);
					i++;
				}
				else if ((c > 191) && (c < 224))
				{
					c1 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
					i += 2;
				}
				else
				{
					c1 = utftext.charCodeAt(i + 1);
					c2 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
					i += 3;
				}
			}
			return string;
		}
	}
}
    ());