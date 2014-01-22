/**
 * Created by dqc on 14-1-3.
 */
(function(window){
    //获取元素样式
    function getStyle(obj, name){
        return (obj.currentStyle || getComputedStyle(obj, false))[name];
    }

//事件绑定
    function addEvent(obj, sEvent, fn){
        if(obj.addEventListener){
            obj.addEventListener(sEvent, fn, false);
        }else{
            obj.attachEvent('on' + sEvent, fn);
        }
    }

//ready事件
    function addReady(fn){
        if(document.addEventListener){
            document.addEventListener('DOMContentLoaded', fn, false);
        }else{
            document.attachEvent('onreadystatechange', function(){
                if(document.readyState == 'complete'){
                    fn && fn();
                }
            })
        }
    }

//通过class获取元素
    function getByClass(oParent, sClass){
        //选出父级下所有子集
        var aEle = oParent.getElementsByTagName('*');
        //正则用于匹配class属性值
        var re = new RegExp('\\b' + sClass + '\\b');
        //返回值
        var aResult = [];

        for(var i = 0; i < aEle.length; i ++){
            if(re.test(aEle[i].className)){
                aResult.push(aEle[i]);
            }
        }
        return aResult;
    }

//选择器主要函数(从一组父级元素中选择出一组子级元素)
    function getByStr(aParent, str){
        var aChild = [];
        function moreSelector(){
            switch (aStr[1].split('(')[0]){
                case 'first':
                    aChild.push(arr[0]);
                    break;

                case 'last':
                    aChild.push(arr[arr.length - 1]);
                    break;

                case 'eq':
                    aChild.push(arr[str.split('(')[1].split(')')[0]]);
                    break;
            }
        }
        for(var i = 0; i < aParent.length; i ++){
            switch(str.charAt(0)){
                //ID
                case '#':
                    var obj = aParent[i].getElementById(str.substring(1));
                    aChild.push(obj);
                    break;
                //class
                case '.':
                    if(/^[a-z]\w+$/.test(str.substring(1))){
                        var arr = getByClass(aParent[i], str.substring(1));
                        for(var j = 0; j < arr.length; j ++){
                            aChild.push(arr[j]);
                        }
                    }else if(/^[a-z]\w+:[a-z]+(\([\w+]\))?$/g.test(str.substring(1))){
                        var aStr = str.split(':');
                        var arr = getByStr([aParent[i]], aStr[0]);
                        moreSelector();
                    }
                    break;
                default:
                    //'li'   'li.box'   'li#li1'   'li:first'
                    if(/^\w+$/g.test(str)){
                        var aEle = aParent[i].getElementsByTagName(str);
                        for(var j = 0; j < aEle.length; j ++){
                            aChild.push(aEle[j]);
                        }
                        //li.box
                    }else if(/^\w+\.\w+$/g.test(str)){
                        var aStr = str.split('.');
                        var aEle = aParent[i].getElementsByTagName(aStr[0]);
                        var re = new RegExp('\\b' + aStr[1] + '\\b');
                        for(var j = 0; j < aEle.length; j ++){
                            if(re.test(aEle[i].className)){
                                aChild.push(aEle[i]);
                            }
                        }
                        //li#li1
                    }else if(/^\w+#\w+$/g.test(str)){
                        var aStr = str.split('#');
                        var aEle = aParent[i].getElementsByTagName(aStr[0]);
                        for(var j = 0; j < aEle.length; j ++){
                            if(aEle[j].id == aStr[1]){
                                aChild.push(aEle[j]);
                            }
                        }
                        //li:first
                    }else if(/^[a-z]\w+:[a-z]+(\([\w+]\))?$/g.test(str)){
                        var aStr = str.split(':');
                        var arr = getByStr([aParent[i]], aStr[0]);
                        moreSelector();
                        //input[type='text']
                    }else if(/^[a-z]\w+\[[a-z]\w+=\w\]$/g){
                        var aStr = str.match(/\w+/g);
                        var arr = getByStr([aParent[i]], aStr[0]);
                        for(var j = 0; j < arr.length; j ++){
                            if(arr[j].getAttribute(aStr[1]) == aStr[2]){
                                aChild.push(arr[j]);
                            }
                        }
                    }
            }
        }
        return aChild;
    }

//选择器选择函数
    function getEle(str, aParent){
        //待返回结果数组
        var aChild = [];
        //判断aParent有无参数传入
        aParent = aParent || [document];
        //选择器字符串统一空格
        str = str.replace(/^\s+|\s+$/g, '').replace(/\s+/, ' ');
        //拆分字符串为数组
        var aStr = str.split(' ');
        //上一次循环的子集为下一次循环的父级
        for(var i = 0; i < aStr.length; i ++){
            aChild = getByStr(aParent, aStr[i]);
            aParent = aChild;
        }
        return aChild;
    }

//zQuery构造函数
    function zQuery(arg){
        var obj = this;
        if(obj==window)
        {
            return zQuery;
        }
        obj.elements = [];

        switch (typeof(arg)){
            case 'function':
                addReady(arg);
                break;

            case 'string':
                if(arg.indexOf('<') == -1){
                    this.elements = getEle(arg);
                }
                break;

            case 'object':
                if(arg.length){
                    for(var i = 0; i < arg.length; i ++){
                        obj.elements.push(arg[i]);
                    }
                }else{
                    obj.elements.push(arg);
                }
        }
    }

    //get——返回原生对象
    zQuery.prototype.get = function(n){
        return this.elements[n];
    };

    //eq——返回zQuery对象
    zQuery.prototype.eq = function(n){
        return $(this.elements[n]);
    };

    //index——返回目标元素索引值
    zQuery.prototype.index = function(arg){
        //alert(this.elements);
        if(this.elements[0]){
            var obj = this.elements[0];
            var aSiblings = obj.parentNode.children;
            if(arg){
                //判断参数类型
                switch (typeof (arg)){
                    //对象:DOM对象、zQuery对象
                    case 'object':
                        //alert(arg instanceof zQuery);
                        if(arg instanceof zQuery){
                            var subObj = arg.get(0);
                        }else{
                            var subObj = arg;
                        }
                        aSiblings = subObj.parentNode.children;
                        for(var j = 0; j < aSiblings.length; j ++){
                            if(aSiblings[j] == subObj){
                                return j;
                            }
                        }
                        break;
                    //字符串
                    case 'string':
                        //alert(this.elements)
                        var subObj = $(arg);
                        //alert(subObj.elements[0]);
                        aSiblings = subObj.elements[0].parentNode.children;
                        var aSubEle = [];
                        for(var j = 0; j < aSiblings.length; j ++){
                            //alert(this.elements[j])
                            if(aSiblings[j].tagName == subObj.elements[0].tagName){
                                aSubEle.push(aSiblings[j]);
                            }
                        }
                        for(var j = 0; j < aSubEle.length; j ++){
                            if(this.elements[0] == aSubEle[j]){
                                return j;
                            }
                        }
                        return -1;
                }
            }else{
                for(var j = 0; j < aSiblings.length; j ++){
                    if(aSiblings[j] == obj){
                        return j;
                    }
                }
            }
        }else{
            return -1;
        }

    };

    //html——返回zQuery对象的innerHTML
    zQuery.prototype.html = function(arg){
        if(arg){
            switch (typeof (arg)){
                case 'string':
                    $(this.elements).each(function(i, ele){
                        ele.innerHTML = arg
                    });
                    break;

                case 'function':
                    this.elements[0].innerHTML = arg($(this.elements).index());
            }

        }else{
            return this.elements[0].innerHTML;
        }
    };

    zQuery.prototype.each = function(fn){
        for(var j in this.elements){
            fn.call(this.elements[j], j, this.elements[j]);
        }
    };

    //attr——设置、读取属性值
    zQuery.prototype.attr = function(name, value){
        if(typeof(name) == 'object'){
            $(this.elements).each(function(index, ele){
                for(var j in name){
                    ele.setAttribute(j, name[j]);
                }
            });
        }
    };

    //css——设置、读取样式
    zQuery.prototype.css = function(name, value){
        if(arguments.length == 2){
            for(var i = 0; i < this.elements.length; i ++){
                this.elements[i].style[name] = value;
            }
        }else{
            if(typeof(name) == 'string'){
                var sResult = getStyle(this.elements[0], name);
                if(sResult.indexOf('px') != -1){
                    return parseInt(sResult);
                }else{
                    return sResult;
                }
            }else{
                for(var i = 0; i < this.elements.length; i++){
                    for(var j in name){
                        this.elements[i].style[j] = name[j];
                    }
                }
            }
        }
    };

    //全局化$
    window.$ = function(arg){
        return new zQuery(arg);
    };
})(window);




