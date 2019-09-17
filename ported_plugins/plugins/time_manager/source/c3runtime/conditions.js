"use strict";

{
    C3.Plugins.CAMFTimeManager.Cnds = {
        IsCounterRunning(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return false;
            }
            if (this.CurrentInstanceToUse.IsStopped == false) {
                return true;
            }
            return false;
        },
        IsCounterPaused(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return false;
            }
            if (this.CurrentInstanceToUse.IsActive == true) {
                return false;
            }
            return true;
        },
        IsCounterFinished(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return false;
            }
            if (this.CurrentInstanceToUse.IsStopped == true || this.CurrentInstanceToUse.IsActive == false) {
                return false;
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            if (this.CurrentInstanceToUse.CountDown == true && this.CurrentInstanceToUse.TimeResult <= 0) {
                return true;
            }
            if (this.CurrentInstanceToUse.CountUp == true && this.CurrentInstanceToUse.TimeManagerEndTime != 0) {
                if (this.CurrentInstanceToUse.TimeResult >= this.CurrentInstanceToUse.TimeManagerEndTime) {
                    return true;
                }
            }
            return false;
        },
        IsCounterStopped(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return false;
            }
            return this.CurrentInstanceToUse.IsStopped;
        },
        CheckCounterValue(LabelStr, CheckOption, Hours, Minutes, Seconds, Milliseconds) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return false;
            }
            var TotalCheckValue = (Hours * 3600000) + (Minutes * 60000) + (Seconds * 1000) + Milliseconds;
            this.CalculateTime(this.CurrentInstanceToUse)
            switch (CheckOption) {
            case 0:
                if (this.CurrentInstanceToUse.TimeResult < TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }
                break;
            case 1:
                if (this.CurrentInstanceToUse.TimeResult > TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }
                break;
            case 2:
                if (this.CurrentInstanceToUse.TimeResult != TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }
                break;
            case 3:
                if (this.CurrentInstanceToUse.TimeResult == TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }

                if (this.CurrentInstanceToUse.TimeResult > this.m_OldTotalCheckValue) {
                    if (this.CurrentInstanceToUse.TimeResult > TotalCheckValue) {
                        this.m_OldTotalCheckValue = TotalCheckValue;
                        return true;
                    }
                }
                break;
            case 4:
                if (this.CurrentInstanceToUse.TimeResult <= TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }

                break;
            case 5:
                if (this.CurrentInstanceToUse.TimeResult >= TotalCheckValue) {
                    this.m_OldTotalCheckValue = TotalCheckValue;
                    return true;
                }
                break;
            }

            this.m_OldTotalCheckValue = TotalCheckValue;
            return false;
        }

    };
}
