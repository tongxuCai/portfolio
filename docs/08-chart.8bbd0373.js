parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Fe5A":[function(require,module,exports) {
!function(){var t=d3.select("#chart8").select("svg").attr("height",100).attr("width",500).select("g").attr("transform","translate(50, 0)"),a=d3.scalePoint().domain(["Panda","Cat","Horse","Pig"]).range([0,400]),e=d3.scaleSqrt().domain([0,860]).range([0,43]);t.selectAll("circle").data([{name:"Panda",weight:150},{name:"Cat",weight:8},{name:"Horse",weight:840},{name:"Pig",weight:100}]).attr("cy",50).attr("cx",function(t){return a(t.name)}).attr("r",function(t){return e(t.weight)})}();
},{}]},{},["Fe5A"], null)
//# sourceMappingURL=08-chart.8bbd0373.js.map