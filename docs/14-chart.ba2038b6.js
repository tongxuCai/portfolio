parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"dShc":[function(require,module,exports) {
module.exports="data/eating-data.csv";
},{}],"kB3V":[function(require,module,exports) {
!function(){var a=50,t=50,r=50,e=50,n=500-e-t,i=400-a-r,c=d3.select("#chart14").append("svg").attr("width",n+e+t).attr("height",i+a+r).append("g").attr("transform","translate("+e+","+a+")"),l=d3.scaleLinear().domain([0,10]).range([0,i]),d=d3.scaleOrdinal().domain(["dog","cat","cow"]).range(["green","purple","orange"]),s=d3.scaleBand().domain(["Hio","Parlay","Jumpup","Particle","Bubbletree","Nicholas","Stevie"]).range([0,n]);d3.csv(require("../../data/eating-data.csv")).then(function(a){c.selectAll("rect").data(a).enter().append("rect").attr("width",s.bandwidth()).attr("x",function(a){return s(a.name)}).attr("height",function(a){return l(a.hamburgers)}).attr("y",function(a){return i-l(a.hamburgers)}).attr("opacity",.55).attr("fill",function(a){return d(a.animal)});var t=d3.axisLeft(l);c.append("g").attr("class","axis y-axis").call(t);var r=d3.axisBottom(s);c.append("g").attr("class","axis x-axis").attr("transform","translate(0,"+i+")").call(r)}).catch(function(a){console.log("Failed with",a)})}();
},{"../../data/eating-data.csv":"dShc"}]},{},["kB3V"], null)
//# sourceMappingURL=14-chart.ba2038b6.js.map