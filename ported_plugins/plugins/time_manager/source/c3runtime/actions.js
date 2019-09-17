"use strict";

{
    C3.Plugins.CAMFTimeManager.Acts = {
        SetMinuteBaseValue(LabelStr, BaseValue) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.CurrentInstanceToUse.MinuteBaseValue = BaseValue;
        },
        SetSecondBaseValue(LabelStr, BaseValue) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.CurrentInstanceToUse.SecondBaseValue = BaseValue;
        },
        SetMillisecondBaseValue(LabelStr, BaseValue) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.CurrentInstanceToUse.MillisecondBaseValue = BaseValue;
        },
        StopTimeCount(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.ResetTimeManager(this.CurrentInstanceToUse);
            this.CurrentInstanceToUse.IsActive = true;
            this.CurrentInstanceToUse.IsStopped = true;
            return;
        },
        StartTimeCount(LabelStr) {
            this.CurrentInstanceToUse = null;
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.ResetTimeManager(this.CurrentInstanceToUse);
            this.CurrentInstanceToUse.IsActive = true;
            this.CurrentInstanceToUse.IsStopped = false;
            return;
        },
        DestroyTimeManagerInstances() {
            this.m_TimeManagerList.length = 0;
            return;
        },
        PauseTimeCount(LabelStr, CurrentChoice) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            if (CurrentChoice == 0 && this.CurrentInstanceToUse.IsActive == true) {
                this.CurrentInstanceToUse.IsActive = false;
                this.CurrentInstanceToUse.PauseStartValue = (this._runtime.GetGameTime() * 1000);
            } else if (CurrentChoice == 1 && this.CurrentInstanceToUse.IsActive == false) {
                this.CurrentInstanceToUse.IsActive = true;
                this.CurrentInstanceToUse.PauseTotal += this.CurrentInstanceToUse.PauseValue;
            }
            this.CurrentInstanceToUse.PauseValue = 0.0;
            return;
        },
        ResetTimeCount(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }
            this.ResetTimeManager(this.CurrentInstanceToUse);
            return;
        },
        TimeCountDown(CountdownTime, LabelStr, ActiveState) {
            /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                    this.m_TimeManagerList.splice(i, 1);
                    break;
                }
            }
            var StartTime = (this._runtime.GetGameTime() * 1000);
            var EndTime = (CountdownTime + StartTime);
            var TempTimeManager = new TimeManager(LabelStr,StartTime,EndTime,CountdownTime,0.0);
            TempTimeManager.CountDown = true;
            TempTimeManager.IsStopped = ActiveState;
            this.ResetTimeManager(TempTimeManager);
            this.m_TimeManagerList.push(TempTimeManager);
            return;
        },
        TimeCountUp(LabelStr, ActiveState) {
            /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                    this.m_TimeManagerList.splice(i, 1);
                    break;
                }
            }
            var StartTime = (this._runtime.GetGameTime() * 1000);
            var EndTime = 0;
            var TempTimeManager = new TimeManager(LabelStr,StartTime,EndTime,0.0,0.0);
            TempTimeManager.CountUp = true;
            TempTimeManager.IsStopped = ActiveState;
            this.ResetTimeManager(TempTimeManager);
            this.m_TimeManagerList.push(TempTimeManager);
            return;
        },
        TimeCountUpWithStartValue(LabelStr, ActiveState, StartValue) {
            /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                    this.m_TimeManagerList.splice(i, 1);
                    break;
                }
            }
            var StartTime = ((this._runtime.GetGameTime() * 1000) - StartValue);
            var EndTime = 0;
            var TempTimeManager = new TimeManager(LabelStr,StartTime,EndTime,0.0,StartValue);
            TempTimeManager.CountUp = true;
            TempTimeManager.IsStopped = ActiveState;
            this.ResetTimeManager(TempTimeManager);
            this.m_TimeManagerList.push(TempTimeManager);
            return;
        },
        TimeCountUpWithLimit(TimeLimit, LabelStr, ActiveState) {
            /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                    this.m_TimeManagerList.splice(i, 1);
                    break;
                }
            }
            var StartTime = (this._runtime.GetGameTime() * 1000);
            var EndTime = TimeLimit;
            var TempTimeManager = new TimeManager(LabelStr,StartTime,EndTime,TimeLimit,0.0,0.0);
            TempTimeManager.CountUp = true;
            TempTimeManager.IsStopped = ActiveState;
            this.ResetTimeManager(TempTimeManager);
            this.m_TimeManagerList.push(TempTimeManager);
            return;
        },
        RemoveSingleCounter(LabelStr) {
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                    this.m_TimeManagerList.splice(i, 1);
                    return;
                }
            }
            return;
        },

        CalculateTimeValue(LabelStr, CalculationType, Value) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return;
            }

            switch (CalculationType) {
            case 0:
                /* Addition */
                if (this.CurrentInstanceToUse.CountDown == true) {
                    this.CurrentInstanceToUse.TimeManagerEndTime += Value;
                } else {
                    this.CurrentInstanceToUse.TimeManagerStartTime -= Value;
                }
                break;
            case 1:
                /* Subtraction */
                if (this.CurrentInstanceToUse.CountDown == true) {
                    this.CurrentInstanceToUse.TimeManagerEndTime -= Value;

                } else {
                    this.CurrentInstanceToUse.TimeManagerStartTime += Value;
                    this.CalculateTime(this.CurrentInstanceToUse);
                    if (this.CurrentInstanceToUse.TimeResult < 0) {
                        this.ResetTimeManager(this.CurrentInstanceToUse);
                    }
                }
                break;
            default:
                break;
            }
        }

    };
}
