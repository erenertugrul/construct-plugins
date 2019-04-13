"use strict";

{
	C3.Behaviors.Rex_betCounter.Instance = class Rex_betCounterInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			
		    this.max_interval = properties[0];
	        this.beat_recorder = [];
			this.cur_time = 0;
	        this.pre_value = 0;
			
			// Opt-in to getting calls to Tick()
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				"ct": this.cur_time,
	         	"br": this.beat_recorder,
	         	"pv": this.pre_value 
			};
		}

		LoadFromJson(o)
		{
			this.cur_time = o["ct"];
	        this.beat_recorder = o["br"];
	        this.pre_value = o["pv"];
		}
		
		Tick()
		{ 
	        var cnt = this.beat_recorder.length;	
		    if (cnt == 0)
			{
			    this.cur_time = 0;
				return;
			}

			this.cur_time += this._runtime.GetDt(this._inst);
			this._beat_recorder_update();
		}
	    
		_beat_recorder_update()
		{ 
	        var i, cnt = this.beat_recorder.length;	
	        this.pre_value = cnt;
			for (i=0; i<cnt; i++)
			{
			    if ((this.cur_time - this.beat_recorder[i]) <= this.max_interval)
				    break;
			}
			
			if (i > 0)
			{
	            if (i == 1)
	                this.beat_recorder.shift();
	            else
	                this.beat_recorder.splice(0,i);		
	        }
	        
	        if (this.beat_recorder.length != this.pre_value)
	            this.Trigger(C3.Behaviors.Rex_betCounter.Cnds.OnValueChanged);  
		}
		beat(count)
		{   
	        for(var i=0; i<count; i++)
		        this.beat_recorder.push(this.cur_time);
	            
	        this.Trigger(C3.Behaviors.Rex_betCounter.Cnds.OnValueChanged);   
		} 
		
	};
}