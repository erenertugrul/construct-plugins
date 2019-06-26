"use strict";

{
	C3.Behaviors.Rex_GridMove.Acts =
	{
		SetActivated(s)
		{
			this._cmd_move_to.activated = (s==1);
		},

		SetMaxSpeed(s)
		{
			this._cmd_move_to.move_params["max"] = s;
		    this._cmd_move_to._set_current_speed(null);
		},      

		SetAcceleration(a)
		{
			this._cmd_move_to.move_params["acc"] = a;
		    this._cmd_move_to._set_current_speed(null);
		},

		SetDeceleration(a)
		{
			this._cmd_move_to.move_params["dec"] = a;
		},

		SetCurrentSpeed(s)
		{
		    this._cmd_move_to._set_current_speed(s);
		}, 

		MoveToNeighbor(dir)
		{
		    if (!this._cmd_move_to.activated)
		        return;

		    var xyz = this.chess_xyz_get();
		    if (xyz == null)
		        return;
		        
		    var board = this.GetBoard();
		    var tx = board.GetNeighborLX(xyz.x, xyz.y, dir);
		    var ty = board.GetNeighborLY(xyz.x, xyz.y, dir);
		    var tz = xyz.z;
		    this.colliding_checking(tx, ty, tz, dir);        
		    this.move_to_target(tx, ty, tz, dir);
		},

		MoveToLXY(lx, ly)
		{
		    if (!this._cmd_move_to.activated)
		        return;
		        
			var xyz = this.chess_xyz_get();
		    if (xyz == null)
		        return;
		        
			var tx = lx;
		    var ty = ly;
		    var tz = xyz.z;
		    var dir = this.target2dir(tx, ty, tz);
		    this.colliding_checking(tx, ty, tz, dir);  
			this.move_to_target(tx, ty, tz, dir);	    
		}, 

		MoveToOffset(dx, dy)
		{
		    if (!this._cmd_move_to.activated)
		        return;
		        
			var xyz = this.chess_xyz_get();
		    if (xyz == null)
		        return;
		    
		    var board = this.GetBoard();
			var tx = board.WrapLX(xyz.x+dx);
		    var ty = board.WrapLY(xyz.y+dy);
		    var tz = xyz.z;
		    var dir = this.target2dir(tx, ty, tz);
		    this.colliding_checking(tx, ty, tz, dir);    
			this.move_to_target(tx, ty, tz, dir);
		},    

		MoveToTargetChess(objtype)
		{
		    if (!this._cmd_move_to.activated)
		        return;
		    var uid = _get_uid(objtype);
		    if (uid == null)
		        return;
		    var target_xyz = this.chess_xyz_get(uid);
			if (target_xyz == null)
			    return;
				
			var xyz = this.chess_xyz_get();
		    if (xyz == null)
		        return;
		        
			var tx = target_xyz.x;
		    var ty = target_xyz.y;
		    var tz = xyz.z;
		    var dir = this.target2dir(tx, ty, tz);
		    this.colliding_checking(tx, ty, tz, dir);    
			this.move_to_target(tx, ty, tz, dir);	             
		}, 

		Swap(chessB_uid)
		{
		    var chessB_inst = this._chess_inst_get(chessB_uid);
		    if (chessB_inst == null)
		        return;
		    var chessB_binst = GetThisBehavior(chessB_inst);      
		    if (chessB_binst == null)
		        return;    
		        
		    var my_xyz = this.chess_xyz_get(this.inst.GetUID());              
		    var chessB_xyz = this.chess_xyz_get(chessB_uid);          
		    if ((my_xyz == null) || (chessB_xyz == null))
		        return;
		          
		    // physical moving
		    var my_dir = this.target2dir(chessB_xyz.x, chessB_xyz.y, chessB_xyz.z);
		    this.moveto_pxy(chessB_xyz.x, chessB_xyz.y, chessB_xyz.z, my_dir);
		    var chessB_dir = chessB_binst.target2dir(my_xyz.x, my_xyz.y, my_xyz.z);
		    chessB_binst.moveto_pxy(my_xyz.x, my_xyz.y, my_xyz.z, chessB_dir);
		    // logical swap
		    this.GetBoard().SwapChess(this.inst.GetUID(), chessB_uid);
		    
		    // request success
		    this.set_move_target(chessB_xyz.x, chessB_xyz.y, chessB_xyz.z, my_dir);
		    chessB_binst.set_move_target(my_xyz.x, my_xyz.y, my_xyz.z, chessB_dir);
		    this.on_moving_request_success(true);
		    chessB_binst.on_moving_request_success(true);    
		},  
		Wander()
		{
		    if (!this._cmd_move_to.activated)
		        return;
		        
			var xyz = this.chess_xyz_get();
			if (xyz == null)
			    return;
			
			var board = this.GetBoard();
			var layout = this.GetBoard().layout;
			var init_lx = this._wander["o"]["x"];
			var init_ly = this._wander["o"]["y"];
			var range_x = this._wander["rx"];
			var range_y = this._wander["ry"];		
			_shuffle(this._dir_sequence, this.GetSdkType().randomGen);
			var i, dir, dir_count=this._dir_sequence.length;
			var tx, ty, tz=xyz.z, can_move;
			for (i=0; i<dir_count; i++)
			{
			    dir = this._dir_sequence[i];
			    tx = board.GetNeighborLX(xyz.x, xyz.y, dir);
			    ty = board.GetNeighborLY(xyz.x, xyz.y, dir);	
		        if ((Math.abs(tx-init_lx) > range_x) || 
				    (Math.abs(ty-init_ly) > range_y))
					continue;
			    can_move = this.move_to_target(tx, ty, tz, dir);	    
				if (can_move)
				    break;
		    }	
		},

		SetWanderRangeX(range_x)
		{
		    if (range_x < 0)
			    range_x = 0;
		    this._wander["rx"] = range_x;
		},   

		SetWanderRangeY(range_y)
		{
		    if (range_y < 0)
			    range_y = 0;
		    this._wander["ry"] = range_y;
		}, 

		SetRandomGenerator(random_gen_objs)
		{
		    var random_gen = random_gen_objs.instances[0];
		    if (random_gen.check_name == "RANDOM")
		        this.GetSdkType().randomGen = random_gen;        
		}, 

		ResetWanderCenter()
		{
		    var xyz = this.chess_xyz_get();
			if (xyz == null)
			    return;        
		    this._wander["o"]["x"] = xyz.x;
		    this._wander["o"]["y"] = xyz.y;
		    this._wander["o"]["z"] = xyz.z;       
		},  

		SetDestinationSolid(is_solid)
		{
		    this.is_customSolid =  (is_solid > 0);
		},

		SetDestinationMoveable(is_moveable)
		{
		    this.is_customSolid =  (!(is_moveable > 0));
		},	

		SetInstanceGroup(group_objs)
		{
		    var group = group_objs.instances[0];
		    if (group.check_name == "INSTGROUP")
		        this.GetSdkType().group = group;                    
		},   


		ApproachOrDepart(chess_objs, is_depart)
		{
		    if (!this._cmd_move_to.activated)
		        return;
			var xyz = this.chess_xyz_get();
			if (xyz == null)
			    return;   
		    // get targets            
		    var target_insts;
		    if (typeof chess_objs == "number")
		    {
		        var inst = this._runtime.GetInstanceByUID(chess_objs);
		        if (inst == null)
		            return;
		        target_insts = [inst];
		    }
		    else if (typeof chess_objs == "string")
		    {
		        var uids = JSON.parse(chess_objs);
		        var i, cnt=uids.length, inst;
		        target_insts = [];
		        for (i=0; i<cnt; i++)
		        {
		            inst = this._runtime.GetInstanceByUID(uids[i]);
		            if (inst == null)
		                continue;
		            target_insts.push(inst);
		        }
		    }       
		    else
		    {
		        if (!chess_objs)
		            return;
		        target_insts = chess_objs.GetCurrentSol().GetInstances();
		    }
		    if (target_insts.length === 0)
		        return;          
		    // ----   
		    var board = this.GetBoard();
		    var layout = board.GetLayout();        
		    var i, dir_count=this._dir_sequence.length;
		    var tx, ty, tz=xyz.z, can_move, pd;  
		    
		    // get current distance
		    pd = _get_logic_distance(board, target_insts, xyz.x, xyz.y, xyz.z);
		    if (target_insts.length === 1)    // single target instance
		    {
		        if (pd === 0)
		            return;  // overlap with target
		    }
		    else    // mutiple target instances
		        _ApproachOrDepart_dist2lxy.push({d:pd, lx:tx, ly:ty});
		        
		    // get neighbors' distance
			for (i=0; i<dir_count; i++)
			{		  
			    tx = board.GetNeighborLX(xyz.x, xyz.y, i);
			    ty = board.GetNeighborLY(xyz.x, xyz.y, i);
			    can_move = this.test_move_to(tx, ty, tz, i);	    
				if (can_move != 1)
				    continue;
		        
		        pd = _get_logic_distance(board, target_insts, tx, ty, tz);
		        _ApproachOrDepart_dist2lxy.push({d:pd, lx:tx, ly:ty});
		    } 
		    var dist2lxy;
		    var cnt = _ApproachOrDepart_dist2lxy.length;        
		    if (cnt == 0)
		        return;
		    else
		    {
		        if (cnt > 1)
		        {
		            _shuffle(_ApproachOrDepart_dist2lxy);
		        }
		        dist2lxy = _ApproachOrDepart_dist2lxy[0];
		        var i;
		        
		        if (is_depart==0)  // find min
		        {
		            for (i=1; i<cnt; i++)
		            {
		                if (dist2lxy.d > _ApproachOrDepart_dist2lxy[i].d)
		                    dist2lxy = _ApproachOrDepart_dist2lxy[i];
		            }
		        }
		        else  // find max
		        {
		            for (i=1; i<cnt; i++)
		            {
		                if (dist2lxy.d < _ApproachOrDepart_dist2lxy[i].d)
		                    dist2lxy = _ApproachOrDepart_dist2lxy[i];
		            }            
		        }
		    }
		    
		    if ((dist2lxy.lx !== xyz.x) || (dist2lxy.ly !== xyz.y))
		        this.move_to_target(dist2lxy.lx, dist2lxy.ly, tz);	
		    
		    _ApproachOrDepart_dist2lxy.length = 0;
		},    

		Stop()
		{
		    this._cmd_move_to.is_moving = false;
		},  

		SetForceMoving(e)
		{
		    this.force_move = (e === 1);
		}

			
	};
}