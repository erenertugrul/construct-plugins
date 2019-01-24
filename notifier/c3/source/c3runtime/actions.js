"use strict";
{
	C3.Plugins.erenertugrul_notifier.Acts =
	{
		notifier(title,msg,type,icon,timeout)
		{
			var _t = _type[type]
			this._notificationId = _notifier["show"](title ,msg,_t,icon, (timeout*1000));
		},

		hide_notifier()
		{
			_notifier["hide"](this._notificationId);
		},

		sprite_notifier(title,msg,type,icon,timeout)
		{
			var _t = _type[type]
			var c = null;
			const e = icon.GetFirstPicked();
			if (e) {
				const b = e.GetCurrentImageInfo();
				b && b.ExtractImageToCanvas().then((b) => {
					c = b.toDataURL("image/png");
					this._notificationId = _notifier["show"](title ,msg,_t, c, (timeout*1000));
				}); 
			}
			else{
				var a = this._runtime.CreateInstance(icon, 0, -500, -500);
				var d = a.GetCurrentImageInfo();
				d && d.ExtractImageToCanvas().then((d) => {
					c = d.toDataURL("image/png");
					this._notificationId = _notifier["show"](title ,msg,_t, c, (timeout*1000));
				});
				
			}
		}
	};
}