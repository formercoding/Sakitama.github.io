window.onload = function () {
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight,
        clientWidth = document.documentElement.clientWidth || document.body.clientWidth,
        div = document.getElementById("images"),
        ul = document.getElementById("photo"),
        ulArrLi= ul.getElementsByTagName("img"),
        current = 0,
        mark = document.getElementById("mark"),
        list = document.getElementById("list"),
        arrLi = list.getElementsByTagName("li");
    div.style.width = clientWidth + "px";
    div.style.height = clientHeight + "px";
    for (var i = 0, len = ulArrLi.length; i < len; i++) {
        ulArrLi[i].style.width = clientWidth + "px";
        ulArrLi[i].style.height = clientHeight + "px";
    }
    ul.onmousewheel = scrollImages;
    if (ul.addEventListener) {//只有FF才支持的鼠标滚动事件
        ul.addEventListener("DOMMouseScroll", scrollImages, false);
    }
    function scrollImages(ev) {
        var x = ev || event;
        if (x.wheelDelta) {//IE和Chrome
            if (x.wheelDelta > 0) {//值大于0表示向上滚动
                current--;
                if (current < 0) {
                    current = 0;
                }
                startMoveTimeVersion(mark, {
                    top: current * 40
                }, 300, "Expo", "easeOut");
                startMoveTimeVersion(ul, {
                    top: current * (-clientHeight)
                }, 300, "Expo", "easeOut");
            } else {//值小于0表示向下滚动
                current++;
                if (current > len - 1) {
                    current = len - 1;
                }
                startMoveTimeVersion(mark, {
                    top: current * 40
                }, 300, "Expo", "easeOut");
                startMoveTimeVersion(ul, {
                    top: current * (-clientHeight)
                }, 300, "Expo", "easeOut");
            }
        } else {//FF
            if (x.detail < 0) {//值小于0表示向上滚动
                current--;
                if (current < 0) {
                    current = 0;
                }
                startMoveTimeVersion(mark, {
                    top: current * 40
                }, 300, "Expo", "easeOut");
                startMoveTimeVersion(ul, {
                    top: current * (-clientHeight)
                }, 300, "Expo", "easeOut");
            } else {//值大于0表示向下滚动
                current++;
                if (current > len - 1) {
                    current = len - 1;
                }
                startMoveTimeVersion(mark, {
                    top: current * 40
                }, 300, "Expo", "easeOut");
                startMoveTimeVersion(ul, {
                    top: current * (-clientHeight)
                }, 300, "Expo", "easeOut");
            }
        }
    }
    window.onresize = function () {
        clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
        div.style.width = clientWidth + "px";
        div.style.height = clientHeight + "px";
        for (var i = 0, len = ulArrLi.length; i < len; i++) {
            ulArrLi[i].style.width = clientWidth + "px";
            ulArrLi[i].style.height = clientHeight + "px";
        }
        //如果运动完之后再次改变了窗口的大小，那么图像大小也跟着改变，从而导致显示出多余的图像，加上这句表示改变浏览器窗口大小过程中一直停留在当前这张
        startMoveTimeVersion(ul, {
            top: current * (-clientHeight)
        }, 100, "Expo", "easeOut");
    };
    for (var j = 1, newLen = arrLi.length; j < newLen; j++) {
        (function (k) {
            arrLi[k].onclick = function () {
                startMoveTimeVersion(mark, {
                    top: (k - 1) * 40
                }, 300, "Expo", "easeOut");
                current = k - 1;
                startMoveTimeVersion(ul, {
                    top: (k - 1) * (-clientHeight)
                }, 300, "Expo", "easeOut");
            };
        })(j);
    }
    function startMoveTimeVersion(obj, json, duringTime, type, sonType, callBack) {
        var iCur = {},
            result,
            t,
            startTime = getCurrentTime(),
            finishTime;
        function css(obj, attribute) {
            if (obj.currentStyle) {//只有IE支持currentStyle，先判断是否是IE浏览器。IE8及以下不认opacity，IE9及以上、FF和Chrome可以使用opacity。filter: alpha(opacity=30)属性IE10及以上、FF和Chrome都不认识。IE9及以下支持
                return obj.currentStyle[attribute];//是IE浏览器则返回当前元素的对应属性的值
            } else {
                return getComputedStyle(obj, false)[attribute];//IE9及以上或者非IE浏览器例如FF和Chrome支持getComputedStyle
            }
        }
        function getCurrentTime() {
            return (new Date()).getTime();
        }
        for (var attribute in json) {
            if (json.hasOwnProperty(attribute)) {
                if (attribute == "opacity") {
                    iCur[attribute] = Math.round(css(obj, attribute) * 100);//Chrome低版本取不到准确的0.3，于是需要四舍五入
                } else {
                    iCur[attribute] = parseInt(css(obj, attribute));//其他属性提取出来会有px，去掉px，只取出数值
                }
            }
        }
        clearInterval(obj.timer);
        obj.timer = setInterval(function () {
            finishTime = getCurrentTime();
            t = duringTime - Math.max(0, (startTime - finishTime) + duringTime);
            for (var attr in json) {
                if (json.hasOwnProperty(attr)) {
                    if (attr == "opacity") {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] * 100 - iCur[attr], duringTime);
                        obj.style.opacity = result / 100;
                        obj.style.filter = "alpha(opacity=" + result + ")";
                    } else {
                        result = Tween[type][sonType](t, iCur[attr], json[attr] - iCur[attr], duringTime);
                        obj.style[attr] = result + "px";
                    }
                }
            }
            if (t == duringTime) {
                clearInterval(obj.timer);
                callBack && callBack.call(obj);
            }
        }, 1);
        var Tween = {
            Linear: {
                easeIn: function(t,b,c,d){
                    return c*t/d + b;
                }
            },
            Quad: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                }
            },
            Cubic: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                }
            },
            Quart: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                }
            },
            Quint: {
                easeIn: function(t,b,c,d){
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOut: function(t,b,c,d){
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                }
            },
            Sine: {
                easeIn: function(t,b,c,d){
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOut: function(t,b,c,d){
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                }
            },
            Expo: {
                easeIn: function(t,b,c,d){
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOut: function(t,b,c,d){
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOut: function(t,b,c,d){
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                }
            },
            Circ: {
                easeIn: function(t,b,c,d){
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOut: function(t,b,c,d){
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOut: function(t,b,c,d){
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                }
            },
            Elastic: {
                easeIn: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
                },
                easeInOut: function(t,b,c,d,a,p){
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (!a || a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                }
            },
            Back: {
                easeIn: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOut: function(t,b,c,d,s){
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                }
            },
            Bounce: {
                easeIn: function(t,b,c,d){
                    return c - Tween.Bounce.easeOut(d-t, 0, c, d) + b;
                },
                easeOut: function(t,b,c,d){
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                easeInOut: function(t,b,c,d){
                    if (t < d/2) return Tween.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
                    else return Tween.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            }
        };
    }
};
