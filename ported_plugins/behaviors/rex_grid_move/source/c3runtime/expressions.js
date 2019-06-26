"use strict";

{
	C3.Behaviors.Rex_GridMove.Exps =
	{

		Activated()
		{
			return((this._cmd_move_to.activated)? 1:0);
		},    

		Speed()
		{
			return(this._cmd_move_to.current_speed);
		},

		MaxSpeed()
		{
			return(this._cmd_move_to.move_params["max"]);
		}, 

		Acc()
		{
			return(this._cmd_move_to.move_params["acc"]);
		},  

		Dec()
		{
			return(this._cmd_move_to.move_params["dec"]);
		}, 

		TargetX()
		{
			return(this.exp_TargetPX);
		},  

		TargetY()
		{
			return(this.exp_TargetPY);
		},     

		BlockerUID()
		{
			return(this.exp_BlockerUID);		
		}, 

		Direction()
		{
			return(this.exp_Direction);		
		},

		DestinationLX()
		{
			return(this.exp_DestinationLX);		
		},    

		DestinationLY()
		{
			return(this.exp_DestinationLY);		
		},  	

		DestinationLZ()
		{
			return(this.exp_DestinationLZ);		
		},  

		SourceLX()
		{
			return(this.exp_SourceLX);		
		},  	

		SourceLY()
		{
			return(this.exp_SourceLY);		
		},  

		SourceLZ()
		{
			return(this.exp_SourceLZ);		
		} 		

	};
}