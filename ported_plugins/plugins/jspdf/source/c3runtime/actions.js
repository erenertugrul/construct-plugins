"use strict";

{
	C3.Plugins.jsPDF.Acts =
	{
		AddFont(postScriptname,fontname,fontstyle)
		{
			this.doc['addFont'](postScriptname,fontname,fontstyle);
		},


		SetFontSize (FontSize)
		{
			this.doc["setFontSize"](FontSize);
		},
		AddText (x,y,angle,string)
		{
			this.doc["text"](string,x,y,angle);
		},
		AddImage (x,y,w,h,type,base64string)
		{
			/*const request = async () => {	
				await self.TriggerAsync(C3.Plugins.jsPDF.Cnds.on_base64,self);
			};*/
			var self = this;
			var blob = base64string["startsWith"]('blob');
			if (blob == true){
				var xhr = new XMLHttpRequest(); 
				xhr.open("GET", base64string); 
				xhr.responseType = "blob";
				function analyze_data(blob)
				{
				    var myReader = new FileReader();
				    myReader.readAsDataURL(blob);
				    
				    myReader.addEventListener("loadend", function(e)
				    {
				    	self.doc["addImage"](e.srcElement.result,type,x,y,w,h);
						
						//request();
						
				    });
				}
				xhr.onload = function() 
				{
				    analyze_data(xhr.response);
				}
				xhr.send();
			} 
			else
			{
				self.doc["addImage"](base64string,type,x,y,w,h);
				//await self.TriggerAsync(C3.Plugins.jsPDF.Cnds.on_base64,self);
			}

		},

		SavePDF (name)
		{
			this.doc["output"]('save', name);
		},
		AddLine (x1,y1,x2,y2)
		{
			this.doc["line"](x1,y1,x2,y2);
		},
		AddRect (x1,y1,w,h,style)
		{
			this.doc["rect"](x1,y1,w,h,style);
		},
		SetFont(fontName, fontStyle) 
		{
			this.doc["setFont"](fontName, fontStyle);
		},

		AddPage() 
		{
			this.doc["addPage"]();
		},
		SetProperties(_title,_subject,_author,_keywords,_creator) 
		{
			this.doc["setProperties"]({
				"title": _title,
				"subject": _subject,
				"author": _author,
				"keywords": _keywords,
				"creator": _creator
			});
		},

		NewDocument (orientation,unit,format)
		{
			this.doc = null;
			this.doc = new globalThis["jsPDF"](orientation,unit,format);
		},
		SetFillColor (R,G,B)
		{
			this.doc["setFillColor"](R,G,B);
		},	

		SetDrawColor (R,G,B)
		{
			this.doc["setDrawColor"](R,G,B);
		},	

		SetTextColor (R,G,B)
		{
			this.doc["setTextColor"](R,G,B);
		},	
		AddEllipse (x1,y1,rx,ry,style)
		{
			this.doc["ellipse"](x1,y1,rx,ry,style);
		}
	};
}