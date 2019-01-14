"use strict";

{
	C3.Plugins.SimpleQRScanner.Cnds =
	{
		onDecoded()
		{
			return true;
		},

		onDecodeError()
		{
			return true;
		},

		onDecodeCancel()
		{
			return true;
		}
	};
}


