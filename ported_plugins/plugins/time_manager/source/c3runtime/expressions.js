"use strict";

{
    C3.Plugins.CAMFTimeManager.Exps = {
        HMSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        HMSSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        HMMSSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        HHMMSSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        HHMMSS(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        MMSSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        SSMM(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        MMSS(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        Seconds(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        SingleSeconds(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, false);
            return (ReturnString);
        },
        Milliseconds(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        GetTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return (0);
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnValue = this.CurrentInstanceToUse.TimeResult;
            return (ReturnValue);
        },

        /* BACKWARD COMPABILITY EXPRESSIONS - DO NOT ADD NEW FUNCTIONS */
        GetStringHMSMTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        GetStringHMSTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        GetStringMSMTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        GetStringSMTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        GetStringMSTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        GetStringSTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
            return (ReturnString);
        },
        GetStringMTimeValue(LabelStr) {
            this.GetInstance(LabelStr);
            if (this.CurrentInstanceToUse == null) {
                return ("");
            }
            this.CalculateTime(this.CurrentInstanceToUse);
            var ReturnString = this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
            return (ReturnString);
        },
        ConvertNumberToHHMMSSMM(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMMSSMM(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMSSMM(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMSMM(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, false) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHHMMSS(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMMSS(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMSS(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
            (ReturnString);
        },
        ConvertNumberToHMS(TimeValue) {
            var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, false);
            (ReturnString);
        },
        ConvertNumberToMMSSMM(TimeValue) {
            var ReturnString = instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
            (ReturnString);
        }
    };
}
