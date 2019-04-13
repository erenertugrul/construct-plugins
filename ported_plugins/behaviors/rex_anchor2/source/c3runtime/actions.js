"use strict";

{
	C3.Behaviors.rex_Anchor2.Acts =
	{

		SetEnabled(e)
		{
	        var e = (e === 1);       
	        
	        if (!this.enabled && e)
	            this.set_update_flag();
	        
	        this.enabled = e;
		},

		SetHorizontalAlignMode(m)
		{
	        if (m !== 4)
	            this.set_update_flag();
	        
	        this.alignModeX = m;        
		},	

		SetHorizontalPosition(p)
		{
	        this.set_update_flag();
	        
	        this.viewPortScaleX = p;       
		},	    

		SetVerticalAlignMode(m)
		{
	        if (m !== 4)
	            this.set_update_flag();
	        
	        this.alignModeY = m;        
		},	

		SetVerticalPosition(p)
		{
	        this.set_update_flag();
	        
	        this.viewPortScaleY = p;       
		}	   
	};
}