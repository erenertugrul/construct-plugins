"use strict";

{
	C3.Plugins.Rex_taffydb.Cnds =
	{
	    ForEachRow() {
	        var queriedRows = this.GetCurrentQueriedRows();

	    	var current_frame = this._runtime.GetEventSheetManager().GetCurrentEventStackFrame();
	   		var current_event = current_frame.GetCurrentEvent();
	   		var solmod = current_event.GetSolModifiers();
	    	var solModifierAfterCnds = current_frame.IsSolModifierAfterCnds();
	    	var c = this._runtime.GetEventSheetManager().GetEventStack();
	    	var p = this._runtime.GetEventStack(); 
	    	var h = c.Push(current_event);
	        var self = this;

	        var for_each_row = function (r, i) {
	            if (solModifierAfterCnds) {
                    this._runtime.GetEventSheetManager().PushCopySol(solmod);
                    p.Pop();
	            }

	            self.exp_CurRowID = r["___id"];
	            self.exp_CurRowIndex = i;
	            current_event.Retrigger(current_frame,h);


	            if (solModifierAfterCnds) {
                    this._runtime.GetEventSheetManager().PopSol(solmod);
                    p.Pop();
	            }
	        };
	        queriedRows["each"](for_each_row);

	        this.exp_CurRowID = "";
	        this.exp_CurRowIndex = -1;

	        return false;
	    },

	    NewFilters() {
	        this.NewFilters();
	        return true;
	    },

	    AddValueComparsion(k, cmp, v) {
	        this.AddValueComparsion(k, cmp, v);
	        return true;
	    },

	    AddBooleanValueComparsion(k, v) {
	        this.AddValueComparsion(k, 0, (v === 1));
	        return true;
	    },

	    AddValueInclude(k, v) {
	        this.AddValueInclude(k, v);
	        return true;
	    },

	    AddRegexTest(k, s, f) {
	        this.AddRegexTest(k, s, f);
	        return true;
	    },

	    AddOrder(k, order_) {
	        this.AddOrder(k, order_);
	        return true;
	    }

	};
}
