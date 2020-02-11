"use strict";
	var _get_uid = function(objs)
	{
        var uid;
	    if (objs == null)
	        uid = null;
	    else if (typeof(objs) === "object")
	    {
	        var inst = objs.GetFirstPicked();
	        uid = (inst!=null)? inst.GetUID():null;
	    }
	    else
	        uid = objs;
            
        return uid;
	};
	var _dir_sequence_init = function (arr, dir_count)
	{
		var i;
		arr.length = 0;
		for (i=0; i<dir_count; i++)
		    arr.push(i);
	};
	var _solid_get = function(inst)
	{
	    return (inst && inst.GetSavedDataMap().get("solidEnabled"));
	};
	var _shuffle = function (arr, random_gen)
	{
	    var i = arr.length, j, temp, random_value;
	    if ( i == 0 ) return;
	    while ( --i ) 
	    {
	        random_value = (random_gen == null)?
	                       Math.random(): random_gen.random();
	        j = Math.floor( random_value * (i+1) );
	        temp = arr[i]; 
	        arr[i] = arr[j]; 
	        arr[j] = temp;
	    }
	};   
	function GetThisBehavior(inst) //düzenle
	{
 		var d = inst.GetObjectClass().GetInstances();
        for (var e of d) {
            var d = e.GetBehaviorSdkInstanceFromCtor(C3.Behaviors.Rex_GridMove);
            if (d)
            {
            	return d;
            }  
        }
        return null;
	};
	    // AI - Approach / Depart
    // helper
	var _get_logic_distance = function(board, target_insts, my_lx, my_ly, my_lz)
	{
        var layout=board.GetLayout();
        var i,cnt=target_insts.length, inst;
        var target_xyz, total_dist_sum=0;
        for (i=0; i<cnt; i++)
        {
            inst = target_insts[i];
            target_xyz = board.uid2xyz(inst.GetUID());
            if (target_xyz == null)
                continue;
            
            total_dist_sum += layout.LXYZ2Dist(my_lx, my_ly, my_lz, target_xyz.x, target_xyz.y, target_xyz.z, true);         
        }
        return total_dist_sum;
	};
    var _ApproachOrDepart_dist2lxy = [];
    var _ApproachOrDepart_dist2lxy_sort_fn = function(pA, pB)
	{   
	    return (pA.d < pB.d) ? -1 : (pA.d > pB.d) ? 1 : 0;
	};
		 
