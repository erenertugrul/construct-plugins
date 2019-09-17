"use strict";

{
    C3.Plugins.CAMFTimeManager.Instance = class CAMFTimeManagerInstance extends C3.SDKInstanceBase {
        constructor(inst, properties) {
            super(inst);

            // Initialise object properties
            this.CurrentInstanceToUse = null;
            this.m_OldTotalCheckValue = 0;
            this.m_TimeManagerList = new Array();
        }

        Release() {
            super.Release();
        }

        SaveToJson() {
            return {
                "TimerList": this.m_TimeManagerList
            };
        }

        LoadFromJson(o) {
            this.m_TimeManagerList = o["TimerList"];
        }
        ConvertHours(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt(((Time / (60 * 1000)) / 60) % 60);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        ConvertMinutes(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt((Time / (60 * 1000)) % 60);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        ConvertSeconds(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt((Time / 1000) % 60);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        ConvertMilliseconds(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt(Time % 1000);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 100) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }

        GetHours(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt(((Time / (this.CurrentInstanceToUse.SecondBaseValue * 1000)) / this.CurrentInstanceToUse.MinuteBaseValue) % this.CurrentInstanceToUse.MinuteBaseValue);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        GetMinutes(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt((Time / (this.CurrentInstanceToUse.SecondBaseValue * 1000)) % this.CurrentInstanceToUse.MinuteBaseValue);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        GetSeconds(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt((Time / this.CurrentInstanceToUse.MillisecondBaseValue) % this.CurrentInstanceToUse.SecondBaseValue);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 10 && ShowDouble) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        GetMilliseconds(Time, ShowDouble) {
            var ReturnString = "";
            var IntVariable = parseInt(Time % this.CurrentInstanceToUse.MillisecondBaseValue);
            if (IntVariable < 0) {
                IntVariable = 0;
            }
            if (IntVariable < 100) {
                ReturnString += "0";
            }
            ReturnString += IntVariable;
            return ReturnString;
        }
        CalculateTime(CurrentInstance) {
            if (CurrentInstance.IsStopped == true) {
                CurrentInstance.PauseValue = 0;
                return;
            }
            if (CurrentInstance.IsActive == false) {
                CurrentInstance.PauseValue = (this._runtime.GetGameTime() * 1000) - CurrentInstance.PauseStartValue;
                return;
            }

            var CurrentTime = (this._runtime.GetGameTime() * 1000) - CurrentInstance.PauseTotal;

            if (CurrentInstance.CountDown == true) {
                CurrentInstance.TimeResult = (CurrentInstance.TimeManagerEndTime) - CurrentTime;
                if (CurrentInstance.TimeResult <= 0) {
                    CurrentInstance.TimeResult = 0;
                }
            }

            if (CurrentInstance.CountUp == true) {
                CurrentInstance.TimeResult = CurrentTime - CurrentInstance.TimeManagerStartTime;
                if (CurrentInstance.TimeResult >= CurrentInstance.TimeManagerEndTime && CurrentInstance.TimeManagerEndTime != 0) {
                    CurrentInstance.TimeResult = CurrentInstance.TimeManagerEndTime;
                }
            }
            return;
        }

        GetInstance(SearchString) {
            this.CurrentInstanceToUse = null;
            for (var i = 0; i < this.m_TimeManagerList.length; i++) {
                if (this.m_TimeManagerList[i].TimeManagerLabelName == SearchString) {
                    this.CurrentInstanceToUse = this.m_TimeManagerList[i];
                    return;
                }
            }
            this.CurrentInstanceToUse = null;
            return;
        }
        ResetTimeManager(CurrentInstance) {
            if (CurrentInstance == null) {
                return;
            }

            if (CurrentInstance.CountDown == true) {
                var TempValue = CurrentInstance.TimeLimit;
                CurrentInstance.TimeManagerStartTime = (this._runtime.GetGameTime() * 1000) - CurrentInstance.TimeManagerExtraStartTime;
                CurrentInstance.TimeManagerEndTime = (TempValue + CurrentInstance.TimeManagerStartTime);
                CurrentInstance.TimeResult = TempValue;
            }
            if (CurrentInstance.CountUp == true && CurrentInstance.TimeManagerEndTime == 0) {
                CurrentInstance.TimeManagerStartTime = (this._runtime.GetGameTime() * 1000) - CurrentInstance.TimeManagerExtraStartTime;
                CurrentInstance.TimeManagerEndTime = 0;
                CurrentInstance.TimeResult = 0;
            }
            if (CurrentInstance.CountUp == true && CurrentInstance.TimeManagerEndTime != 0) {
                CurrentInstance.TimeManagerStartTime = (this._runtime.GetGameTime() * 1000) - CurrentInstance.TimeManagerExtraStartTime;
                CurrentInstance.TimeManagerEndTime = CurrentInstance.TimeLimit;
                CurrentInstance.TimeResult = 0;
            }

            CurrentInstance.PauseValue = 0;
            CurrentInstance.PauseTotal = 0;
            CurrentInstance.PauseStartValue = (this._runtime.GetGameTime() * 1000) - CurrentInstance.TimeManagerExtraStartTime;
        }/*
        TimeManager(LabelStr, StartTime, EndTime, TimeLimit, ExtraStartTime) {
            this.TimeManagerLabelName = LabelStr;
            this.TimeManagerStartTime = StartTime;
            this.TimeManagerEndTime = EndTime;
            this.TimeManagerExtraStartTime = ExtraStartTime;

            this.CountDown = false;
            this.CountUp = false;
            this.IsActive = true;
            this.IsStopped = false;

            this.TimeResult = 0.0;
            this.TimeLimit = TimeLimit;

            this.PauseStartValue = 0.0;
            this.PauseValue = 0.0;
            this.PauseTotal = 0.0;

            this.MinuteBaseValue = 60;
            this.SecondBaseValue = 60;
            this.MillisecondBaseValue = 1000;
        }*/
    }
    ;
}
