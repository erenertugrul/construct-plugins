"use strict";

{
	C3.Plugins.SweetAlert.Acts =
	{
	   Style(position_, background_, color_, width_, reverse_, cancel_, confirm_) 
	   {
	        this.style = {
	            "position": this.getType(-1, position_),
	            "background": background_,
	            "color": color_,
	            "width": width_,
	            "reverse": reverse_ ? false : true,
	            "cancel": cancel_,
	            "confirm": confirm_
	        };
	    },
	    StylePosition(position_) 
	    {
	        this.style["position"] = position_;
	    },
	    
	    StyleBackground(background_) {

	        this.style["background"] = background_;
	    },

	    StyleColor(color_) 
	    {
	        this.style["color"] = color_;
	    },

	    StyleWidth(width_) 
	    {
	        this.style["width"] = width_;
	    },

	    StyleInvert(reverse_) 
	    {
	        this.style["reverse"] = reverse_ === "true" || reverse_ === 1 ? false : true;
	    },

	    StyleCancel(cancel_) 
	    {
	        this.style["cancel"] = cancel_;
	    },

	    StyleConfirm(confirm_) 
	    {
	        this.style["confirm"] = confirm_;
	    },
	    Close () 
	    {
	        _swal["closeModal"]();
	        this["open"] = 0;
	        this["count"] = 0;
	        this["lastValue"] = "";
	        this["lastValueAt"] = "";
	        this.Trigger(C3.Plugins.SweetAlert.Cnds.OnClose, this);
	        this["tag"] = "";
	    },
	    Input(tag_, type_, title_, text_, confirm_, cancel_, allow_escapekey_, allow_outsideclick_, error_, params_) 
	    {
	        var self = this;
	        var input = (text_) ? text_ + "<br/><div style='display: block;'>" : "<div style='display: block;'>";
	        var maxlength = 0, type = [], text = [];
	        this.open = 1;
	        this.array = [];
	        /////////////////////////////////////
	        for (var i = 0; i < params_.length; i++) {
	            var array = params_[i].split(",");
	            type[i] = array[0];
	            text[i] = array[1];
	            for (var x = (array.length - 1); x > 1; x--) {
	                text[i] += array[x];
	            };
	            /////////////////////////////////////
	            input += "<input type='"+type[i]+"' id='swal-input_"+i+"' class='swal2-input' placeholder='"+text[i]+"'"+
	                     "onchange='swal.resetValidationError(); swal.enableButtons();'"+
	                     "onkeyup='swal.resetValidationError(); swal.enableButtons();'"+
	                     "onpaste='swal.resetValidationError(); swal.enableButtons();'"+
	                     ">";//"autofocus>";
	        };
	        /////////////////////////////////////
	        input += "</div>";
	        /////////////////////////////////////
	        _swal({
	            /////////////////////////////////////
	            ["type"]: self.getType(type_),
	            ["title"]: title_,
	            ["html"]: input,
	            /////////////////////////////////////
	            ["background"]: self["style"]["background"],
	            ["color"]: self["style"]["color"],
	            ["position"]: self["style"]["position"],
	            ["width"]: self["style"]["width"],
	            /////////////////////////////////////
	            ["buttonsStyling"]: true,
	            ["focusConfirm"]: false,
	            ["focusCancel"]: false,
	            ["confirmButtonText"]: confirm_,
	            ["showConfirmButton"]: (confirm_),
	            ["cancelButtonText"]: cancel_,
	            ["showCancelButton"]: (cancel_),
	            ["confirmButtonColor"]: self["style"]["confirm"],
	            ["cancelButtonColor"]: self["style"]["cancel"],
	            ["reverseButtons"]: self["style"]["reverse"],
	            /////////////////////////////////////
	            ["allowEscapeKey"]: allow_escapekey_,
	            ["allowOutsideClick"]: allow_outsideclick_,
	            /////////////////////////////////////
	            ["onOpen"]: function () {
	                self["open"] = 1;
	                self["tag"] = tag_;
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnOpen, self);
	            },
            ["preConfirm"]: function() {
                return new Promise(function(resolve) {
                    for (var i = 0; i < params_.length; i++) {
                        var validate;
                        if (type[i] === "email") {
                        	validate = self.email(_$('#swal-input_' + i).val());
                        	if (validate === true || !error_)
                        		self.array[i] = _$("#swal-input_" + i).val() || "";
                        	else {
		                        _$('#swal-input_' + i).focus();
		                        _swal["showValidationError"](self["error"]["email"]);
		                        break;
                        	}
                        } else if (type[i] === "url") {
                        	validate = self.url(_$('#swal-input_' + i).val());
                        	if (validate === true || !error_)
                        		self.array[i] = _$("#swal-input_" + i).val() || "";
                        	else {
		                        _$('#swal-input_' + i).focus();
		                        _swal["showValidationError"](self["error"]["url"]);
		                        break;
                        	}
                        } else if (_$('#swal-input_' + i).val() === "" && error_) {
	                        if (type[i] === "text")
	                            _swal["showValidationError"](self["error"]["text"]);
	                        else if (type[i] === "password")
	                           	_swal["showValidationError"](self["error"]["password"]);
	                        else if (type[i] === "number")
                            	_swal["showValidationError"](self["error"]["number"]);

                            _$('#swal-input_' + i).focus();
	                        break;
                        } else
                        	self.array[i] = _$("#swal-input_" + i).val() || "";
                    };
                    /////////////////////////////////////
                    resolve(self.array);
                });
            }
	        }).then(function(result) {
	            self.open = 0;
	            if (result.value) {
	                self["count"] = result["value"].length;
	                self["lastValue"] = JSON.stringify(result["value"]).slice(1, -1);
	                self["lastValueAt"] = result["value"];
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnConfirm, self);
	            } else if (result.dismiss === 'cancel') {
	                self["count"] = 0;
	                self["lastValue"] = "";
	                self["lastValueAt"] = [];
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnCancel, self);
	            };
	            /////////////////////////////////////
	            self.Trigger(C3.Plugins.SweetAlert.Cnds.OnClose, self);
	            self["tag"] = "";
	        });
	    },
	    Radio(tag_, type_, title_, text_, confirm_, cancel_, allow_escapekey_, allow_outsideclick_, error_, params_) 
	    {
	        var self = this, array = new Array(), inputOptions;
	        /////////////////////////////////////
			for (var i = 0; i < params_.length; i++) {
				array[params_[i]] = params_[i];
	        };
	        /////////////////////////////////////
	        inputOptions = new Promise(function (resolve) {
			    resolve(array);
			});
	        /////////////////////////////////////
			swal({
	            /////////////////////////////////////
	            ["type"]: self.getType(type_),
	            ["title"]: title_,
	            ["text"]: text_,
	            ["input"]: 'radio',
	            ["inputOptions"]: inputOptions,
	            /////////////////////////////////////
	            ["background"]: self.style["background"],
	            ["color"]: self.style["color"],
	            ["position"]: self.style["position"],
	            ["width"]: self.style["width"],
	            /////////////////////////////////////
	            ["buttonsStyling"]: true,
	            ["focusConfirm"]: false,
	            ["focusCancel"]: false,
	            ["confirmButtonText"]: confirm_,
	            ["showConfirmButton"]: (confirm_),
	            ["cancelButtonText"]: cancel_,
	            ["showCancelButton"]: (cancel_),
	            ["confirmButtonColor"]: self.style["confirm"],
	            ["cancelButtonColor"]: self.style["cancel"],
	            ["reverseButtons"]: self.style["reverse"],
	            /////////////////////////////////////
	            ["allowEscapeKey"]: allow_escapekey_,
	            ["allowOutsideClick"]: allow_outsideclick_,
	            /////////////////////////////////////
	            ["onOpen"]: function () {
	                self["open"] = 1;
	                self["tag"] = tag_;
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnOpen, self);
	            },
				["inputValidator"]: function (result) {
			    	return new Promise(function (resolve) {
			    		if (!result && error_)
			    			_swal["showValidationError"](self["error"]["radio"]);
			    		else
			    			resolve();
			    	})
				}
	        }).then(function(result) {
	            self["open"] = 0;
	            self["count"] = 0;
	            self["lastValueAt"] = [];
	            if (result.value) {
	                self["lastValue"] = JSON.stringify(result["value"]).slice(1, -1);
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnConfirm, self);
	            } else if (result.dismiss === 'cancel') {
	                self["lastValue"] = "";
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnCancel, self);
	            };
	            /////////////////////////////////////
	            self.Trigger(C3.Plugins.SweetAlert.Cnds.OnClose, self);
	            self["tag"] = "";
	        });
	    },
	    Timer(tag_, type_, title_, text_, allow_escapekey_, allow_outsideclick_, timer_) 
	    {
	    	var self = this;
	        /////////////////////////////////////
	        swal({
	            /////////////////////////////////////
	            ["type"]: self.getType(type_),
	            ["title"]: title_,
	            ["text"]: text_,
	            ["timer"]: timer_ * 1000,
	            /////////////////////////////////////
	            ["background"]: self.style["background"],
	            ["color"]: self.style["color"],
	            ["position"]: self.style["position"],
	            ["width"]: self.style["width"],
	            /////////////////////////////////////
	            ["showConfirmButton"]: false,
	            ["showCancelButton"]: false,
	            /////////////////////////////////////
	            ["allowEscapeKey"]: allow_escapekey_,
	            ["allowOutsideClick"]: allow_outsideclick_,
	            /////////////////////////////////////
	            ["onOpen"]: function () {
	                _swal["showLoading"]();
	                self["open"] = 1;
	                self["tag"] = tag_;
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnOpen, self);
	            },
            	["onClose"]: function () {
            		self["open"] = 0;
	            	self.Trigger(C3.Plugins.SweetAlert.Cnds.OnClose, self);
	                self.Trigger(C3.Plugins.SweetAlert.Cnds.OnTimeOut, self);
	                self["tag"] = "";
	            }
	        });
	    },
	    
	    ProgressStepsClear(error_, params_) 
	    {
	        this.array = [];
	    },
	    ProgressSteps(error_, params_) 
	    {
	        var input = "<div style='display: block;'>";
	        var type = [], text = [];
	        /////////////////////////////////////
	        for (var i = 0; i < params_.length; i++) {
	            var array = params_[i].split(",");
	            type[i] = array[0];
	            text[i] = array[1];
	            for (var x = (array.length - 1); x > 1; x--) {
	                text[i] += array[x];
	            };
	            /////////////////////////////////////
	            input += "<input type='"+type[i]+"' class='swal2-input swal_alert' placeholder='"+text[i]+"'"+
	                     "onchange='swal.resetValidationError(); swal.enableButtons();'"+
	                     "onkeyup='swal.resetValidationError(); swal.enableButtons();'"+
	                     "onpaste='swal.resetValidationError(); swal.enableButtons();'"+
	                     ">"//"autofocus>"; playlive
	        };
	        /////////////////////////////////////
	        this.array.push({
	            "html": input+"</div>",
	            "error": error_
	        });
	    },

	    Progress(tag_, cancel_, back_, next_, confirm_, allow_escapekey_, allow_outsideclick_, params_) 
	    {
	        if (!this.array.length)
	            return;
	        /////////////////////////////////////
	        var self = this;
	        var progressSteps = [];
	        var steps = [];
	        var array = [];
	        /////////////////////////////////////
	        for (var i = 0; i < params_.length; i++) {
	            progressSteps.push((i + 1).toString());
	            steps.push([{text: params_[i]}]);
	        };
	        /////////////////////////////////////
	        var setDefault = function(i) {
            _swal["setDefaults"]({
                /////////////////////////////////////
                ["html"]: params_[i]+"<br/>"+self.array[i]['html'],
                ["currentProgressStep"]: i,
                ["progressSteps"]: progressSteps,
                /////////////////////////////////////
                ["background"]: self.style["background"],
                ["color"]: self.style["color"],
                ["position"]: self.style["position"],
                ["width"]: self.style["width"],
                /////////////////////////////////////
                ["buttonsStyling"]: true,
                ["showCancelButton"]: true,
                ["focusConfirm"]: false,
                ["focusCancel"]: false,
                ["confirmButtonText"]: i < steps.length - 1 ? next_ : confirm_,
                ["cancelButtonText"]: i > 0 ? back_ : cancel_,
                ["confirmButtonColor"]: self.style["confirm"],
                ["cancelButtonColor"]: self.style["cancel"],
                ["reverseButtons"]: self.style["reverse"],
                /////////////////////////////////////
                ["allowEscapeKey"]: allow_escapekey_,
                ["allowOutsideClick"]: allow_outsideclick_,
                /////////////////////////////////////
                ["preConfirm"]: function() {
                    return new Promise(function(resolve) {
                    	var data = [];
                        var validate;
                        var pass = false;
                        /////////////////////////////////////
                        _$(".swal_alert").each(function() {
                            data.push(_$(this).val());
                            var type = _$(this).attr("type");
                            var error = "";
                            /////////////////////////////////////
                            switch (type) {
                            	case "email":
                            		validate = self.email(_$(this).val());
                            		error = self["error"]["email"] || self["error"]["progress"];
                            		break;
                            	case "url":
                            		validate = self.url(_$(this).val());
                            		error = self["error"]["url"] || self["error"]["progress"];
                            		break;
                            	case "password":
                            		validate = ((!pass || _$(this).val() === pass) && _$(this).val() != "") ? true : false;
                            		pass = _$(this).val();
                            		error = self["error"]["password"] || self["error"]["progress"];
                            		break;
                            	case "text":
                            		validate = _$(this).val() != "" ? true : false;
                            		error = self["error"]["text"] || self["error"]["progress"];
                                    break;
                            	case "number":
                            		validate = _$(this).val() != "" ? true : false;
                            		error = self["error"]["number"] || self["error"]["progress"];
                                    break;
                            	case "radio":
                            		validate = _$(this).val() != "" ? true : false;
                            		error = self["error"]["radio"] || self["error"]["progress"];
                                    break;
                            	default:
                            		validate = _$(this).val() != "" ? true : false;
                            		error = self["error"]["progress"];
                        	};
                            /////////////////////////////////////
                            if (!validate && self.array[i]['error']) {
                                _$(this).focus();
                                _swal["showValidationError"](["error"]);
                                return false;
                            };
                            /////////////////////////////////////
                        });
                        /////////////////////////////////////
	                        resolve(data);
	                    });
	                }
	            });
	        };
	        /////////////////////////////////////
	        var close = function(success_) {
	            _swal["resetDefaults"]();
	            self["open"] = 0;
	            self["count"] = success_ ? array.length : 0;
	            self["lastValue"] = success_ && array.length ? JSON.stringify(array).slice(1, -1) : "";
	            self["lastValueAt"] = success_ ? array : [];
	            self.Trigger(C3.Plugins.SweetAlert.Cnds.OnClose, self);
	            if (success_) self.Trigger(C3.Plugins.SweetAlert.Cnds.OnConfirm, self);
	            else self.Trigger(C3.Plugins.SweetAlert.Cnds.OnCancel, self);
	            self["tag"] = "";
	        };
	        /////////////////////////////////////
	        self.tag = tag_;
	        self.open = 1;
	        self.Trigger(C3.Plugins.SweetAlert.Cnds.OnOpen, self);
	        /////////////////////////////////////
	        setDefault(0);
	        generate(0);
	        /////////////////////////////////////
	        function generate(i) {
	            _swal["queue"](steps[i]).then(function(result) {
	                if (result['dismiss']) {
	                    /////////////////////////////////////
	                    if (result['dismiss'] === 'cancel') {
	                        array.splice(-1);
	                        if (i > 0) i--;
	                        else return close(false);
	                    } else if (allow_escapekey_ && allow_outsideclick_)
	                        return close(false);
	                    else if (allow_escapekey_ && result['dismiss'] === 'esc')
	                        return close(false);
	                    else if (allow_outsideclick_ && result['dismiss'] === 'overlay')
	                        return close(false);
	                    /////////////////////////////////////
	                } else {
	                    /////////////////////////////////////
	                    array.push(result['value']);
	                    if (i < (steps.length - 1)) i++;
	                    else return close(true);
	                    /////////////////////////////////////
	                };
	                /////////////////////////////////////
	                setDefault(i);
	                generate(i);
	            });
	        };
	        /////////////////////////////////////
	    }

	};
}