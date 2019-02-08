// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.SweetAlert = function(runtime) {
    this.runtime = runtime;
};

(function() {
    var pluginProto = cr.plugins_.SweetAlert.prototype;

    /////////////////////////////////////
    // Object type class
    pluginProto.Type = function(plugin) {
        this.plugin = plugin;
        this.runtime = plugin.runtime;
    };

    var typeProto = pluginProto.Type.prototype;

    // called on startup for each object type
    typeProto.onCreate = function() {};

    /////////////////////////////////////
    // Instance class
    pluginProto.Instance = function(type) {
        this.type = type;
        this.runtime = type.runtime;
        /////////////////////////////////////
        this.open = 0;
        this.tag = "";
        this.lastValue = "";
        this.lastValueAt = [];
        this.array = [];
        this.count = 0;
    };

    var instanceProto = pluginProto.Instance.prototype;

    // called whenever an instance is created
    instanceProto.onCreate = function() {
        /////////////////////////////////////
    	this.error = {
    		"text": this.properties[0],
    		"email": this.properties[1],
    		"password": this.properties[2],
    		"number": this.properties[3],
    		"url": this.properties[4],
            "radio": this.properties[5],
            "progress": this.properties[6]
    	};
        /////////////////////////////////////
        this.style = {
            "position": this.getType(-1, this.properties[7]),
            "background": this.properties[8],
            "color": this.properties[9],
            "width": this.properties[10],
            "reverse": this.properties[11] ? false : true,
            "cancel": this.properties[12],
            "confirm": this.properties[13]
        };
        /////////////////////////////////////
    };

    // called whenever an instance is destroyed
    instanceProto.onDestroy = function() {};

    // called when saving the full state of the game
    instanceProto.saveToJSON = function() { return {}; };

    // called when loading the full state of the game
    instanceProto.loadFromJSON = function(o) {};

    // only called if a layout object - draw to a canvas 2D context
    instanceProto.draw = function(ctx) {};

    // only called if a layout object in WebGL mode - draw to the WebGL context
    instanceProto.drawGL = function(glw) {};

    //////////////////////////////////////
    // Functions
    instanceProto.getType = function(type, position) {
        if (type != -1) {
            switch (type) {
                case 0:
                    return "";
                case 1:
                    return "success";
                case 2:
                    return "error";
                case 3:
                    return "warning";
                case 4:
                    return "info";
                case 5:
                    return "question";
            };
        } else {
            switch (position) {
                case 0:
                    return "top";
                case 1:
                    return "top-left";
                case 2:
                    return "top-right";
                case 3:
                    return "center";
                case 4:
                    return "center-left";
                case 5:
                    return "center-right";
                case 6:
                    return "bottom";
                case 7:
                    return "bottom-left";
                case 8:
                    return "bottom-right";
            };
        };
    };
    //////////////////////////////////////
    instanceProto.email = function (email_) {
	    var regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	    return regex.test(email_);
    };
    //////////////////////////////////////
    instanceProto.url = function (url_) {
	    var regex = /^(https?|http?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
	    return regex.test(url_);
    };

    //////////////////////////////////////
    // Conditions
    function Cnds() {};

    Cnds.prototype.OnOpen = function() {
        return true;
    };

    Cnds.prototype.OnClose = function() {
        return true;
    };

    Cnds.prototype.OnTimeOut = function(tag_) {
        return cr.equals_nocase(tag_, this.tag);
    };

    Cnds.prototype.OnCancel = function(tag_) {
        return cr.equals_nocase(tag_, this.tag);
    };

    Cnds.prototype.OnConfirm = function(tag_) {
        return cr.equals_nocase(tag_, this.tag);
    };

    Cnds.prototype.IsOpen = function() {
        return this.open;
    };

    pluginProto.cnds = new Cnds();

    //////////////////////////////////////
    // Actions
    function Acts() {};
    
    Acts.prototype.Style = function(position_, background_, color_, width_, reverse_, cancel_, confirm_) {
        this.style = {
            "position": this.getType(-1, position_),
            "background": background_,
            "color": color_,
            "width": width_,
            "reverse": reverse_ ? false : true,
            "cancel": cancel_,
            "confirm": confirm_
        };
    };
    // top | top-left | top-right | center | center-left | center-right | bottom | bottom-left | bottom-right
    Acts.prototype.StylePosition = function(position_) {
        this.style["position"] = position_;
    };
    
    Acts.prototype.StyleBackground = function(background_) {
        this.style["background"] = background_;
    };

    Acts.prototype.StyleColor = function(color_) {
        this.style["color"] = color_;
    };

    Acts.prototype.StyleWidth = function(width_) {
        this.style["width"] = width_;
    };

    Acts.prototype.StyleInvert = function(reverse_) {
        this.style["reverse"] = reverse_ === "true" || reverse_ === 1 ? false : true;
    };

    Acts.prototype.StyleCancel = function(cancel_) {
        this.style["cancel"] = cancel_;
    };

    Acts.prototype.StyleConfirm = function(confirm_) {
        this.style["confirm"] = confirm_;
    };
    //////////////////////////////////////
    Acts.prototype.Close = function() {
        swal.closeModal();
        this.open = 0;
        this.count = 0;
        this.lastValue = "";
        this.lastValueAt = "";
        this.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnClose, this);
        this.tag = "";
    };
    // 'text' | 'number' | 'password' | 'email' | 'tel' | 'file' | 'range' | 'select' | 'radio' | 'checkbox' | 'textarea'
    Acts.prototype.Input = function(tag_, type_, title_, text_, confirm_, cancel_, allow_escapekey_, allow_outsideclick_, error_, params_) {
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
        swal({
            /////////////////////////////////////
            type: self.getType(type_),
            title: title_,
            html: input,
            /////////////////////////////////////
            background: self.style["background"],
            color: self.style["color"],
            position: self.style["position"],
            width: self.style["width"],
            /////////////////////////////////////
            buttonsStyling: true,
            focusConfirm: false,
            focusCancel: false,
            confirmButtonText: confirm_,
            showConfirmButton: (confirm_),
            cancelButtonText: cancel_,
            showCancelButton: (cancel_),
            confirmButtonColor: self.style["confirm"],
            cancelButtonColor: self.style["cancel"],
            reverseButtons: self.style["reverse"],
            /////////////////////////////////////
            allowEscapeKey: allow_escapekey_,
            allowOutsideClick: allow_outsideclick_,
            /////////////////////////////////////
            onOpen: function () {
                self.open = 1;
                self.tag = tag_;
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnOpen, self);
            },
            preConfirm: function() {
                return new Promise(function(resolve) {
                    for (var i = 0; i < params_.length; i++) {
                        var validate;
                        if (type[i] === "email") {
                        	validate = self.email($('#swal-input_' + i).val());
                        	if (validate === true || !error_)
                        		self.array[i] = $("#swal-input_" + i).val() || "";
                        	else {
		                        $('#swal-input_' + i).focus();
		                        swal.showValidationError(self.error.email);
		                        break;
                        	}
                        } else if (type[i] === "url") {
                        	validate = self.url($('#swal-input_' + i).val());
                        	if (validate === true || !error_)
                        		self.array[i] = $("#swal-input_" + i).val() || "";
                        	else {
		                        $('#swal-input_' + i).focus();
		                        swal.showValidationError(self.error.url);
		                        break;
                        	}
                        } else if ($('#swal-input_' + i).val() === "" && error_) {
	                        if (type[i] === "text")
	                            swal.showValidationError(self.error.text);
	                        else if (type[i] === "password")
	                           	swal.showValidationError(self.error.password);
	                        else if (type[i] === "number")
                            	swal.showValidationError(self.error.number);

                            $('#swal-input_' + i).focus();
	                        break;
                        } else
                        	self.array[i] = $("#swal-input_" + i).val() || "";
                    };
                    /////////////////////////////////////
                    resolve(self.array);
                });
            }
        }).then(function(result) {
            self.open = 0;
            if (result.value) {
                self.count = result["value"].length;
                self.lastValue = JSON.stringify(result["value"]).slice(1, -1);
                self.lastValueAt = result["value"];
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnConfirm, self);
            } else if (result.dismiss === 'cancel') {
                self.count = 0;
                self.lastValue = "";
                self.lastValueAt = [];
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnCancel, self);
            };
            /////////////////////////////////////
            self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnClose, self);
            self.tag = "";
        });
    };
    //////////////////////////////////////
    Acts.prototype.Radio = function(tag_, type_, title_, text_, confirm_, cancel_, allow_escapekey_, allow_outsideclick_, error_, params_) {
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
            type: self.getType(type_),
            title: title_,
            text: text_,
            input: 'radio',
            inputOptions: inputOptions,
            /////////////////////////////////////
            background: self.style["background"],
            color: self.style["color"],
            position: self.style["position"],
            width: self.style["width"],
            /////////////////////////////////////
            buttonsStyling: true,
            focusConfirm: false,
            focusCancel: false,
            confirmButtonText: confirm_,
            showConfirmButton: (confirm_),
            cancelButtonText: cancel_,
            showCancelButton: (cancel_),
            confirmButtonColor: self.style["confirm"],
            cancelButtonColor: self.style["cancel"],
            reverseButtons: self.style["reverse"],
            /////////////////////////////////////
            allowEscapeKey: allow_escapekey_,
            allowOutsideClick: allow_outsideclick_,
            /////////////////////////////////////
            onOpen: function () {
                self.open = 1;
                self.tag = tag_;
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnOpen, self);
            },
			inputValidator: function (result) {
		    	return new Promise(function (resolve) {
		    		if (!result && error_)
		    			swal.showValidationError(self.error.radio);
		    		else
		    			resolve();
		    	})
			}
        }).then(function(result) {
            self.open = 0;
            self.count = 0;
            self.lastValueAt = [];
            if (result.value) {
                self.lastValue = JSON.stringify(result["value"]).slice(1, -1);
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnConfirm, self);
            } else if (result.dismiss === 'cancel') {
                self.lastValue = "";
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnCancel, self);
            };
            /////////////////////////////////////
            self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnClose, self);
            self.tag = "";
        });
    };
    //////////////////////////////////////
    Acts.prototype.Timer = function(tag_, type_, title_, text_, allow_escapekey_, allow_outsideclick_, timer_) {
    	var self = this;
        /////////////////////////////////////
        swal({
            /////////////////////////////////////
            type: self.getType(type_),
            title: title_,
            text: text_,
            timer: timer_ * 1000,
            /////////////////////////////////////
            background: self.style["background"],
            color: self.style["color"],
            position: self.style["position"],
            width: self.style["width"],
            /////////////////////////////////////
            showConfirmButton: false,
            showCancelButton: false,
            /////////////////////////////////////
            allowEscapeKey: allow_escapekey_,
            allowOutsideClick: allow_outsideclick_,
            /////////////////////////////////////
            onOpen: function () {
                swal.showLoading();
                self.open = 1;
                self.tag = tag_;
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnOpen, self);
            },
            onClose: function () {
            	self.open = 0;
            	self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnClose, self);
                self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnTimeOut, self);
                self.tag = "";
            }
        });
    };
    
    Acts.prototype.ProgressStepsClear = function(error_, params_) {
        this.array = [];
    };
    // 'text' | 'number' | 'password' | 'email' | 'tel' | 'file' | 'range' | 'select' | 'radio' | 'checkbox' | 'textarea'
    Acts.prototype.ProgressSteps = function(error_, params_) {
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
    };

    Acts.prototype.Progress = function(tag_, cancel_, back_, next_, confirm_, allow_escapekey_, allow_outsideclick_, params_) {
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
            swal.setDefaults({
                /////////////////////////////////////
                html: params_[i]+"<br/>"+self.array[i]['html'],
                currentProgressStep: i,
                progressSteps: progressSteps,
                /////////////////////////////////////
                background: self.style["background"],
                color: self.style["color"],
                position: self.style["position"],
                width: self.style["width"],
                /////////////////////////////////////
                buttonsStyling: true,
                showCancelButton: true,
                focusConfirm: false,
                focusCancel: false,
                confirmButtonText: i < steps.length - 1 ? next_ : confirm_,
                cancelButtonText: i > 0 ? back_ : cancel_,
                confirmButtonColor: self.style["confirm"],
                cancelButtonColor: self.style["cancel"],
                reverseButtons: self.style["reverse"],
                /////////////////////////////////////
                allowEscapeKey: allow_escapekey_,
                allowOutsideClick: allow_outsideclick_,
                /////////////////////////////////////
                preConfirm: function() {
                    return new Promise(function(resolve) {
                    	var data = [];
                        var validate;
                        var pass = false;
                        /////////////////////////////////////
                        $(".swal_alert").each(function() {
                            data.push($(this).val());
                            var type = $(this).attr("type");
                            var error = "";
                            /////////////////////////////////////
                            switch (type) {
                            	case "email":
                            		validate = self.email($(this).val());
                            		error = self.error.email || self.error.progress;
                            		break;
                            	case "url":
                            		validate = self.url($(this).val());
                            		error = self.error.url || self.error.progress;
                            		break;
                            	case "password":
                            		validate = ((!pass || $(this).val() === pass) && $(this).val() != "") ? true : false;
                            		pass = $(this).val();
                            		error = self.error.password || self.error.progress;
                            		break;
                            	case "text":
                            		validate = $(this).val() != "" ? true : false;
                            		error = self.error.text || self.error.progress;
                                    break;
                            	case "number":
                            		validate = $(this).val() != "" ? true : false;
                            		error = self.error.number || self.error.progress;
                                    break;
                            	case "radio":
                            		validate = $(this).val() != "" ? true : false;
                            		error = self.error.radio || self.error.progress;
                                    break;
                            	default:
                            		validate = $(this).val() != "" ? true : false;
                            		error = self.error.progress;
                        	};
                            /////////////////////////////////////
                            if (!validate && self.array[i]['error']) {
                                $(this).focus();
                                swal.showValidationError(error);
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
            swal.resetDefaults();
            self.open = 0;
            self.count = success_ ? array.length : 0;
            self.lastValue = success_ && array.length ? JSON.stringify(array).slice(1, -1) : "";
            self.lastValueAt = success_ ? array : [];
            self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnClose, self);
            if (success_) self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnConfirm, self);
            else self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnCancel, self);
            self.tag = "";
        };
        /////////////////////////////////////
        self.tag = tag_;
        self.open = 1;
        self.runtime.trigger(cr.plugins_.SweetAlert.prototype.cnds.OnOpen, self);
        /////////////////////////////////////
        setDefault(0);
        generate(0);
        /////////////////////////////////////
        function generate(i) {
            swal.queue(steps[i]).then(function(result) {
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
    };

    pluginProto.acts = new Acts();

    //////////////////////////////////////
    // Expressions
    function Exps() {};

    Exps.prototype.GetLastValue = function(ret)
    {
        ret.set_any(this.lastValue);
    };

    Exps.prototype.GetLastValueAt = function(ret, at_)
    {
        ret.set_any(JSON.stringify(this.lastValueAt[at_]));
    };

    Exps.prototype.GetCount = function(ret)
    {
        ret.set_int(this.count);
    };

    Exps.prototype.GetTag = function(ret)
    {
        ret.set_string(this.tag);
    };

    pluginProto.exps = new Exps();

}());