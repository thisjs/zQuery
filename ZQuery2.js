// JavaScript Document
function getEle(str){
	var aParent = [document];
	var aChild = [];
	
	//去除多余空格(注意字符串本身不能操作，只能重新赋值)
	str = str.replace(/^\s+|\s+$/g, "").replace(/^\s+/g, " ");
	var aStr = str.split(" ");
	
	//循环字符串数组中的每一条元素
	for(var i = 0; i < aStr.length; i ++){
		aChild = getByStr(aParent, aStr[i]);
		//上一次的子集是下一次的父级
		aParent = aChild;
	}
	return aChild;
}
function getByClass(obj, sClass){
	var aChild = [];
	var aEle = obj.getElementsByTagName("*");
	var re = new RegExp("\\b" + sClass + "\\b", "g")
	for(var i = 0; i < aEle.length; i ++){
		if(re.test(aEle[i].className)){
			aChild.push(aEle[i]);
		}
	}
	return aChild;
}
function getByStr(aParent, str){
	var aChild = [];
	//把父级元素循环一遍
	for(var i = 0; i < aParent.length; i ++){
		//根据字符串的第一个字符判断选择器类型
		switch(str.charAt(0)){
			//#div1
			case "#":
				aChild.push(aParent[i].getElementById(str.substring(1)));
				break;
			
			//.active
			case ".":
				var arr = getByClass(aParent[i], str.substring(1));
				for(var j = 0; j < arr.length; j ++){
					aChild.push(arr[j]);
				}
				break;
			
			default:
				if(/^\w+#\w+$/g.test(str)){
					var aStr = str.split("#");
					var arr = aParent[i].getElementsByTagName(aStr[0]);
					
					for(var j = 0; j < arr.length; j ++){
						if(arr[j].id == aStr[1]){
							aChild.push(arr[j]);
						}
					}
					
				}else if(/^\w+\.\w+$/g.test(str)){
					var aStr = str.split(".");
					var arr = getByClass(aParent[i], aStr[1]);
					
					for(var j = 0; j < arr.length; j ++){
						aChild.push(arr[j]);
					}
				}else if(/^\w+:\w+$/g.test(str)){
					var aStr = str.split(":");
					var arr = aParent[i].getElementsByTagName(aStr[0])
					switch(aStr[1]){
						case "first":
							aChild.push(arr[0]);
							break;
							
						case "last":
							aChild.push(arr[arr.length - 1]);
							break;
							
						case "eq":
							var aStr2 = aStr[1].split("(");
							aChild.push(arr[aStr2[1].substring(1, 1)]);
							break;
					}
				}
				else{
					var arr = aParent[i].getElementsByTagName(str);
					for(var j = 0; j < arr.length; j ++){
						aChild.push(arr[j]);
					}
				}
				break;
		}
	}
	return aChild;
}
