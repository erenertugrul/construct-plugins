"use strict";

{
	C3.Behaviors.Rex_FSM = class Rex_FSM extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
			(function ()
			{
			    C3.Behaviors.Rex_FSM.FSMKlass = function(plugin, previous_state, current_state)
			    {
			        this.Reset(plugin, previous_state, current_state);
			    };
			    var FSMKlassProto = C3.Behaviors.Rex_FSM.FSMKlass.prototype;

			    FSMKlassProto.Reset = function(plugin, previous_state, current_state)
			    {
			        this.plugin = plugin;
			        this.PreState = previous_state;
			        this.CurState = current_state;
			    };
			    
			    FSMKlassProto.Request = function(new_state)
			    {
			        if (new_state == null)
			        {
			            new_state = this.plugin.get_next_state();
			            if (new_state == null)
			                return;
			        }
			            
			        // new_state != null: state transfer
			        this.PreState = this.CurState;
			        this.CurState = new_state;
			                
			        var pre_state = this.PreState;
			        var cur_state = this.CurState;
			        
			        // trigger OnStateChanged first
			        this.plugin.is_my_call = true;        
					this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnStateChanged);
			        
			                        
			        // try to run transfer_action
			        var is_echo = this._run_transfer_action(pre_state, cur_state);   
			        this.plugin.is_my_call = null;        
			        if (is_echo)
			            return;
			         
			        // no transfer_action found
			        this._run_exit_action(pre_state);
			        this._run_enter_action(cur_state);
			    };
			    
			    FSMKlassProto._run_transfer_action = function(pre_state, cur_state)
			    {
			        this.plugin.check_state = pre_state;
			        this.plugin.check_state2 = cur_state;
			        var is_echo = this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnTransfer);
			        this.plugin.check_state = null;
			        this.plugin.check_state2 = null; 
			        return is_echo;
			    };    

			    FSMKlassProto._run_exit_action = function(pre_state)
			    {
			        this.plugin.check_state = pre_state;
				    var is_echo = this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnExit);
				    this.plugin.check_state = null;	    
			        // no exit handle event, try to trigger default exit event
					if (is_echo)
					{
					    return;
					}
			        this.plugin.is_my_call = true;
				    this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnDefaultExit);  
			        this.plugin.is_my_call = null;
			    };
			    
			    FSMKlassProto._run_enter_action = function(cur_state)
			    {
			        this.plugin.check_state = cur_state;
				    var is_echo = this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnEnter);
				    this.plugin.check_state = null;
			        // no enter handle event, try to trigger default enter event
					if (is_echo)
					{
					    return;
					}
			        this.plugin.is_my_call = true;
				    this.plugin.run_trigger(C3.Behaviors.Rex_FSM.Cnds.OnDefaultEnter);    
			        this.plugin.is_my_call = false;        
			    };  
				
				FSMKlassProto.saveToJSON = function ()
				{    
					return { "ps": this.PreState,
					         "cs": this.CurState
						   };
				};
				
				FSMKlassProto.loadFromJSON = function (o)
				{
				    this.PreState = o["ps"];
					this.CurState = o["cs"];
				};	
			}());
		}
		
		Release()
		{
			super.Release();
		}
	};
}