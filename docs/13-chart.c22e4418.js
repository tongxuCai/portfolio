parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"dShc":[function(require,module,exports) {
module.exports="eating-data.e3bc2f1f.csv";
},{}],"tZZR":[function(require,module,exports) {
!function(){var a=50,t=75,e=75,n=50,r=400-n-t,i=500-a-e,d=d3.select("#chart13").append("svg").attr("width",r+n+t).attr("height",i+a+e).append("g").attr("transform","translate("+n+","+a+")"),c=d3.scaleBand().range([0,500]),l=(c=d3.scaleBand().domain(["Stevie","Nicholas","Bubbletree","Particle","Jumpup","Parlay","Hio"]).range([0,350]).paddingInner(.01),d3.scaleLinear().domain([0,10]).range([0,300])),s=d3.scaleLinear().domain([0,10]).range([0,r]),o=d3.scaleOrdinal().domain(["cat","dog","cow"]).range(["orange","green","purple"]);d3.csv(require("../../data/eating-data.csv")).then(function(a){d.selectAll("rect").data(a).enter().append("rect").attr("fill",function(a){return o(a.animal)}).attr("width",function(a){return l(a.hamburgers)}).attr("height",c.bandwidth()).attr("y",function(a){return c(a.name)}).attr("opacity",.75);var t=d3.axisLeft(c);d.append("g").attr("class","axis y-axis").call(t);var e=d3.axisBottom(s);d.append("g").attr("class","axis x-axis").attr("transform","translate(0,350)").call(e)}).catch(function(a){console.log("Failed with",a)})}();
},{"../../data/eating-data.csv":"dShc"}]},{},["tZZR"], null)
//# sourceMappingURL=13-chart.c22e4418.js.map