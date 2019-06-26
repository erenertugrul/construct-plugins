"use strict";

{
	C3.Behaviors.Rex_GridMove.Instance = class Rex_GridMoveInstance extends C3.SDKBehaviorInstanceBase
	{
		constructor(behInst, properties)
		{
			super(behInst);
			const b = this._runtime.Dispatcher();
        	this._disposables = new C3.CompositeDisposable(C3.Disposable.From(b, "afterload", () => this._OnAfterLoad()))
    
			this.inst = this._inst;
	        this.board = null;
	        this._cmd_move_to = new C3.Behaviors.Rex_GridMove.CmdMoveTo(this);
	        this._cmd_move_to.Reset(properties,behInst);

	        this.is_moving_request_accepted = false;
	        this.is_my_call = false;
	        this.exp_BlockerUID = (-1);
	        this.exp_Direction = (-1);
	        this.exp_SourceLX = (-1);
	        this.exp_SourceLY = (-1);
	        this.exp_SourceLZ = (-1);        
	        this.exp_DestinationLX = (-1);
	        this.exp_DestinationLY = (-1);
	        this.exp_DestinationLZ = (-1);
	        this.exp_TargetPX = 0;
	        this.exp_TargetPY = 0;      
	        this.is_customSolid = null;

		    this._wander = {"rx":0,
                "ry":0,
                "o": {"x":0, "y":0, "z":0}
               };
			
			if (properties)
			{
		        this._wander["rx"] = properties[4];
			    this._wander["ry"] = properties[5];
			    this.force_move = (properties[6] === 1);    
			    this.enable_moveTo = (properties[7] === 1); 
			}
	        this._dir_sequence = [];						
		    this._colliding_xyz = {};
		    this._colliding_zhash2uids = {};
		    this._target_uid = null;
		    this._z_saved = null;
			// Opt-in to getting calls to Tick()
			this._StartTicking();
		}

		Release()
		{
			super.Release();
		}
		_OnAfterLoad()
		{
			if (this.randomGenUid === -1)
				this.GetSdkType().randomGen = null;
			else
			{
				this.GetSdkType().randomGen = this._runtime.GetInstanceByUID(this.randomGenUid);
			}		
			this.randomGenUid = -1;		
			this.board = null;
		}
		SaveToJson()
		{
			var randomGenUid = (this.GetSdkType().randomGen != null)? this.GetSdkType().randomGen.uid:(-1);	    
			return {
	            "mrq": this.is_moving_request_accepted,
                 "mt": this._cmd_move_to.saveToJSON(),
		         "wander": this._wander,
		         "z": this._z_saved,
                 "e_buid": this.exp_BlockerUID,
                 "e_dir" : this.exp_Direction,
                 "e_slx" : this.exp_SourceLX,
                 "e_sly" : this.exp_SourceLY,
                 "e_slz" : this.exp_SourceLZ,                 
                 "e_dlx" : this.exp_DestinationLX,
                 "e_dly" : this.exp_DestinationLY,
                 "e_dlz" : this.exp_DestinationLZ,
                 "e_tpx" : this.exp_TargetPX,
                 "e_tpy" : this.exp_TargetPY,
                 "ruid": randomGenUid,
			};
		}

		LoadFromJson(o)
		{
			this.is_moving_request_accepted = o["mrq"];
		    this._cmd_move_to.loadFromJSON(o["mt"]);
		    this._wander = o["wander"];
		    this._z_saved = o["z"];
	        this.exp_BlockerUID= o["e_buid"];
	        this.exp_Direction = o["e_dir"]; 
	        this.exp_SourceLX = o["e_slx"];
	        this.exp_SourceLY = o["e_sly"]; 
	        this.exp_SourceLZ = o["e_slz"];                
	        this.exp_DestinationLX = o["e_dlx"];
	        this.exp_DestinationLY = o["e_dly"];
	        this.exp_DestinationLZ = o["e_dlz"];	 
	        this.exp_TargetPX = o["e_tpx"];  
	        this.exp_TargetPY = o["e_tpy"];           
			this.randomGenUid = o["ruid"];
		}
		
		GetBoard()
		{
		    var xyz;
		    if (this.board != null)
		    {
		        xyz = this.board.uid2xyz(this.inst.GetUID());
		        if (xyz != null)
		            return this.board;  // find out xyz on board
		        else  // chess no longer at board
		            this.board = null;
		    }
		        
		    var plugins = this._runtime.GetAllObjectClasses();
		    var name, inst;
		    for (name in plugins)
		    {
		        inst = plugins[name]._instances[0];
		        if (inst && C3.Plugins.Rex_SLGBoard && (inst._sdkInst instanceof C3.Plugins.Rex_SLGBoard.Instance))
		        {
		            xyz = inst._sdkInst.uid2xyz(this.inst.GetUID())
		            if (xyz != null)
		            { 
		                this.board = inst._sdkInst;
		                _dir_sequence_init(this._dir_sequence, inst._sdkInst.GetLayout().GetDirCount());
		                this._wander["o"]["x"] = xyz.x;
		                this._wander["o"]["y"] = xyz.y;
		                this._wander["o"]["z"] = xyz.z;
		                return this.board;
		            }
		        }
		    }
		    return null;    
		}
		chess_xyz_get(uid)
		{
		    if (uid == null)
			    uid = this.inst.GetUID();
		    var board = this.GetBoard();
			if (board != null)
			    return board.uid2xyz(uid);
		    else
		        return null;
		}
		_chess_inst_get(uid)
		{
		    var board = this.GetBoard();
			if (board != null)
			    return board.uid2inst(uid);
		    else
		        return null;
		}    


		target2dir(target_x, target_y, target_z)
		{
		    var my_xyz = this.chess_xyz_get();        
		    return this.GetBoard().xy2NeighborDir(my_xyz.x, my_xyz.y, target_x, target_y);
		}

		set_move_target(target_x, target_y, target_z, dir)
		{
		    var my_xyz = this.chess_xyz_get(); 
		    this.exp_SourceLX = my_xyz.x;
		    this.exp_SourceLY = my_xyz.y;
		    this.exp_SourceLZ = my_xyz.z;         
		           
		    this.exp_DestinationLX = target_x;
		    this.exp_DestinationLY = target_y;
		    this.exp_DestinationLZ = target_z; 
		    this.exp_Direction = (dir != null)? dir:(-1); 
		}

		_custom_can_move_to_get()
		{
		    this.is_customSolid = null;
		    this.Trigger(C3.Behaviors.Rex_GridMove.Cnds.OnGetSolid);
		    var can_move_to;
		    if (this.is_customSolid == null)
		        can_move_to = null;
		    else if (this.is_customSolid)
		        can_move_to = (-1);
		    else
		        can_move_to = 1;
		    return can_move_to;
		}    

		test_move_to(target_x, target_y, target_z, dir)   // return 1 if can move to
		{
		    this.set_move_target(target_x, target_y, target_z, dir);
		    this.exp_BlockerUID = (-1);
		  
		    var my_xyz = this.chess_xyz_get();
		    if ((target_x === my_xyz.x) && (target_y === my_xyz.y) && (target_z === my_xyz.z))
		        return 1; // can move to target
		    else if (!this.board.IsInsideBoard(target_x, target_y))  // tile does not exist
		        return null;
		                
		    var _target_uid = this.board.xyz2uid(target_x, target_y, target_z);
		    this._target_uid = _target_uid;  // pass _target_uid out
		    
			if (this.force_move)
			    return 1; // can move to target

		    if (_target_uid == null)  // no overlap at the same z
		    {
		        // first, get solid property from event sheet
		        var custom_can_move_to = this._custom_can_move_to_get();
		        if (custom_can_move_to != null)
		            return custom_can_move_to;
		            
		        // find out if neighbors have solid property
		        var zHash = this.board.xy2zHash(target_x, target_y);
		        if (!zHash)
		            return null;            
		        var z;
		        if (target_z != 0)
		        {
		            if (zHash[0]==null)  // tile does not exist
		                return null;                
		            for (z in zHash)
		            {
		                _target_uid = zHash[z];
		                if (_solid_get(this.board.uid2inst(_target_uid)))  // solid
		                {
		                    this.exp_BlockerUID = _target_uid;
		                    return (-1);  // blocked
		                }
		            }                       
		            return 1; // can move to target
		        }
		        else  // target_z == 0
		        {
		            return (zHash[0]==null)? 1: null;          
		        }
		    }
		    else    
		    {
		        this.exp_BlockerUID = _target_uid;      
		        return (-1);  // blocked
		    }
		}

		move_to_target(target_x, target_y, target_z, dir)
		{
		    var can_move = this.test_move_to(target_x, target_y, target_z, dir);
		    if (can_move == 1)  // can move to neighbor
		    {
		        var z_index;
		        
		        if (this.force_move)
		        {
		            if ((this._z_saved != null) &&     // slink
		                (this.board.xyz2uid(target_x, target_y, this._z_saved) == null))
		            {
		                z_index = this._z_saved;
		                this._z_saved = null;                  
		            }
		            else
		            {
		                if (this._target_uid == null)
		                    z_index = target_z;
		                else  // overlap with other chess -> change my z index to avoid overlapping
		                {
		                    if (this._z_saved == null)
		                    {
		                        this._z_saved = target_z;
		                        z_index = "#" + this.inst.GetUID().toString();
		                    }
		                    else
		                        z_index += "#";
		                    while (this.board.xyz2uid(target_x, target_y, z_index) != null)
		                        z_index += "#";
		                }
		            }
		            
		        }
		        else  // normal mode
		            z_index = target_z;
		        
		        // set physical position
		        this.moveto_pxy(target_x, target_y, target_z, dir);            
		        // set logical position
		        this.board.MoveChess(this.inst, target_x, target_y, z_index);
		        
		        this.on_moving_request_success(true);    
		    }   // if (can_move == 1)
		    else if (can_move == (-1))
		    {
		        this.on_moving_request_success(false);              
		    }    
		    else
		    {
		        this.is_moving_request_accepted = false;
		    }
			return (can_move == 1);
		}

		moveto_pxy(lx, ly, lz, dir)
		{
		    var board = this.GetBoard();
		    var layout = board.GetLayout();
		    this.exp_TargetPX = layout.LXYZ2PX(lx, ly, lz);
		    this.exp_TargetPY = layout.LXYZ2PY(lx, ly, lz);
		    
		    if (!this.enable_moveTo)
		        return;

		    var MoveSegmentKlass = C3.Behaviors.Rex_GridMove.MoveSegment;
		    if ((!board.isWrapMode) || (dir == null))
		    {
		        // not wrap mode, or not neighbor : move to target directly
		        var seg = new MoveSegmentKlass(this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY(), this.exp_TargetPX, this.exp_TargetPY);
		        this._cmd_move_to.move_start(seg);            
		    }       
		    else // board.isWrapMode
		    {
		        var cur_xyz = this.chess_xyz_get();               
		        var relay_lx = layout.GetNeighborLX(cur_xyz.x, cur_xyz.y, dir);
		        var relay_ly = layout.GetNeighborLY(cur_xyz.x, cur_xyz.y, dir);
		            
		        if ((relay_lx == lx) && (relay_ly == ly))
		        {
		            // non-wrapped neighbor : move to target directly
		            var seg = new MoveSegmentKlass(this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY(), this.exp_TargetPX, this.exp_TargetPY);
		            this._cmd_move_to.move_start(seg); 
		        }
		        else
		        {
		            // wrap neighbor : move to relay point
		            var relay_px = layout.LXYZ2PX(relay_lx, relay_ly, 0);
		            var relay_py = layout.LXYZ2PY(relay_lx, relay_ly, 0);                   
		            var seg0 = new MoveSegmentKlass(this.inst.GetWorldInfo().GetX(), this.inst.GetWorldInfo().GetY(), relay_px, relay_py);
		                
		            // wrap relay lxy
		            if ((relay_lx < 0) || (relay_lx > board.x_max))                    
		                relay_lx = board.x_max - relay_lx;
		            if ((relay_ly < 0) || (relay_ly > board.y_max))                    
		                relay_ly = board.y_max - relay_ly;                        
		            relay_px = layout.LXYZ2PX(relay_lx, relay_ly, 0);
		            relay_py = layout.LXYZ2PY(relay_lx, relay_ly, 0);
		            var seg1 = new MoveSegmentKlass(relay_px, relay_py, this.exp_TargetPX, this.exp_TargetPY);                     
		            this._cmd_move_to.move_start(seg0, seg1); 
		        }
		    }            
		            
		}

		on_moving_request_success(can_move)
		{
		    this.is_moving_request_accepted = can_move;           
		    this.is_my_call = true; 
		    var trig = (can_move)? C3.Behaviors.Rex_GridMove.Cnds.OnMovingRequestAccepted:
		                           C3.Behaviors.Rex_GridMove.Cnds.OnMovingRequestRejected;
		    this.Trigger(trig);                                           
		    this.is_my_call = false;  
		} 

		colliding_checking(target_x, target_y, target_z, dir)
		{
		    this.set_move_target(target_x, target_y, target_z, dir);
		    
		    this._colliding_xyz.x = target_x;
		    this._colliding_xyz.y = target_y;
		    this._colliding_xyz.z = target_z;
		    this.Trigger(C3.Behaviors.Rex_GridMove.Cnds.OnCollidedBegin);    
		}    

		_zhash2uids(zHash)
		{   
		    var z, target_uids = this._colliding_zhash2uids;
		    for (z in target_uids)
		        delete target_uids[z];
		    for (z in zHash)
		        target_uids[zHash[z]] = true;
		    return target_uids;
		}

		_collide_test(colliding_xyz, objtype, group_name)
		{
		    // pick collided instances into group
		    var result_group, sol;
		    if (group_name != null)
		    {
		        result_group = this.GetSdkType().GetInstGroup().GetGroup(group_name);
		        result_group.Clean();
		    }
		    // pick collided instances into SOL
		    else
		    {
		        sol = objtype.GetCurrentSol();  
		        sol._SetSelectAll(false);
		        sol._instances.length = 0;   // clear contents
		    }
		    
		    var zHash = this.board.xy2zHash(colliding_xyz.x, colliding_xyz.y);
		    if (!zHash)
		        return false;
		    
		    var target_uids = this._zhash2uids(zHash);
		    var is_collided = false;     
		    var uid, inst;
		    for (uid in target_uids)
		    {
		        uid = parseInt(uid);
		        if (uid === this.inst.GetUID())
		            continue;
		        
		        inst = this._uid2inst(uid, objtype);
		        if (inst === null)
		            continue;
		        
		        if (group_name != null)
		        {
		            result_group.AddUID(uid);
		        }
		        else
		        {
		            sol._instances.push(inst);
		        }
		        
		        is_collided = true
		    }            
		    return is_collided;
		}

		_uid2inst(uid, objtype)
		{
		    var inst = this._runtime.GetInstanceByUID(uid);
		    if (inst == null)
				return null;

		    if ((objtype == null) || (inst.GetObjectClass() == objtype))
		        return inst;        
		    else if (objtype.is_family)
		    {
		        var families = inst.GetObjectClass()._isFamily;
		        var cnt=families.length, i;
		        for (i=0; i<cnt; i++)
		        {
		            if (objtype == families[i])
		                return inst;
		        }
		    }
		    // objtype mismatch
		    return null;
		}

		Tick()
		{
			const dt = this._runtime.GetDt(this._inst);
			const wi = this._inst.GetWorldInfo();
			
			this._cmd_move_to.tick();
		}
		
	};
}