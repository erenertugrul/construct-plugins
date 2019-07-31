"use strict";

{
	C3.Plugins.eren_jszip.Cnds =
	{
		OnCreatedZip()
		{
			return true;
		},
		OnDownloadedZip()
		{
			return true;
		},
		OnReadedZip() 
		{
			return true;
		},
		OnReadedFile() 
		{
			return true;
		},
		OnCreatedDir() 
		{
			return true;
		},
		OnAddedFile() 
		{
			return true;
		},
		OnAddedSprite() 
		{
			return true;
		},
		OnErrorAny() 
		{
			return true;
		},
		Foreachlist() 
		{
				
			var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
			var current_event = current_frame.GetCurrentEvent();
			var solmod = current_event.GetSolModifiers();
			var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
			var c = this._runtime.GetEventSheetManager().GetEventStack();
			var p = this._runtime.GetEventStack(); 
			var h = c.Push(current_event);
			
			this.foritems = "";
		    this.foritemurl = "";
		    var items = this.itemlist;
			var iurl = this.itemurl;
		    var item_cnt = items.length;
		    var i;
			for (i=0; i<item_cnt; i++ )
		    {
		        if (solModifierAfterCnds)
			        this._runtime.GetEventSheetManager().PushCopySol(solmod);
		            
		        this.foritems = items[i];
				this.foritemurl = iurl[i];
			    current_event.Retrigger(current_frame,h);
			    	
		        if (solModifierAfterCnds)
			    	this._runtime.GetEventSheetManager().PopSol(solmod);
		   }        
			this.foritems = "";
			this.itemlist = [];
			this.foritemurl ="";
			this.itemurl = [];
			p.Pop();
		},
		OnRemovedFile() 
		{
			return true;
		},
		OnExtractZip() 
		{
			return true;
		},
		OnWritedFile() 
		{
			return true;
		},
		OnClosedZip() 
		{
			return true;
		}
	};
}