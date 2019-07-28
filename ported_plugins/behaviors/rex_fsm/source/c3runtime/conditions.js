"use strict";

{
	C3.Behaviors.Rex_FSM.Cnds =
	{
		OnEnter(name)
		{
		    var is_my_handler = (this.check_state == name);
	        this.is_echo |= is_my_handler;
			return is_my_handler;
		},

		OnDefaultEnter()
		{
			return (this.is_my_call);
		}, 	
		
		OnExit(name)
		{
		    var is_my_handler = (this.check_state == name);
	        this.is_echo |= is_my_handler;
			return is_my_handler;
		},	
	    
		OnDefaultExit()
		{
			return (this.is_my_call);
		}, 	    

		OnTransfer(name_from, name_to)
		{
		    var is_my_handler = (this.check_state == name_from) && (this.check_state2 == name_to);
	        this.is_echo |= is_my_handler;
			return is_my_handler;
		},	
		OnStateChanged()
		{
			return (this.is_my_call);
		},     
		OnLogic(name)
		{
		    var is_my_handler = (this.fsm.CurState == name);
	        this.is_echo |= is_my_handler;
			return is_my_handler;
		}, 
		IsCurState(name)
		{
			return (this.fsm.CurState == name);
		},
		
		IsPreState(name)
		{
			return (this.fsm.PreState == name);
		},     
	    
		OnDefaultLogic()
		{
			return (this.is_my_call);
		}
	};
}