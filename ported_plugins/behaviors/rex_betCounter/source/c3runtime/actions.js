"use strict";

{
	C3.Behaviors.Rex_betCounter.Acts =
	{
		Beat(count)
		{
			this.beat(count);
		},  

		Clean()
		{
			this.beat_recorder.length = 0;
		}   
	};
}