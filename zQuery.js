// JavaScript Document
function ZQuery(arg){
	//arg-->$(……)函数传参。
	//zQuery对象添加属性elements存储选出来的元素
	this.elements = [];
	this.domstring = "";
	
	//判断参数数据类型
	switch(typeof(arg)){
		//函数
		case "function":
			addReady(arg);
			break;
		
		//字符串-->选择器
		case "string":
			if(arg.indexOf('<')!=-1){
				this.domstring = arg;
			}else{
				this.elements = getEle(arg);
			}
			break;
		//对象
		case "object":
			if(arg.length){
				for(var i = 0; i < arg.length; i ++){
					this.elements.push(arg[i]);
				}
			}else{
				this.elements.push(arg)
			}
			break
	}
};

//添加click方法
ZQuery.prototype.click=function (fn)
{
	this.bind("click", fn)
	
	return this;
};
//添加mouseover方法
ZQuery.prototype.mouseover = function(fn){
	this.bind("mouseover", fn);
};
//添加hover方法
ZQuery.prototype.hover = function(fnOver, fnOut){
	for(var i = 0; i < this.elements.length; i ++){
		addEvent(this.elements[i], "mouseover", fnOver);
		addEvent(this.elements[i], "mouseout", fnOut);
	}
	
	return false;
}
//添加toggle方法
ZQuery.prototype.toggle = function(){
	var _arg = arguments;
	var _this = this
	
	for(var i = 0; i < this.elements.length; i ++){
		(function(count){
			addEvent(_this.elements[i], "click", function(){
				_arg[count % _arg.length]();
				count ++;
			})
		})(i)
	}
}
//添加attr方法
ZQuery.prototype.attr = function(name, value){
	if(arguments.length == 2){
		for(var i = 0; i < this.elements.length; i ++){
			this.elements[i].setAttribute(name, value);
		}
	}else{
		if(typeof(name) == "string"){
			return this.elements[0].getAttribute(name);
		}else{
			for(var i = 0; i < this.elements.length; i ++){
				for(var j in name){
					this.elements[i].setAttribute(j, name[j]);
				}
			}
		}
	}
	
	return this;
}
//eq
ZQuery.prototype.eq = function(n){
	//返回jquery对象，需要重新new一个ZQuery函数
	return $(this.elements[n]);
};
//get
ZQuery.prototype.get = function(n){
	//直接返回原生对象
	return this.elements[n];
}
//index
ZQuery.prototype.index = function(){
	//选出第一个
	var obj = this.elements[this.elements.length - 1];
	//如果没选出来，返回-1
	if(!obj) return -1;
	//如果选出来的元素没有父级元素，返回-1
	if(!obj.parentNode) return -1;
	//选出所有同级元素
	var aSiblings = obj.parentNode.children;
	//循环所有同级元素
	for(var i = 0; i < aSiblings.length; i ++){
		//返回元素在同级元素中的位置
		if(obj == aSiblings[i]){
			return i;
		}
	}
};
//find
ZQuery.prototype.find = function(){
	var aChild = [];
	for(var i = 0; i < this.elements.length; i ++){
		var aEle = getEle(arguments[0]);
		for(var j = 0; j < aEle.length; j ++){
			aChild.push(aEle[j]);
		}
	}
	return $(aChild);
}
//appendTo
ZQuery.prototype.appendTo=function (arg)
{
	var aParent=$(arg).elements;
	
	for(var i=0;i<aParent.length;i++)
	{
		appendToParent(aParent[i], this.dom_string);
	}
};
ZQuery.prototype.each = function(fn){
	for(var i = 0; i < this.elements.length; i ++){
		fn.call(this.elements[i], i, this.elements[i]);
	}
}
//width
ZQuery.prototype.width = function(){
	return parseInt(this.css("width"));
};
//size
ZQuery.prototype.size = function(){
	return this.elements.length;
};
//addClass
ZQuery.prototype.addClass = function(str){
	this.each(function(){
		//判断className是否为空
		if(!this.className){
			var arr = [];
		}else{
			var arr = this.className.split(/\s+/g);
		}
		
		//如果class里没有要添加的class，把要添加的class名追加到class数组里
		if(arr.indexOf(str) == -1){
			arr.push(str);
		}
		this.className = arr.join(" ");
	})
	return this;
};
ZQuery.prototype.removeClass = function(str){
	this.each(function(){
		//判断className是否为空
		if(!this.className){
			var arr = [];
		}else{
			var arr = this.className.split(/\s+/g);
		}
		
		var n = arr.indexOf(str);
		if(n == -1) return;
		arr.splice(n, 1);
		this.className = arr.join(" ");
	});
};
//html
ZQuery.prototype.html = function(str){
	if(str){
		for(var i = 0; i < this.elements.length; i ++){
			this.elements[i].innerHTML = str;
		}
	}else{
		return this.elements[this.elements.length - 1].innerHTML;
	}
}

