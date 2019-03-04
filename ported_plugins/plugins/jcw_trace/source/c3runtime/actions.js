"use strict";

{
	C3.Plugins.jcw_trace.Acts =
	{
		AddObstacle(obj_)
		{
			var obstacleTypes = this.GetSdkType().GetObstacleTypes();

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
		},

		ClearObstacles()
		{
			C3.clearArray(this.GetSdkType().GetObstacleTypes());
		},

		TraceLine(x1, y1, x2, y2)
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
					var a = this._runtime.GetCollisionEngine();
					rinst = candidates[i];
					if(!rinst.GetSavedDataMap().get("solidEnabled")) continue;

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

			C3.clearArray(candidates);

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
		},

		TraceBox(x1, y1, x2, y2, w, h)
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
			

			tr.bounds.setLeft(tr.bounds.getLeft()-halfw);
			tr.bounds.setRight(tr.bounds.getRight()+halfw);
			tr.bounds.setTop(tr.bounds.getTop()-halfw);
			tr.bounds.setBottom(tr.bounds.getBottom()+halfw);
			
			tr.t = 1;
			tr.hit = false;

			var i, leni, rinst;
			
			this.GetOverlapCandidates()

			if (this.obstacleMode === 0)
			{
				for (i = 0, leni = candidates.length; i < leni; ++i)
				{
					rinst = candidates[i];
					if(!rinst.GetSavedDataMap().get("solidEnabled")) continue;

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

			C3.clearArray(candidates);

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
		}
	};
}