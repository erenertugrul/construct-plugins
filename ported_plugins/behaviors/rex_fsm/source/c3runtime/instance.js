"use strict";

{
	C3.Behaviors.Rex_FSM.Instance = class Rex_FSMInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
			this.activated = (properties[0] == 1);
			var previous_state = "Off";		
			var current_state = properties[1];		
	        current_state = (current_state!="")? current_state:"Off";
	        
	        if (!this.recycled)               	           
	            this.fsm = new C3.Behaviors.Rex_FSM.FSMKlass(this, previous_state, current_state);         
	        else
	            this.fsm.Reset(this, previous_state, current_state);
	        
	        this.check_state = null; 
	        this.check_state2 = null;
	        this.is_my_call = null;        
	        this.is_echo = false;
	        this.next_state = null;   
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"en": this.activated,
	         	"fsm": this.fsm.saveToJSON()
			};
		}

		LoadFromJson(o)
		{
		    this.activated = o["en"];
	    	this.fsm.loadFromJSON(o["fsm"]);
		}
		GetDebuggerProperties()
		{
			const prefix = "Rex_FSM";
			return [{
				title: prefix,
				properties: [
					{name:"Current",value: this.fsm.CurState},
					{name:"Previous",value: this.fsm.PreState}
				]
			}];
		}
		run_trigger(trigger)
	    {
	        this.is_echo = false;
	        this.Trigger(trigger, this.inst);
	        return (this.is_echo);        
	    }
		
	    get_next_state()
	    {
	        this.next_state = null;
	        this.is_my_call = true;
			var is_echo = this.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnLogic);
			if (!is_echo)
			    this.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnDefaultLogic);
	        
	        this.is_my_call = null;
	        return this.next_state;
	    } 
		
		/*
		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			// ... code to run every tick for this behavior ...
		}
		*/
	};
}