//extend
$.fn = ZQuery.fn = ZQuery.prototype;

$.fn.extend = function(json){
	for(var i in json){
		$.fn[i] = json[i];
	}
};

ZQuery.prototype.bind=function (sEv, fn)
{
	for(var i=0;i<this.elements.length;i++)
	{
		addEvent(this.elements[i], sEv, fn);
	}
	
	return this;
};


//添加css方法
ZQuery.prototype.css = function(name, value){
	if(arguments.length == 2){
		for(var i = 0; i < this.elements.length; i ++){
			this.elements[i].style[name] = value;
		}
	}else{
		if(typeof(name) == "string"){
			return getStyle(this.elements[0], name);
		}else{
			for(var i = 0; i < this.elements.length; i ++){
				for(var j in name){
					this.elements[i].style[j] = name[j];
				}
			}
		}
	}
	return this;
};
//用$表示
function $(arg){
	return new ZQuery(arg);
}

function appendToParent(parent, str){
	var oTmp = document.createElement("div");
	oTmp.innerHTML = str;
	
	while(oTmp.childNodes.length){
		parent.appendChild(oTmp.childNodes[0]);
	}
}
//绑定ready事件
function addReady(fn){
	if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", fn, false);
	}else{
		document.attachEvent("onreadystatechange", function(){
			if(document.readyState == "complete"){
				fn();
			}
		})
	}
}
//事件绑定
function addEvent(obj, sEvent, fn){
	if(document.addEventListener){
		obj.addEventListener(sEvent, fn, false);
	}else{
		obj.attachEvent("on" + sEvent, fn);
	}
}
function getStyle(obj, name){
	return (obj.currentStyle || getComputedStyle(obj, false))[name];
}

