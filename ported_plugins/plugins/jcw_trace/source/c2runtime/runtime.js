// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

// Copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return Number(x);
  }
  return x > 0 ? 1 : -1;
}

/////////////////////////////////////
// Plugin class
cr.plugins_.jcw_trace = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.jcw_trace.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	// called on startup for each object type
	typeProto.onCreate = function()
	{
		this.obstacleTypes = [];
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
	};

	var instanceProto = pluginProto.Instance.prototype;

	function TR()
	{
		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = 0;
		this.dx = 0;
		this.dy = 0;
		this.bounds = new cr.rect(0, 0, 0, 0);
		this.t = 0;
		this.hit = false;
		this.hitx = 0;
		this.hity = 0;
		this.uid = -1;
		this.normalang = 0;
		cr.seal(this);
	}

	var TRProto = TR.prototype;

	TRProto.CalcHitPos = function(padding)
	{
		this.hitx = this.x1 + this.dx * this.t;
		this.hity = this.y1 + this.dy * this.t;

		if (padding === 0) {return;}

		var ang = Math.atan2(-this.dy, -this.dx);
		this.hitx += Math.cos(ang)*padding;
		this.hity += Math.sin(ang)*padding;
	};

	TRProto.GetReflectAng = function()
	{
		return 2*this.normalang - Math.atan2(-this.dy, -this.dx);
	};

	function PointOnLineSide(px, py, x1, y1, x2, y2)
	{
		var dx = x2 - x1;
		var dy = y2 - y1;
		return (y1 - py) * dx - (x1 - px) * dy >= 0 ? 0 : 1;
	}

	function SegmentAABB(tr, bbox, padx, pady)
	{
		var ScaleX = 1.0 / tr.dx;
		var ScaleY = 1.0 / tr.dy;
		var SignX = Math.sign(ScaleX);
		var SignY = Math.sign(ScaleY);
		var PosX = (bbox.left + bbox.right) / 2;
		var PosY = (bbox.top + bbox.bottom) / 2;
		var HalfW = (bbox.right - bbox.left) / 2 + padx;
		var HalfH = (bbox.bottom - bbox.top) / 2 + pady;
		var NearTimeX = (PosX - SignX * HalfW - tr.x1) * ScaleX;
		var NearTimeY = (PosY - SignY * HalfH - tr.y1) * ScaleY;
		var FarTimeX = (PosX + SignX * HalfW - tr.x1) * ScaleX;
		var FarTimeY = (PosY + SignY * HalfH - tr.y1) * ScaleY;

		if (NearTimeX > FarTimeY || NearTimeY > FarTimeX) return false;

		var NearTime = NearTimeX > NearTimeY ? NearTimeX : NearTimeY;
		var FarTime = FarTimeX < FarTimeY ? FarTimeX : FarTimeY;

		if (NearTime >= tr.t || FarTime <= 0) return false;

		tr.t = Math.max(NearTime, 0);
		tr.hit = true;
		if (NearTimeX > NearTimeY)
		{
			tr.normalang = Math.atan2(0, -SignX);
		}
		else
		{
			tr.normalang = Math.atan2(-SignY, 0);
		}
		return true;
	}

	function InterceptSegment(s2x1, s2y1, s2x2, s2y2, s1x1, s1y1, s1x2, s1y2)
	{
		var s1dx = s1x2 - s1x1;
		var s1dy = s1y2 - s1y1;
		var s2dx = s2x2 - s2x1;
		var s2dy = s2y2 - s2y1;

		var den = s1dy * s2dx - s1dx * s2dy;
		if (den === 0) {return 0;}
		var num = (s1x1 - s2x1) * s1dy + (s2y1 - s1y1) * s1dx;
		return num / den;
	}

	function SegmentQuad(tr, bquad)
	{
		var hit = false;
		
		if (bquad.contains_pt(tr.x1, tr.y1))
		{
			tr.t = 0;
			tr.hit = true;
			tr.normalang = Math.atan2(-tr.dy, -tr.dx);
			return true;
		}

		var i, t;
		var px1, py1, px2, py2;
		for (i = 0; i < 4; i++)
		{
			px1 = bquad.at(i, true);
			py1 = bquad.at(i, false);
			px2 = bquad.at(i + 1, true);
			py2 = bquad.at(i + 1, false);

			if (!cr.segments_intersect(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2)) continue;

			t = InterceptSegment(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2);
			if (t < tr.t)
			{
				hit = true;
				tr.t = t;
				tr.hit = true;
				tr.normalang = Math.atan2(px1 - px2, py2 - py1);
			}
		}
		return hit;
	}

	function SegmentPolygon(tr, polygon, offx, offy)
	{
		var points = polygon.pts_cache;
		
		if (polygon.contains_pt(tr.x1 - offx, tr.y1 - offy))
		{
			tr.t = 0;
			tr.hit = true;
			tr.normalang = Math.atan2(-tr.dy, -tr.dx);
			return true;
		}

		var i, leni, i2, imod, t;
		var px1, py1, px2, py2;
		var hit = false;

		for (i = 0, leni = polygon.pts_count; i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			px1 = points[i2] + offx;
			py1 = points[i2+1] + offy;
			px2 = points[imod] + offx;
			py2 = points[imod+1] + offy;

			if (!cr.segments_intersect(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2)) continue;

			t = InterceptSegment(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2);
			if (t < tr.t)
			{
				hit = true;
				tr.t = t;
				tr.hit = true;
				if (PointOnLineSide(tr.x1, tr.y1, px1, py1, px2, py2) === 0)
				{
					tr.normalang = Math.atan2(px1 - px2, py2 - py1);
				}
				else
				{
					tr.normalang = Math.atan2(px2 - px1, py1 - py2);
				}
			}
		}
		return hit;
	}

	var collrect_candidates = [];
	var tmpRect = new cr.rect(0, 0, 0, 0);

	function SegmentTilemap(tr, inst)
	{
		inst.getCollisionRectCandidates(tr.bounds, collrect_candidates);
		var i, len, c, tilerc;
		var tmx = inst.x;
		var tmy = inst.y;
		var hit = false;

		for (i = 0, len = collrect_candidates.length; i < len; ++i)
		{
			c = collrect_candidates[i];
			tilerc = c.rc;

			if (!tr.bounds.intersects_rect_off(tilerc, tmx, tmy)) continue;

			tmpRect.copy(tilerc);
			tmpRect.offset(tmx, tmy);

			if (c.poly)
			{
				if (SegmentPolygon(tr, c.poly, tmpRect.left, tmpRect.top)) hit = true;
			}
			else
			{
				if (SegmentAABB(tr, tmpRect, 0, 0)) hit = true;
			}
		}

		cr.clearArray(collrect_candidates);
		return hit;
	}

	function SegmentOverlap(tr, inst)
	{
		if (!inst || !inst.collisionsEnabled) return;

		inst.update_bbox();

		if (!inst.bbox.intersects_rect(tr.bounds)) return;

		var hit = false;

		if (inst.tilemap_exists)
		{
			hit = SegmentTilemap(tr, inst);
		}
		else if (inst.collision_poly && !inst.collision_poly.is_empty())
		{
			var polygon = inst.collision_poly;
			polygon.cache_poly(inst.width, inst.height, inst.angle);
			hit = SegmentPolygon(tr, polygon, inst.x, inst.y);
		}
		else
		{
			if (inst.angle === 0) hit = SegmentAABB(tr, inst.bbox, 0, 0); else hit = SegmentQuad(tr, inst.bquad);
		}

		if (hit) tr.uid = inst.uid;
	}
	
	function AABBOverlap(tr, inst, halfw, halfh)
	{
		if (!inst || !inst.collisionsEnabled) return;

		inst.update_bbox();

		if (!inst.bbox.intersects_rect(tr.bounds)) return;

		var hit = false;

		if (inst.tilemap_exists)
		{
			//hit = SegmentTilemap(tr, inst);
		}
		else if (inst.collision_poly && !inst.collision_poly.is_empty())
		{
			var polygon = inst.collision_poly;
			polygon.cache_poly(inst.width, inst.height, inst.angle);
			//hit = SegmentPolygon(tr, polygon, inst.x, inst.y);
		}
		else
		{
			if (inst.angle === 0) hit = SegmentAABB(tr, inst.bbox, halfw, halfh); // else hit = SegmentQuad(tr, inst.bquad);
		}

		if (hit) tr.uid = inst.uid;
	}

	instanceProto.onCreate = function()
	{
		this.obstacleMode = this.properties[0];
		this.useCollisionCells = (this.properties[1] !== 0);
		this.padding = cr.clamp(this.properties[2], 0, 1);
		this.tr = new TR();
	};

	instanceProto.onDestroy = function ()
	{
	};

	instanceProto.saveToJSON = function ()
	{
		return {
		};
	};

	instanceProto.loadFromJSON = function (o)
	{

	};

	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
		propsections.push({
			"title": "Trace",
			"properties": [
				{"name": "Padding", "value": this.padding},
				{"name": "HitFrac", "value": this.tr.t},
				{"name": "HitX", "value": this.tr.hitx},
				{"name": "HitY", "value": this.tr.hity},
				{"name": "NormalAngle", "value": cr.to_degrees(this.tr.normalang)},
				{"name": "ReflectAngle", "value": cr.to_degrees(this.tr.GetReflectAng())}
			]
		});
	};

	instanceProto.onDebugValueEdited = function (header, name, value)
	{
		if (name === "Padding") this.padding = cr.clamp(value, 0, 1);
	};
	/**END-PREVIEWONLY**/
	
	var candidates = [];
	
	instanceProto.GetOverlapCandidates = function()
	{
		var tr = this.tr;

		var i, leni;

		if (this.obstacleMode === 0)
		{
			if (this.useCollisionCells)
			{
				this.runtime.getSolidCollisionCandidates(null, tr.bounds, candidates);
			}
			else
			{
				var solid = this.runtime.getSolidBehavior();

				if (solid) cr.appendArray(candidates, solid.my_instances.valuesRef());
			}
		}
		else
		{
			if (this.useCollisionCells)
			{
				this.runtime.getTypesCollisionCandidates(null, this.type.obstacleTypes, tr.bounds, candidates);
			}
			else
			{
				for (i = 0, leni = this.type.obstacleTypes.length; i < leni; ++i)
				{
					cr.appendArray(candidates, this.type.obstacleTypes[i].instances);
				}
			}
		}
	};

	//////////////////////////////////////
	// Conditions
	function Cnds() {}

	Cnds.prototype.Hit = function () { return this.tr.hit; };

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {}

	Acts.prototype.AddObstacle = function (obj_)
	{
		var obstacleTypes = this.type.obstacleTypes;

		// Check not already a target, we don't want to add twice
		if (obstacleTypes.indexOf(obj_) !== -1) return;

		// Check obj is not a member of a family that is already a target
		var i, len, t;
		for (i = 0, len = obstacleTypes.length; i < len; i++)
		{
			t = obstacleTypes[i];

			if (t.is_family && t.members.indexOf(obj_) !== -1) return;
		}

		obstacleTypes.push(obj_);
	};

	Acts.prototype.ClearObstacles = function ()
	{
		cr.clearArray(this.type.obstacleTypes);
	};

	Acts.prototype.TraceLine = function (x1, y1, x2, y2)
	{
		var tr = this.tr;
		tr.x1 = x1;
		tr.y1 = y1;
		tr.x2 = x2;
		tr.y2 = y2;
		tr.dx = x2 - x1;
		tr.dy = y2 - y1;
		tr.bounds.set(x1, y1, x2, y2);
		tr.bounds.normalize();
		tr.t = 1;
		tr.hit = false;

		var i, leni, rinst;
		
		this.GetOverlapCandidates();

		if (this.obstacleMode === 0)
		{
			for (i = 0, leni = candidates.length; i < leni; ++i)
			{
				rinst = candidates[i];

				if (!rinst.extra["solidEnabled"]) continue;

				SegmentOverlap(tr, rinst);
			}
		}
		else
		{
			for (i = 0, leni = candidates.length; i < leni; ++i)
			{
				rinst = candidates[i];

				SegmentOverlap(tr, rinst);

			}
		}

		cr.clearArray(candidates);

		if (tr.hit)
		{
			tr.CalcHitPos(this.padding);
		}
		else
		{
			tr.hitx = x2;
			tr.hity = y2;
			tr.uid = -1;
			tr.normalang = Math.atan2(-tr.dy, -tr.dx);
		}
	};

	Acts.prototype.TraceBox = function (x1, y1, x2, y2, w, h)
	{
		var halfw = w / 2;
		var halfh = h / 2;
		var tr = this.tr;
		tr.x1 = x1;
		tr.y1 = y1;
		tr.x2 = x2;
		tr.y2 = y2;
		tr.dx = x2 - x1;
		tr.dy = y2 - y1;
		tr.bounds.set(x1, y1, x2, y2);
		tr.bounds.normalize();
		tr.bounds.left -= halfw;
		tr.bounds.right += halfw;
		tr.bounds.top -= halfh;
		tr.bounds.bottom += halfh;
		tr.t = 1;
		tr.hit = false;

		var i, leni, rinst;
		
		this.GetOverlapCandidates()

		if (this.obstacleMode === 0)
		{
			for (i = 0, leni = candidates.length; i < leni; ++i)
			{
				rinst = candidates[i];

				if (!rinst.extra["solidEnabled"]) continue;

				AABBOverlap(tr, rinst, halfw, halfh);
			}
		}
		else
		{
			for (i = 0, leni = candidates.length; i < leni; ++i)
			{
				rinst = candidates[i];

				AABBOverlap(tr, rinst, halfw, halfh);
			}
		}

		cr.clearArray(candidates);

		if (tr.hit)
		{
			tr.CalcHitPos(this.padding);
		}
		else
		{
			tr.hitx = x2;
			tr.hity = y2;
			tr.uid = -1;
			tr.normalang = Math.atan2(-tr.dy, -tr.dx);
		}
	};

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {}
	Exps.prototype.HitUID = function (ret) { ret.set_int(this.tr.uid); };
	Exps.prototype.HitX = function (ret) { ret.set_float(this.tr.hitx); };
	Exps.prototype.HitY = function (ret) { ret.set_float(this.tr.hity); };
	Exps.prototype.NormalAngle = function (ret) { ret.set_float(cr.to_degrees(this.tr.normalang)); };
	Exps.prototype.ReflectAngle = function (ret) { ret.set_float(cr.to_degrees(this.tr.GetReflectAng())); };
	Exps.prototype.HitFrac = function (ret) { ret.set_float(this.tr.t); };

	pluginProto.exps = new Exps();

}());