{
	C3.Behaviors.Rex_GridMove = class Rex_GridMove extends C3.SDKBehaviorBase
	{
		constructor(opts)
		{
			super(opts);
			(function ()
			{
			    var MoveSegment = function (x0, y0, x1, y1)
			    {
			        if (arguments.length > 0)
			            this.Reset(x0, y0, x1, y1);
			        else 
			            this.Reset(0, 0, 0, 0);
			    }
			    var MoveSegmentProto = MoveSegment.prototype;
			    
			    MoveSegmentProto.Reset = function(x0, y0, x1, y1)
			    {
			        this.x0 = x0;
			        this.y0 = y0;
			        this.x1 = x1;
			        this.y1 = y1;
			        this.angle = C3.angleTo(x0, y0, x1, y1);
			        this.remain_distance = C3.distanceTo(this.x0, this.y0, this.x1, this.y1);
			    };
			    
			    MoveSegmentProto.GetRemainDistance = function(d)
			    {
			        this.remain_distance -= d;
			        return this.remain_distance;
			    };
				MoveSegmentProto.saveToJSON = function ()
				{
					return { "x0": this.x0,
					         "y0": this.y0,
			                 "x1": this.x1,
			                 "y1": this.y1,
			                 "a" : this.angle,
			                 "rd" : this.remain_distance
			               };
				};
				
				MoveSegmentProto.loadFromJSON = function (o)
				{  
					this.x0 = o["x0"];
					this.y0 = o["y0"]; 
					this.x1 = o["x1"];
					this.y1 = o["y1"]; 
					this.angle = o["a"];
					this.remain_distance = o["rd"];
				};
				        
			    C3.Behaviors.Rex_GridMove.MoveSegment = MoveSegment;
			    
			    
			    var CmdMoveTo = function(plugin)
			    {     
			        this.move_params = {"max":0,
			                            "acc":0,
			                            "dec":0};
			        this.segments = [];
			    };
			    var CmdMoveToProto = CmdMoveTo.prototype;
			    
				CmdMoveToProto.Reset = function(plugin,behInst)
				{
					var a = plugin;
			        this.activated = a[0];
			        this.move_params["max"] = a[1];
			        this.move_params["acc"] = a[2];
			        this.move_params["dec"] = a[3];
			        this.is_continue_mode = (a[8] == 1);
			        this.segments.length = 0;
			        this.is_moving = false;  
			        this.current_speed = 0;
			        this.remain_distance = 0;  // used to control the moving speed
			        this.remain_dt = 0;
			        this.is_my_call = false; 
			        
			        this.inst = behInst._inst;
			        this.runtime = behInst._runtime;
				};
			    
			    CmdMoveToProto.tick = function ()
				{  

			        this.remain_dt = 0;	    
			        if ( (!this.activated) || (!this.is_moving) )         
			            return;
			        
					var dt = this.runtime.GetDt(this.inst);
			        this.move(dt);
				};
				
			    CmdMoveToProto.move = function (dt)
				{
				    if (dt == 0)    // can not move if dt == 0
				        return;
				        
			        // assign speed
			        var is_slow_down = false;
			        if (this.move_params["dec"] != 0)
			        {
			            // is time to deceleration?                
			            var _speed = this.current_speed;
			            var d = (_speed*_speed)/(2*this.move_params["dec"]); // (v*v)/(2*a)
			            is_slow_down = (d >= this.remain_distance);
			        }
			        var acc = (is_slow_down)? (-this.move_params["dec"]):this.move_params["acc"];
			        if (acc != 0)
			        {
			            this._set_current_speed( this.current_speed + (acc * dt) );    
			        }

					// Apply movement to the object     
			        var distance = this.current_speed * dt;
			        this.remain_distance -= distance;  
			        var cur_seg = this.segments[0];
			        var seg_remain_distance = cur_seg.GetRemainDistance( distance );       
			        var is_hit_target = false;
			        // is hit to target of current segment?
			        if ( (seg_remain_distance <= 0) || (this.current_speed <= 0) )
			        {
			            if (this.segments.length == 1)
			            {
			                is_hit_target = true;        // trigger on hit target
			                this.inst.GetWorldInfo().SetX(cur_seg.x1);
			                this.inst.GetWorldInfo().SetY(cur_seg.y1);
			                this.segments.length = 0;
			                
			                // remain dt
			                if ( this.current_speed > 0)  // not stop
			                    this.remain_dt = (-seg_remain_distance)/this.current_speed;
			                    
			                this._set_current_speed(0);
			            }
			            else
			            {
			                this.segments.shift(); 
			                this.set_star_pos(seg_remain_distance);
			            }
			        }
			        else
			        {
			            var angle = cur_seg.angle;
			            this.inst.GetWorldInfo().SetX(this.inst.GetWorldInfo().GetX() + distance * Math.cos(angle));
			            this.inst.GetWorldInfo().SetY(this.inst.GetWorldInfo().GetY() + distance * Math.sin(angle));
			        }        
			        this.inst.GetWorldInfo().SetBboxChanged();
					
			        if (is_hit_target)
			        {                                    
			            this.is_moving = false;             
			            this.is_my_call = true;
			            //this.runtime.Trigger(C3.Behaviors.Rex_GridMove.Cnds.OnHitTarget,this.inst); 
			            var i = GetThisBehavior(this.inst);
			            i.construct_bug(this);
			            this.is_my_call = false;          
			        } 
				};	
				
				CmdMoveToProto._set_current_speed = function(speed)
				{
			        if (speed != null)
			        {
			            this.current_speed = (speed > this.move_params["max"])? 
			                                 this.move_params["max"]: speed;
			        }        
			        else if (this.move_params["acc"]==0)
			        {
			            this.current_speed = this.move_params["max"];
			        }
				};  
			    
				CmdMoveToProto.move_start = function ()
				{
			        this.segments.length = 0;
			        this.remain_distance = 0;        
			        var i, cnt=arguments.length, seg;
			        for(i=0; i<cnt; i++)
			        {
			            seg = arguments[i];
			            this.segments.push(seg);
			            this.remain_distance += seg.remain_distance;
			        }
			        
			        this._set_current_speed(null);
			        this.is_moving = true;
			        this.set_star_pos();
			        
			        if (this.is_continue_mode)
			            this.move(this.remain_dt);
				};
			    
				CmdMoveToProto.set_star_pos = function (offset_distance)
				{
				    var cur_seg = this.segments[0];
				    var offx=0, offy=0;
				    if ((offset_distance != null) && (offset_distance != 0))
				    {
				        offx = offset_distance * Math.cos(cur_seg.angle);
				        offy = offset_distance * Math.sin(cur_seg.angle);
				        cur_seg.GetRemainDistance( offset_distance )
				    }
			        this.inst.GetWorldInfo().SetX(cur_seg.x0 + offx);
			        this.inst.GetWorldInfo().SetY(cur_seg.y0 + offy);
			        this.inst.GetWorldInfo().SetBboxChanged();
			    };	

				CmdMoveToProto.saveToJSON = function ()
				{
				    var i, cnt=this.segments.length;
				    var seg_save = [];
				    for (i=0; i<cnt; i++)
				    {
				        seg_save.push(this.segments[i].saveToJSON());
				    }
					return { "en": this.activated,
					         "v": this.move_params,
			                 "is_m": this.is_moving,
			                 "c_spd" : this.current_speed,
			                 "rd" : this.remain_distance,
			                 "seg" : seg_save
			               };
				};
				
				CmdMoveToProto.loadFromJSON = function (o)
				{  
					this.activated = o["en"];
					this.move_params = o["v"];
					this.is_moving = o["is_m"]; 
					this.current_speed = o["c_spd"];
					this.remain_distance = o["rd"];
					
				    var seg_save = o["seg"];		
				    var i, cnt=seg_save.length;
				    for (i=0; i<cnt; i++)
				    {
				        var seg = new MoveSegment();
				        seg.loadFromJSON(seg_save[i]);
				        this.segments.push(seg);
				    }		
				};	
			    
			    C3.Behaviors.Rex_GridMove.CmdMoveTo = CmdMoveTo;
			}());  
		}
		
		Release()
		{
			super.Release();
		}
	};
}