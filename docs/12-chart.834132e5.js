parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"StRu":[function(require,module,exports) {
!function(){var t=50,a=50,r=50,n=50,e=400-n-a,c=200-t-r,i=d3.select("#chart12").append("svg").attr("width",e+n+a).attr("height",c+t+r).append("g").attr("transform","translate("+n+","+t+")"),l=d3.scaleLinear().domain([0,10]).range([0,280]),o=d3.scaleOrdinal().domain(["cat","dog","cow"]).range(["orange","green","purple"]),d=d3.scaleSqrt().domain([0,10]).range([0,50]);d3.csv("eating-data.csv").then(function(t){i.selectAll("circle").data(t).enter().append("circle").attr("cx",function(t){return l(t.hamburgers)}).attr("r",15).attr("cy",25).attr("fill",function(t){return o(t.animal)}).attr("r",function(t){return d(t.hotdogs)}).attr("opacity",.25);var a=d3.axisBottom(l);i.append("g").attr("class","axis x-axis").attr("transform","translate(0,"+c+")").call(a)}).catch(function(t){console.log("Failed with",t)})}();
},{}]},{},["StRu"], null)
//# sourceMappingURL=12-chart.834132e5.js.map