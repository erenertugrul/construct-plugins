"use strict";

{
	C3.Plugins.ExtraExps.Exps =
	{
		find(text, source)
		{
			return(source.search(new RegExp(C3.EscapeRegex(text), "")));
		},

		// character to charcode
		char2code(character)
		{
			return(character.charCodeAt(0));
		},

		// charcode to character
		code2char(code)
		{
			return(String.fromCharCode(code));
		},

		// cosine interpolation
		cosp(a, b, t)
		{
			var i;
			i = (1 - Math.cos(t * Math.PI)) / 2;
			return(a * (1 - i) + b * i);
		},

		// X offset
		offsetX(x, angle, dist)
		{
			return(x + Math.cos(C3.toRadians(angle)) * dist);
		},

		// Y offset
		offsetY(y, angle, dist)
		{
			return(y + Math.sin(C3.toRadians(angle)) * dist);
		},

		// snap to grid
		snap(x, grid)
		{
			return(Math.round(x / grid) * grid);
		},

		// encode to Base64
		encode(text)
		{
			return(Base64.encode(text));
		},

		decode(text)
		{
			return(Base64.decode(text));
		},

		findToken(text, token, delim, csent)
		{
			var casesent = csent === 1 ? true : false;
			var tokens = null;
			if(casesent)
			{
				tokens = text.split(delim);
				return(tokens.indexOf(token));
			}
			else
			{
				tokens = text.toLowerCase();
				tokens = tokens.split(delim);
				return(tokens.indexOf(token.toLowerCase()));
			}
		}
	};
}