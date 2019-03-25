"use strict";

{
	C3.Plugins.CBhash.Instance = class CBhashInstance extends C3.SDKInstanceBase
	{
		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this._testProperty = 0;
			this.lastResult = "";
			this.hexcase = 0;
			this.b64pad = " ";
			
			if (properties)		// note properties may be null in some cases
			{
				
			}
		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
		// MD5 encoding functions
		hex_md5(s)    { return this.rstr2hex(rstr_md5(str2rstr_utf8(s))); }
		b64_md5(s)    { return this.rstr2b64(rstr_md5(str2rstr_utf8(s))); }
		any_md5(s, e) { return rstr2any(rstr_md5(str2rstr_utf8(s)), e); }
		hex_hmac_md5(k, d)  { return this.rstr2hex(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
		b64_hmac_md5(k, d)  { return this.rstr2b64(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))); }
		any_hmac_md5(k, d, e)  { return rstr2any(rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
		// SHA-1 encoding functions
		hex_sha1(s)    { return this.rstr2hex(rstr_sha1(str2rstr_utf8(s))); }
		b64_sha1(s)    { return this.rstr2b64(rstr_sha1(str2rstr_utf8(s))); }
		any_sha1(s, e) { return rstr2any(rstr_sha1(str2rstr_utf8(s)), e); }
		hex_hmac_sha1(k, d)  { return this.rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
		b64_hmac_sha1(k, d)  { return this.rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d))); }
		any_hmac_sha1(k, d, e)  { return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e); }
		// SHA-256 encoding functions
		hex_sha256(s)    { return this.rstr2hex(rstr_sha256(str2rstr_utf8(s))); }
		b64_sha256(s)    { return this.rstr2b64(rstr_sha256(str2rstr_utf8(s))); }
		any_sha256(s, e) { return rstr2any(rstr_sha256(str2rstr_utf8(s)), e); }
		hex_hmac_sha256(k, d)  { return this.rstr2hex(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
		b64_hmac_sha256(k, d)  { return this.rstr2b64(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d))); }
		any_hmac_sha256(k, d, e)  { return rstr2any(rstr_hmac_sha256(str2rstr_utf8(k), str2rstr_utf8(d)), e); }

		rstr2hex(input)
		{
			try { this.hexcase } catch(e) { this.hexcase = 0; }
			var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
			var output = "";
			var x;
			for(var i = 0; i < input.length; i++)
			{
				x = input.charCodeAt(i);
				output += hex_tab.charAt((x >>> 4) & 0x0F)
	           +  hex_tab.charAt( x        & 0x0F);
			}
		return output;
		}
		rstr2b64(input)
		{
			try { this.b64pad } catch(e) { this.b64pad=''; }
			var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			var output = "";
			var len = input.length;
			for(var i = 0; i < len; i += 3)
				{
				var triplet = (input.charCodeAt(i) << 16)
		                | (i + 1 < len ? input.charCodeAt(i+1) << 8 : 0)
		                | (i + 2 < len ? input.charCodeAt(i+2)      : 0);
				for(var j = 0; j < 4; j++)
					{
						if(i * 8 + j * 6 > input.length * 8) output += this.b64pad;
						else output += tab.charAt((triplet >>> 6*(3-j)) & 0x3F);
					}
				}
			return output;
		}
	};
}