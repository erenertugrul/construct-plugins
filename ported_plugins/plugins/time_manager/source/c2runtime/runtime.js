// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.CAMFTimeManager = function(runtime) {
    this.runtime = runtime;
}
;

(function() {
    /////////////////////////////////////
    // *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
    //                            vvvvvvvv
    var pluginProto = cr.plugins_.CAMFTimeManager.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    }
    ;

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function() {
    }
    ;

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;

        // any other properties you need, e.g...
        // this.myValue = 0;
    }
    ;

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function() {
        // note the object is sealed after this call; ensure any properties you'll ever need are set on the object
        // e.g...
        // this.myValue = 0;	
        this.CurrentInstanceToUse = null;
        this.m_OldTotalCheckValue = 0;
        this.m_TimeManagerList = new Array();
    }
    ;

    // called whenever an instance is destroyed
    // note the runtime may keep the object after this call for recycling; be sure
    // to release/recycle/reset any references to other objects in this function.
    instanceProto.onDestroy = function() {}
    ;

    // called when saving the full state of the game
    instanceProto.saveToJSON = function() {
        // return a Javascript object containing information about your object's state
        // note you MUST use double-quote syntax (e.g. "property": value) to prevent
        // Closure Compiler renaming and breaking the save format
        return {
            "TimerList": this.m_TimeManagerList
            // e.g.
            //"myValue": this.myValue
        };
    }
    ;

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function(o) {
        this.m_TimeManagerList = o["TimerList"];
        // load from the state previously saved by saveToJSON
        // 'o' provides the same object that you saved, e.g.
        // this.myValue = o["myValue"];
        // note you MUST use double-quote syntax (e.g. o["property"]) to prevent
        // Closure Compiler renaming and breaking the save format
    }
    ;

    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function(ctx) {}
    ;

    // only called if a layout object in WebGL mode - draw to the WebGL context
    // 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
    // directory or just copy what other plugins do.
    instanceProto.drawGL = function(glw) {}
    ;

    // The comments around these functions ensure they are removed when exporting, since the
    // debugger code is no longer relevant after publishing.
    /**BEGIN-PREVIEWONLY**/
    instanceProto.getDebuggerValues = function(propsections) {
        // Append to propsections any debugger sections you want to appear.
        // Each section is an object with two members: "title" and "properties".
        // "properties" is an array of individual debugger properties to display
        // with their name and value, and some other optional settings.

        for (var i = 0; i < this.m_TimeManagerList.length; i++) {

            propsections.push({
                "title": this.m_TimeManagerList[i].TimeManagerLabelName,
                "properties": [{
                    "name": "IsActive",
                    "value": this.m_TimeManagerList[i].IsActive,
                    "readonly": true
                }, {
                    "name": "IsStopped",
                    "value": this.m_TimeManagerList[i].IsStopped,
                    "readonly": true
                }, {
                    "name": "CountDown",
                    "value": this.m_TimeManagerList[i].CountDown,
                    "readonly": true
                }, {
                    "name": "CountUp",
                    "value": this.m_TimeManagerList[i].CountUp,
                    "readonly": true
                }, {
                    "name": "ExtraStartTime",
                    "value": this.m_TimeManagerList[i].TimeManagerExtraStartTime,
                    "readonly": true
                }, {
                    "name": "MinuteBaseValue",
                    "value": this.m_TimeManagerList[i].MinuteBaseValue,
                    "readonly": true
                }, {
                    "name": "SecondBaseValue",
                    "value": this.m_TimeManagerList[i].SecondBaseValue,
                    "readonly": true
                }, {
                    "name": "MillisecondBaseValue",
                    "value": this.m_TimeManagerList[i].MillisecondBaseValue,
                    "readonly": true
                }
                // Each property entry can use the following values:
                // "name" (required): name of the property (must be unique within this section)
                // "value" (required): a boolean, number or string for the value
                // "html" (optional, default false): set to true to interpret the name and value
                //									 as HTML strings rather than simple plain text
                // "readonly" (optional, default false): set to true to disable editing the property

                // Example:
                // {"name": "My property", "value": this.myValue}
                ]
            });
        }
    }
    ;

    instanceProto.onDebugValueEdited = function(header, name, value) {
        // Called when a non-readonly property has been edited in the debugger. Usually you only
        // will need 'name' (the property name) and 'value', but you can also use 'header' (the
        // header title for the section) to distinguish properties with the same name.
        if (name === "My property")
            this.myProperty = value;
    }
    ;
    /**END-PREVIEWONLY**/

    /*
		TIME MANAGER
	*/
    instanceProto.ConvertHours = function(Time, ShowDouble) {
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
    instanceProto.ConvertMinutes = function(Time, ShowDouble) {
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
    instanceProto.ConvertSeconds = function(Time, ShowDouble) {
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
    instanceProto.ConvertMilliseconds = function(Time, ShowDouble) {
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

    instanceProto.GetHours = function(Time, ShowDouble) {
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
    instanceProto.GetMinutes = function(Time, ShowDouble) {
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
    instanceProto.GetSeconds = function(Time, ShowDouble) {
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
    instanceProto.GetMilliseconds = function(Time, ShowDouble) {
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
    instanceProto.CalculateTime = function(CurrentInstance) {
        if (CurrentInstance.IsStopped == true) {
            CurrentInstance.PauseValue = 0;
            return;
        }
        if (CurrentInstance.IsActive == false) {
            CurrentInstance.PauseValue = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.PauseStartValue;
            return;
        }

        var CurrentTime = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.PauseTotal;

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

    instanceProto.GetInstance = function(SearchString) {
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
    instanceProto.ResetTimeManager = function(CurrentInstance) {
        if (CurrentInstance == null) {
            return;
        }

        if (CurrentInstance.CountDown == true) {
            var TempValue = CurrentInstance.TimeLimit;
            CurrentInstance.TimeManagerStartTime = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.TimeManagerExtraStartTime;
            CurrentInstance.TimeManagerEndTime = (TempValue + CurrentInstance.TimeManagerStartTime);
            CurrentInstance.TimeResult = TempValue;
        }
        if (CurrentInstance.CountUp == true && CurrentInstance.TimeManagerEndTime == 0) {
            CurrentInstance.TimeManagerStartTime = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.TimeManagerExtraStartTime;
            CurrentInstance.TimeManagerEndTime = 0;
            CurrentInstance.TimeResult = 0;
        }
        if (CurrentInstance.CountUp == true && CurrentInstance.TimeManagerEndTime != 0) {
            CurrentInstance.TimeManagerStartTime = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.TimeManagerExtraStartTime;
            CurrentInstance.TimeManagerEndTime = CurrentInstance.TimeLimit;
            CurrentInstance.TimeResult = 0;
        }

        CurrentInstance.PauseValue = 0;
        CurrentInstance.PauseTotal = 0;
        CurrentInstance.PauseStartValue = (this.runtime.kahanTime.sum * 1000) - CurrentInstance.TimeManagerExtraStartTime;
    }

    instanceProto.TimeManager = function(LabelStr, StartTime, EndTime, TimeLimit, ExtraStartTime) {
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
    }

    //////////////////////////////////////
    // Conditions
    pluginProto.cnds = {};
    var cnds = pluginProto.cnds;

    cnds.IsCounterRunning = function(LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return false;
        }
        if (this.CurrentInstanceToUse.IsStopped == false) {
            return true;
        }
        return false;
    }
    cnds.IsCounterPaused = function(LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return false;
        }
        if (this.CurrentInstanceToUse.IsActive == true) {
            return false;
        }
        return true;
    }
    cnds.IsCounterFinished = function(LabelStr) {
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
    }
    ;
    cnds.IsCounterStopped = function(LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return false;
        }
        return this.CurrentInstanceToUse.IsStopped;
    }
    cnds.CheckCounterValue = function(LabelStr, CheckOption, Hours, Minutes, Seconds, Milliseconds) {
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
    //////////////////////////////////////
    // Actions
    pluginProto.acts = {};
    var acts = pluginProto.acts;

    acts.SetMinuteBaseValue = function(LabelStr, BaseValue) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.CurrentInstanceToUse.MinuteBaseValue = BaseValue;
    }
    acts.SetSecondBaseValue = function(LabelStr, BaseValue) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.CurrentInstanceToUse.SecondBaseValue = BaseValue;
    }
    acts.SetMillisecondBaseValue = function(LabelStr, BaseValue) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.CurrentInstanceToUse.MillisecondBaseValue = BaseValue;
    }
    acts.StopTimeCount = function(LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.ResetTimeManager(this.CurrentInstanceToUse);
        this.CurrentInstanceToUse.IsActive = true;
        this.CurrentInstanceToUse.IsStopped = true;
        return;
    }
    acts.StartTimeCount = function(LabelStr) {
        this.CurrentInstanceToUse = null;
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.ResetTimeManager(this.CurrentInstanceToUse);
        this.CurrentInstanceToUse.IsActive = true;
        this.CurrentInstanceToUse.IsStopped = false;
        return;
    }
    acts.DestroyTimeManagerInstances = function() {
        this.m_TimeManagerList.length = 0;
        return;
    }
    acts.PauseTimeCount = function(LabelStr, CurrentChoice) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        if (CurrentChoice == 0 && this.CurrentInstanceToUse.IsActive == true) {
            this.CurrentInstanceToUse.IsActive = false;
            this.CurrentInstanceToUse.PauseStartValue = (this.runtime.kahanTime.sum * 1000);
        } else if (CurrentChoice == 1 && this.CurrentInstanceToUse.IsActive == false) {
            this.CurrentInstanceToUse.IsActive = true;
            this.CurrentInstanceToUse.PauseTotal += this.CurrentInstanceToUse.PauseValue;
        }
        this.CurrentInstanceToUse.PauseValue = 0.0;
        return;
    }
    acts.ResetTimeCount = function(LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return;
        }
        this.ResetTimeManager(this.CurrentInstanceToUse);
        return;
    }
    acts.TimeCountDown = function(CountdownTime, LabelStr, ActiveState) {
        /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
        for (var i = 0; i < this.m_TimeManagerList.length; i++) {
            if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                this.m_TimeManagerList.splice(i, 1);
                break;
            }
        }
        var StartTime = (this.runtime.kahanTime.sum * 1000);
        var EndTime = (CountdownTime + StartTime);
        var TempTimeManager = new this.TimeManager(LabelStr,StartTime,EndTime,CountdownTime,0.0);
        TempTimeManager.CountDown = true;
        TempTimeManager.IsStopped = ActiveState;
        this.ResetTimeManager(TempTimeManager);
        this.m_TimeManagerList.push(TempTimeManager);
        return;
    }
    ;
    acts.TimeCountUp = function(LabelStr, ActiveState) {
        /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
        for (var i = 0; i < this.m_TimeManagerList.length; i++) {
            if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                this.m_TimeManagerList.splice(i, 1);
                break;
            }
        }
        var StartTime = (this.runtime.kahanTime.sum * 1000);
        var EndTime = 0;
        var TempTimeManager = new this.TimeManager(LabelStr,StartTime,EndTime,0.0,0.0);
        TempTimeManager.CountUp = true;
        TempTimeManager.IsStopped = ActiveState;
        this.ResetTimeManager(TempTimeManager);
        this.m_TimeManagerList.push(TempTimeManager);
        return;
    }
    ;
    acts.TimeCountUpWithStartValue = function(LabelStr, ActiveState, StartValue) {
        /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
        for (var i = 0; i < this.m_TimeManagerList.length; i++) {
            if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                this.m_TimeManagerList.splice(i, 1);
                break;
            }
        }
        var StartTime = ((this.runtime.kahanTime.sum * 1000) - StartValue);
        var EndTime = 0;
        var TempTimeManager = new this.TimeManager(LabelStr,StartTime,EndTime,0.0,StartValue);
        TempTimeManager.CountUp = true;
        TempTimeManager.IsStopped = ActiveState;
        this.ResetTimeManager(TempTimeManager);
        this.m_TimeManagerList.push(TempTimeManager);
        return;
    }
    ;
    acts.TimeCountUpWithLimit = function(TimeLimit, LabelStr, ActiveState) {
        /*First I need to check if its already in the array. If its there, I delete and remove if from the array and re-add it to the array.*/
        for (var i = 0; i < this.m_TimeManagerList.length; i++) {
            if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                this.m_TimeManagerList.splice(i, 1);
                break;
            }
        }
        var StartTime = (this.runtime.kahanTime.sum * 1000);
        var EndTime = TimeLimit;
        var TempTimeManager = new this.TimeManager(LabelStr,StartTime,EndTime,TimeLimit,0.0,0.0);
        TempTimeManager.CountUp = true;
        TempTimeManager.IsStopped = ActiveState;
        this.ResetTimeManager(TempTimeManager);
        this.m_TimeManagerList.push(TempTimeManager);
        return;
    }
    ;
    acts.RemoveSingleCounter = function(LabelStr) {
        for (var i = 0; i < this.m_TimeManagerList.length; i++) {
            if (this.m_TimeManagerList[i].TimeManagerLabelName == LabelStr) {
                this.m_TimeManagerList.splice(i, 1);
                return;
            }
        }
        return;
    }

    acts.CalculateTimeValue = function(LabelStr, CalculationType, Value) {
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

    //////////////////////////////////////
    // Expressions
    pluginProto.exps = {};
    var exps = pluginProto.exps;

    exps.HMSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.HMSSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.HMMSSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.HHMMSSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.HHMMSS = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.MMSSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.SSMM = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.MMSS = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.Seconds = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.SingleSeconds = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, false);
        return ret.set_string(ReturnString);
    }
    ;
    exps.Milliseconds = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_int(0);
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnValue = this.CurrentInstanceToUse.TimeResult;
        return ret.set_int(ReturnValue);
    }
    ;

    /* BACKWARD COMPABILITY EXPRESSIONS - DO NOT ADD NEW FUNCTIONS */
    exps.GetStringHMSMTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, false) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringHMSTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetHours(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringMSMTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringSMTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringMSTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMinutes(this.CurrentInstanceToUse.TimeResult, true) + ":" + this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringSTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetSeconds(this.CurrentInstanceToUse.TimeResult, true);
        return ret.set_string(ReturnString);
    }
    ;
    exps.GetStringMTimeValue = function(ret, LabelStr) {
        this.GetInstance(LabelStr);
        if (this.CurrentInstanceToUse == null) {
            return ret.set_string("");
        }
        this.CalculateTime(this.CurrentInstanceToUse);
        var ReturnString = this.GetMilliseconds(this.CurrentInstanceToUse.TimeResult);
        return ret.set_string(ReturnString);
    }
    ;
    exps.ConvertNumberToHHMMSSMM = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMMSSMM = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMSSMM = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMSMM = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, false) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHHMMSS = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, true) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMMSS = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMSS = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToHMS = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertHours(TimeValue, false) + ":" + instanceProto.ConvertMinutes(TimeValue, false) + ":" + instanceProto.ConvertSeconds(TimeValue, false);
        ret.set_string(ReturnString);
    }
    exps.ConvertNumberToMMSSMM = function(ret, TimeValue) {
        var ReturnString = instanceProto.ConvertMinutes(TimeValue, true) + ":" + instanceProto.ConvertSeconds(TimeValue, true) + ":" + instanceProto.ConvertMilliseconds(TimeValue, true);
        ret.set_string(ReturnString);
    }
}());
