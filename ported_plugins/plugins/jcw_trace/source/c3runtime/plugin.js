"use strict";
	Math.sign = Math.sign || function(x) {
	  x = +x; // convert to a number
	  if (x === 0 || isNaN(x)) {
	    return Number(x);
	  }
	  return x > 0 ? 1 : -1;
	}
	function seal(x)
	{
		return x;
	}
	function segments_intersect(a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
	{
		var max_ax, min_ax, max_ay, min_ay, max_bx, min_bx, max_by, min_by;
		if (a1x < a2x)
		{
			min_ax = a1x;
			max_ax = a2x;
		}
		else
		{
			min_ax = a2x;
			max_ax = a1x;
		}
		if (b1x < b2x)
		{
			min_bx = b1x;
			max_bx = b2x;
		}
		else
		{
			min_bx = b2x;
			max_bx = b1x;
		}
		if (max_ax < min_bx || min_ax > max_bx)
			return false;
		if (a1y < a2y)
		{
			min_ay = a1y;
			max_ay = a2y;
		}
		else
		{
			min_ay = a2y;
			max_ay = a1y;
		}
		if (b1y < b2y)
		{
			min_by = b1y;
			max_by = b2y;
		}
		else
		{
			min_by = b2y;
			max_by = b1y;
		}
		if (max_ay < min_by || min_ay > max_by)
			return false;
		var dpx = b1x - a1x + b2x - a2x;
		var dpy = b1y - a1y + b2y - a2y;
		var qax = a2x - a1x;
		var qay = a2y - a1y;
		var qbx = b2x - b1x;
		var qby = b2y - b1y;
		var d = Math.abs(qay * qbx - qby * qax);
		var la = qbx * dpy - qby * dpx;
		if (Math.abs(la) > d)
			return false;
		var lb = qax * dpy - qay * dpx;
		return Math.abs(lb) <= d;
	}
	function TR()
	{
		this.x1 = 0;
		this.y1 = 0;
		this.x2 = 0;
		this.y2 = 0;
		this.dx = 0;
		this.dy = 0;
		this.bounds = new C3.Rect(0, 0, 0, 0);
		this.t = 0;
		this.hit = false;
		this.hitx = 0;
		this.hity = 0;
		this.uid = -1;
		this.normalang = 0;
		seal(this);
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
		var PosX = (bbox.getLeft() + bbox.getRight()) / 2;
		var PosY = (bbox.getTop() + bbox.getBottom()) / 2;
		var HalfW = (bbox.getRight() - bbox.getLeft()) / 2 + padx;
		var HalfH = (bbox.getBottom() - bbox.getTop()) / 2 + pady;
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
		
		if (bquad.containsPoint(tr.x1, tr.y1))
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

			if (!segments_intersect(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2)) continue;
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
		var points = polygon.GetPointsArray();
		if (polygon.containsPoint(tr.x1 - offx, tr.y1 - offy))
		{
			tr.t = 0;
			tr.hit = true;
			tr.normalang = Math.atan2(-tr.dy, -tr.dx);
			return true;
		}

		var i, leni, i2, imod, t;
		var px1, py1, px2, py2;
		var hit = false;

		for (i = 0, leni = polygon.GetPointCount(); i < leni; i++)
		{
			i2 = i*2;
			imod = ((i+1)%leni)*2;
			px1 = points[i2] + offx;
			py1 = points[i2+1] + offy;
			px2 = points[imod] + offx;
			py2 = points[imod+1] + offy;
			if (!segments_intersect(tr.x1, tr.y1, tr.x2, tr.y2, px1, py1, px2, py2)) continue;

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
	var tmpRect = new C3.Rect(0, 0, 0, 0);

	function SegmentTilemap(tr, inst)
	{
		inst.GetWorldInfo().GetInstance().GetSdkInstance().GetCollisionRectCandidates(tr.bounds, collrect_candidates); // getinst yap once GetCollisionRectCandidates
		var i, len, c, tilerc;
		var tmx = inst.GetWorldInfo().GetX();
		var tmy = inst.GetWorldInfo().GetY();
		var hit = false;

		for (i = 0, len = collrect_candidates.length; i < len; ++i)
		{
			c = collrect_candidates[i];
			tilerc = c._rc;
			
			if (!tr.bounds.intersectsRectOffset(tilerc, tmx, tmy)) continue;

			tmpRect.copy(tilerc);
			tmpRect.offset(tmx, tmy);

			if (c._poly)
			{
				if (SegmentPolygon(tr, c._poly, tmpRect.getLeft(), tmpRect.getTop())) hit = true;
			}
			else
			{
				if (SegmentAABB(tr, tmpRect, 0, 0)) hit = true;
			}
		}

		C3.clearArray(collrect_candidates);
		return hit;
	}

	function SegmentOverlap(tr, inst)
	{
		if (!inst || !inst.GetWorldInfo().IsSolidCollisionAllowed()) return;

		inst.GetWorldInfo()._UpdateBbox();
		if (!inst.GetWorldInfo().GetBoundingBox().intersectsRect(tr.bounds)) return;

		var hit = false;
		if (inst.HasTilemap())
		{
			hit = SegmentTilemap(tr, inst);
		}
		else if (inst.GetWorldInfo().GetTransformedCollisionPoly())
		{
			var polygon = inst.GetWorldInfo().GetTransformedCollisionPoly();
			hit = SegmentPolygon(tr, polygon, inst.GetWorldInfo().GetX(), inst.GetWorldInfo().GetY());
		}


		if (hit) tr.uid = inst.GetUID();
	}
	
	function AABBOverlap(tr, inst, halfw, halfh)
	{
		if (!inst || !inst.GetWorldInfo().IsSolidCollisionAllowed()) return;
		
		inst.GetWorldInfo()._UpdateBbox();

		if (!inst.GetWorldInfo().GetBoundingBox().intersectsRect(tr.bounds)) return;

		var hit = false;

		if (inst.HasTilemap())
		{
			//hit = SegmentTilemap(tr, inst);
		}

		else if (inst.GetWorldInfo().GetTransformedCollisionPoly())
		{
			var polygon = inst.GetWorldInfo().GetTransformedCollisionPoly();

		}
		else
		{
			if (inst.GetWorldInfo().GetAngle() == 0) hit = SegmentAABB(tr, inst.GetWorldInfo().GetBoundingBox(), halfw, halfh); // else hit = SegmentQuad(tr, inst.bquad);
		}

		if (hit) tr.uid = inst.GetUID();
	}
{
	C3.Plugins.jcw_trace = class jcw_tracePlugin extends C3.SDKPluginBase
	{
		constructor(opts)
		{
			super(opts);
		}
		
		Release()
		{
			super.Release();
		}
	};
}