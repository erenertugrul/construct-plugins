"use strict";

{
	C3.Plugins.Rex_FSM.Cnds =
	{
		OnEnter(name)
		{
		    var is_my_handler = (this.check_state == name);
		    this.is_echo |= is_my_handler;
			return is_my_handler;
		},

		OnDefaultEnter()
		{
			return true;
		}, 	

		OnExit(name)
		{
		    var is_my_handler = (this.check_state == name);
		    this.is_echo |= is_my_handler;
			return is_my_handler;
		},	

		OnDefaultExit()
		{
			return true;
		}, 	    

		OnTransfer(name_from, name_to)
		{
		    var is_my_handler = (this.check_state == name_from) && (this.check_state2 == name_to);
		    this.is_echo |= is_my_handler;
			return is_my_handler;
		},	

		OnStateChanged()
		{
			return true;
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
			return true;
		} 
	};
}