"undefined"==typeof ROOTURL&&(ROOTURL=""),editReady=!1,Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="",n,o,i,a,r,d,c,s=0;for(e=Base64._utf8_encode(e);s<e.length;)n=e.charCodeAt(s++),o=e.charCodeAt(s++),i=e.charCodeAt(s++),a=n>>2,r=(3&n)<<4|o>>4,d=(15&o)<<2|i>>6,c=63&i,isNaN(o)?d=c=64:isNaN(i)&&(c=64),t=t+this._keyStr.charAt(a)+this._keyStr.charAt(r)+this._keyStr.charAt(d)+this._keyStr.charAt(c);return t},decode:function(e){var t="",n,o,i,a,r,d,c,s=0;for(e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");s<e.length;)a=this._keyStr.indexOf(e.charAt(s++)),r=this._keyStr.indexOf(e.charAt(s++)),d=this._keyStr.indexOf(e.charAt(s++)),c=this._keyStr.indexOf(e.charAt(s++)),n=a<<2|r>>4,o=(15&r)<<4|d>>2,i=(3&d)<<6|c,t+=String.fromCharCode(n),64!=d&&(t+=String.fromCharCode(o)),64!=c&&(t+=String.fromCharCode(i));return t=Base64._utf8_decode(t)},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");for(var t="",n=0;n<e.length;n++){var o=e.charCodeAt(n);128>o?t+=String.fromCharCode(o):o>127&&2048>o?(t+=String.fromCharCode(o>>6|192),t+=String.fromCharCode(63&o|128)):(t+=String.fromCharCode(o>>12|224),t+=String.fromCharCode(o>>6&63|128),t+=String.fromCharCode(63&o|128))}return t},_utf8_decode:function(e){for(var t="",n=0,o=c1=c2=0;n<e.length;)o=e.charCodeAt(n),128>o?(t+=String.fromCharCode(o),n++):o>191&&224>o?(c2=e.charCodeAt(n+1),t+=String.fromCharCode((31&o)<<6|63&c2),n+=2):(c2=e.charCodeAt(n+1),c3=e.charCodeAt(n+2),t+=String.fromCharCode((15&o)<<12|(63&c2)<<6|63&c3),n+=3);return t}},Typemint={editor:{init:function(){editor||(Typemint.get.js("assets/js/editor.js"),editor=!0)}},get:{js:function(e,t,n){e+=FILESUFFIX;var o={};void 0!==t&&(o=t);var i=function(){};void 0!==n&&(i=n);var a;a=o.hasOwnProperty("remote")?e:""+ROOTURL+e,$.getScript(a,i)},css:function(e,t){e+=FILESUFFIX;var n,o={};void 0!==t&&(o=t),n=o.hasOwnProperty("remote")?e:""+ROOTURL+e;var i=$("<link/>",{rel:"stylesheet",type:"text/css",href:n}),a=!1;if(o.hasOwnProperty("media")&&i.attr("media",o.media),o.hasOwnProperty("win8"))return void(window.onload=function(){-1!=navigator.appVersion.indexOf("Windows NT 6.2")&&i.appendTo("head")});if(o.hasOwnProperty("ie")){console.log("ie"),console.log(i);var r;if("outerHTML"in i[0])r=i[0].outerHTML;else{console.log("trying to create innerHTML");var d=i[0].cloneNode(),c=document.createElement("div");d.appendChild(d.cloneNode()),c.appendChild(d),r=c.innerHTML}console.log("outerHTML:"),console.log(r),i="<!--[if lte IE 9]>"+r+"<![endif]-->",i=$(i)}i.appendTo("head")},html:function(e){e+=FILESUFFIX;var t=""+ROOTURL+e;$.get(t,function(e){Typemint.load(e)})}},newPostPage:function(){var e=new Date(Date.now()),t=""+(e.getMonth()+1),n=""+e.getDate(),o=e.getFullYear();t.length<2&&(t="0"+t),n.length<2&&(n="0"+n);var i=[o,t,n].join("-");$.get(APIROOT+"theme/post.html",function(e){var t=i+"-"+Date.now()+".html";jQuery.ajax({url:APIROOT+"posts/"+t,type:"PUT",headers:{Authorization:AUTHTOKEN,"Content-Type":"application/json"},contentType:"application/json",data:JSON.stringify({message:"new post "+Date.now(),content:e.content})}).done(function(e,n,o){function i(){r++,jQuery.ajax({url:t+"?v="+r,type:"GET"}).done(function(e,n,o){console.log("HTTP Request Succeeded: "+o.status),console.log(e),clearInterval(a),window.location.href=t}).fail(function(e,t,n){console.log("HTTP Request"+r+"Failed")}).always(function(){})}console.log("HTTP Request Succeeded: "+o.status),console.log(e);var a=setInterval(i,2e3),r=0}).fail(function(e,t,n){console.log("HTTP Request Failed")}).always(function(){})})},load:function(e){$("<meta/>",{name:"viewport",content:"width=device-width, initial-scale=1"}).appendTo("head");var t=document.createElement("span");$(t).addClass("tm_insert").html(e).find("#tm_wrapper").html($("body").html()),document.body.innerHTML=$(t).html(),editReady?(console.log("initializing from loading the html"),Typemint.editor.init()):editReady=!0},savePage:function(e,t){jQuery.ajax({url:APIROOT+FILEPATH,type:"PUT",headers:{Authorization:AUTHTOKEN,"Content-Type":"application/json"},contentType:"application/json",data:JSON.stringify({message:"update "+Date.now(),content:Base64.encode(e),sha:t})}).done(function(t,n,o){console.log("HTTP Request Succeeded: "+o.status),console.log(t),document.open("text/html"),document.write(e),document.close()}).fail(function(e,t,n){console.log("HTTP Request Failed")}).always(function(){})},compileChanges:function(e){$.get(window.location.href,function(t){var n=t.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0],o=/\<body[^>]*\>([^]*)\<\/body/m,i=$("<div />",{html:n.match(o)[1]});for(name in e)console.log(name),e.hasOwnProperty(name)&&$(i).find("[data-tm-name="+name+"]").html(e[name]);var a=t.replace(t.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0],"<body>"+i.html()+"</body>");"undefined"==typeof APIROOT||"undefined"==typeof FILEPATH||"undefined"==typeof AUTHTOKEN?(document.open("text/html"),document.write(a),document.close()):jQuery.ajax({url:APIROOT+FILEPATH,type:"GET"}).done(function(e,t,n){console.log("HTTP Request Succeeded: "+n.status),Typemint.savePage(a,e.sha)}).fail(function(e,t,n){console.log("HTTP Request Failed")}).always(function(){})})},init:function(){editor=null,Typemint.get.html("dashboard_component.html"),editReady&&(console.log("initializing from Typemint.init()"),Typemint.editor.init())}},Typemint.get.js("https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js",{remote:!0,ie:!0}),Typemint.get.js("https://oss.maxcdn.com/respond/1.4.2/respond.min.js",{remote:!0,ie:!0}),Typemint.get.js("assets/js/ie10-viewport-bug-workaround.js"),Typemint.get.js("assets/js/content-tools.min.js",{},function(){editReady?(console.log("initializing from loading contenttools.js"),Typemint.editor.init()):editReady=!0}),Typemint.init();