//通过class选元素
function getByClass(oParent, sClass){
	//取到父级里所有的元素
	var aEle = oParent.getElementsByTagName("*");
	//选出来的结果
	var aResult = [];
	//判断字符串中是否有sClass的正则
	var re = new RegExp('\\b'+sClass+'\\b');
	for(var i = 0; i < aEle.length; i ++){
		if(re.test(aEle[i].className)){
			aResult.push(aEle[i]);
		}
	}
	//返回选择结果
	return aResult;
}
//选择器里的
function getByStr(aParent, str){
	var aChild = [];
	for(var i = 0; i < aParent.length; i ++){
		switch(str.charAt(0)){
			case "#":
				aChild.push(aParent[i].getElementById(str.substring(1)));
				break;
				
			case ".":
				var arr = getByClass(aParent[i], str.substring(1));
				for(var j = 0; j < arr.length; j ++){
					aChild.push(arr[j]);
				}
				break;
				
			default:
				//li#box
				if(/\w+#\w+/g.test(str)){
					var aStr = str.split("#");
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					for(var j = 0; j < arr.length; j ++){
						if(arr[j].id == aStr[1]){
							aChild.push(arr[j]);
						}
					}
				//li.box
				}else if(/\w+\.\w+/g.test(str)){
					//[li, box];
					var aStr = str.split(".");
					//从父级中选出来所有Li
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					//匹配class正则
					var re = new RegExp("\\b" + aStr[1] + "\\b", "g");
					for(var j = 0; j < arr.length; j ++){
						//匹配成功的元素push到aChild数组里
						if(re.test(arr[j].className)){
							aChild.push(arr[j]);
						}
					}
				//li:first	li:last	li:eq(0)	li:has(a);
				}else if(/[a-z]+:[a-z]+(\(\w+\))?/g.test(str)){
					var aStr = str.split(":");
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					//如果aStr[1]是first选出第一个元素
					switch(aStr[1].split('(')[0]){
						case "first":
							aChild.push(arr[0]);
							break;
						
						case "last":
							aChild.push(arr[arr.length - 1]);
							break;
						case "eq":
							var n = parseInt(aStr[1].split('(')[1]);
							aChild.push(arr[n]);
							
						case "has":
							var sEle = aStr[1].split("(")[1].split(")");
							switch(sEle[0].charAt(0)){
								case "#":
									var arr2 = [];
									for(var j = 0; j < arr.length; j ++){
										arr2.push(arr[j]);
									}
									for(var j = 0; j < arr2.length; j ++){
										var arr3 = arr[j].getElementsByTagName("*");
										for(var k = 0; k < arr3.length; k ++){
											if(arr3[k].id == sEle[0].substring(1)){
												aChild.push(arr[j]);
												break;
											}
										}
										
									}
									
								case ".":
									var arr2 = [];
									for(var j = 0; j < arr.length; j ++){
										arr2.push(arr[j]);
									}
									for(var j = 0; j < arr2.length; j ++){
										var arr3 = arr[j].getElementsByTagName("*");
										var re = new RegExp("\\b" + sEle[0].substring(1) + "\\b", "g");
										for(var k = 0; k < arr3.length; k ++){
											if(re.test(arr3[k].className)){
												aChild.push(arr2[j]);
												break;
											}
										}
										
									}
								
								default:
									if(/^[a-z]+$/g.test(sEle[0])){
										var arr2 = [];
										for(var j = 0; j < arr.length; j ++){
											arr2.push(arr[j]);
										}
										for(var j = 0; j < arr2.length; j ++){
											var arr3 = arr[j].getElementsByTagName("*");
											for(var k = 0; k < arr3.length; k ++){
												if(arr3[k].tagName == sEle[0].toUpperCase()){
													aChild.push(arr2[j]);
													break;
												}
											}
											
										}
									}else if(/^[a-z]+\[[a-z]+=\w+\]$/g.test(sEle[0])){
										var arr2 = [];
										var aStr1 = sEle[0].match(/\w+/g);
										alert(aStr1)
										for(var j = 0; j < arr.length; j ++){
											arr2.push(arr[j]);
										}
										for(var j = 0; j < arr2.length; j ++){
											var arr3 = arr[j].getElementsByTagName(aStr[0]);
											for(var k = 0; k < arr3.length; k ++){
												if(arr3[k].getAttribute(aStr[1]) == aStr[2]){
													aChild.push(arr2[j]);
													break;
												}
											}
											
										}
									}
							}
					}
				//input[type=button]
				}else if(/[a-z]+\[[a-z]+=\w+\]/g.test(str)){
					var aStr = str.match(/\w+/g);
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					for(var j = 0; j < arr.length; j ++){
						if(arr[j].getAttribute(aStr[1]) == aStr[2]){
							aChild.push(arr[j]);
						}
					}
				}
				else{
					var arr = document.getElementsByTagName(str);
					for(var j = 0; j < arr.length; j ++){
						aChild.push(arr[j]);
					}
				}
				break;
		}
	}
	return aChild;
}
//选择器函数，
function getEle(str){
	var str = str.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
	var aStr = str.split(" ");
	
	var aParent = [document];
	var aChild = [];
	
	for(var i = 0; i < aStr.length; i ++){
		aChild = getByStr(aParent, aStr[i]);
		aParent = aChild;
	}
	return aChild;
}

Array.prototype.indexOf=function (n)
{
	for(var i=0;i<this.length;i++)
	{
		if(this[i]==n)
		{
			return i;
		}
	}
	
	return -1;
};
