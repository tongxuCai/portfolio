parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"khVJ":[function(require,module,exports) {
!function(){var a=d3.select("#chart4").select("svg").attr("height",450).attr("width",450).append("g").attr("transform","translate(25, 25)"),e=d3.scaleLinear().domain([0,11]).range([0,400]),r=d3.scaleLinear().domain([0,11]).range([0,400]);a.selectAll("circle").data([{hotdogs:10,hamburgers:10,animal:"dog",name:"Stevie"},{hotdogs:3,hamburgers:3,animal:"cat",name:"Nicholas"},{hotdogs:2,hamburgers:2,animal:"cat",name:"Bubbletree"},{hotdogs:10,hamburgers:3,animal:"cow",name:"Particle"},{hotdogs:7,hamburgers:5,animal:"dog",name:"Jumpup"},{hotdogs:4,hamburgers:9,animal:"dog",name:"Parlay"},{hotdogs:3,hamburgers:1,animal:"cat",name:"Hio"}]).enter().append("circle").attr("fill","pink").attr("r",10).attr("cx",function(a){return console.log(a.hamburgers),e(a.hamburgers)}).attr("cy",function(a){return console.log(a.hotdogs),400-r(a.hotdogs)})}();
},{}]},{},["khVJ"], null)
//# sourceMappingURL=04-chart.bc835285.js.map