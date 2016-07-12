if (typeof ROOTURL == "undefined") {
  ROOTURL = ""; // raw.githubusercontent.com/...
}

editReady = false;

Base64 = { // http://stackoverflow.com/a/26514148/1937233
  _keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},
  decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},
  _utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},
  _utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}
};

Typemint = {
  editor : {
    init : function(){
      // if there isn't a content editable section, this won't do anything.
        if(!editor) {
            Typemint.get.js("assets/js/editor.js");
            editor = true;
        }
    }
  },
  get: {
    js: function(filepath, tm_options, tm_callback) {
        filepath = filepath + FILESUFFIX;
      var options = {};
      if (tm_options !== undefined) {
        options = tm_options;
      }

      var callback = function() {};
      if (tm_callback !== undefined) {
        callback = tm_callback;
      }

      var hREF;
      if (options.hasOwnProperty("remote")) {
        hREF = filepath
      } else {
        hREF = "" + ROOTURL + filepath
      }

      $.getScript(hREF, callback);

    },
    css: function(filepath, tm_options) {
        filepath = filepath + FILESUFFIX;

      var hREF;
      var options = {};
      if (tm_options !== undefined) {
        options = tm_options;
      }

      /*
      options: {
        ie : bool, (optional)
        media: string (optional)
        win8: bool (optional)
      }
      */


      if (options.hasOwnProperty("remote")) {
        hREF = filepath
      } else {
        hREF = "" + ROOTURL + filepath
      }

      // create stylesheet element
      var $styleSheet = $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: hREF
      });

      // check for media hook
      var media = false;
      if (options.hasOwnProperty("media")) {
        $styleSheet.attr("media", options['media'])
      }

      // check for windows8 hook
      if (options.hasOwnProperty("win8")) {
        window.onload = function() { // fix for windows 8
          if (navigator.appVersion.indexOf("Windows NT 6.2") != -1)
          //document.head.innerHTML += '<link rel="stylesheet" type="text/css" href="pages/css/windows.chrome.fix.css" />'
            $styleSheet.appendTo('head');
        }
        return;
      };

      // check for ie hook
      if (options.hasOwnProperty("ie")) {
        console.log("ie");
        console.log($styleSheet);

        var outerHTML;
        if ('outerHTML' in $styleSheet[0]) {
          outerHTML = $styleSheet[0].outerHTML;
        } else {
          // have to create the outerHTML the hard way.
          console.log("trying to create innerHTML");
          var div = $styleSheet[0].cloneNode();
          var div2 = document.createElement("div");

          div.appendChild(div.cloneNode());
          div2.appendChild(div);

          outerHTML = div2.innerHTML;
        }

        console.log("outerHTML:");
        console.log(outerHTML);
        //
        $styleSheet = "<!--[if lte IE 9]>" + outerHTML + "<![endif]-->";
        $styleSheet = $($styleSheet); // because I broke out of jQuery land
      }

      $styleSheet.appendTo('head');
    },
    html: function(filepath) {
        filepath = filepath + FILESUFFIX;

      var fileLocation = "" + ROOTURL + filepath;


      $.get(fileLocation, function(src) {
        // my_var contains whatever that request returned
        Typemint.load(src);
      });
    }
  },
  load: function(src) {

    $('<meta/>', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }).appendTo('head');

    // if it wasn't for the necessity of bootstrap in the head, we could probably do something like:
    // $('body').prependTo($('head').find('script')).prependTo($('head').find('style'))
    // in order to get all of the links, scripts, and styles into the body automatically.
    // but sadly loading the client doesn't work unless bootstrap is defined in the head

    var newContent = document.createElement('span'); // create virtual div
    $(newContent).addClass("tm_insert").html(src).find('#tm_wrapper').html($('body').html()); //

    document.body.innerHTML = $(newContent).html();

    // editor init
    if (editReady) {
      console.log("initializing from loading the html");
      // turn on the editor
      Typemint.editor.init();
    } else {
      editReady = true;
    }
  },
  savePage : function(newHTML, SHA){
    jQuery.ajax({
      url: APIROOT + FILEPATH,
      type: "PUT",
      headers: {
          "Authorization": AUTHTOKEN,
          "Content-Type": "application/json",
      },
      contentType: "application/json",
      data: JSON.stringify({
          "message": "update " + Date.now(),
          "content": Base64.encode(newHTML),
          "sha": SHA
      })
    })
    .done(function(data, textStatus, jqXHR) {
        console.log("HTTP Request Succeeded: " + jqXHR.status);
        console.log(data);
        document.open('text/html');
        document.write(newHTML);
        document.close();
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        console.log("HTTP Request Failed");
    })
    .always(function() {
        /* ... */
    });
  },
  compileChanges : function(regions){
    /// use the current URL to get the source

    $.get(window.location.href , function(src) {

      var srcBodyOuter = src.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0]; // find the body element
      var excludeBodyReg = /\<body[^>]*\>([^]*)\<\/body/m; // exclude opening and closing body tags

      // working with just the body, since that's where the writing happens. the rest should remain intact.
      var $srcBodyInner = $('<div />',{
        html: srcBodyOuter.match( excludeBodyReg )[1]
      });

      // replace the necessary parts inside the body. If a section wasn't changed, it doesn't get overwritten, so in that case the DOM creation is all that effected it.
      for (name in regions) {
        console.log(name);
          if (regions.hasOwnProperty(name)) {
              $($srcBodyInner).find('[data-tm-name='+ name +']').html(regions[name]);
          }
      }

      // console.log("$srcBodyInner:");
      // console.log($srcBodyInner.html());

      // merge the changes into a new html document
      var newHTML = src.replace( src.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0], "<body>" + $srcBodyInner.html() + "</body>"  ); //$(pageContent).html();
      //console.log(newHTML);

      if( ( typeof APIROOT == "undefined" ) || ( typeof FILEPATH == "undefined" ) || ( typeof AUTHTOKEN == "undefined" ) ){
        // these variables aren't set, so can't use Github's API.
        document.open('text/html');
        document.write(newHTML);
        document.close();
      }
      else{
        // upload to GitHub.
        // first get the SHA
        jQuery.ajax({
            url: APIROOT + FILEPATH,
            type: "GET",
        })
        .done(function(data, textStatus, jqXHR) {
            console.log("HTTP Request Succeeded: " + jqXHR.status);
            // console.log(data);
            // great, now save, given the SHA
            Typemint.savePage(newHTML, data.sha);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.log("HTTP Request Failed");
        })
        .always(function() {
            /* ... */
        });
      }

    });
  },
    init : function(){

    // stuff that needs to get re-downloaded each time
        // basically html and css files
        // js files are cached outside of the DOM
        editor = null;
        // HTML
        Typemint.get.html("dashboard_component.html");

        // CSS
        // all typemint themes require bootstrap.css, so no need to load it
        // Custom styles for this template
        //Typemint.get.css("dashboard.css"); codekit imported
        //Content-tools CSS
        //Typemint.get.css("content-tools/content-tools.min.css"); codekit imported

        // last but not least (so that any css overrides are handled)
        //Typemint.get.css("typemint.css"); codekit imported

        if (editReady) {
            console.log("initializing from Typemint.init()");
            // turn on the editor
            Typemint.editor.init();
        }
    }
};

// stuff that only needs to be done once

// JS
// HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries
Typemint.get.js("https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js", {
    remote: true,
    ie: true
});
Typemint.get.js("https://oss.maxcdn.com/respond/1.4.2/respond.min.js", {
    remote: true,
    ie: true
});

// IE10 viewport hack for Surface/desktop Windows 8 bug
Typemint.get.js("assets/js/ie10-viewport-bug-workaround.js");

//Content-tools JS
Typemint.get.js("assets/js/content-tools.min.js", {}, function() {
    if (editReady) {
        console.log("initializing from loading contenttools.js");
        // turn on the editor
        Typemint.editor.init();
    } else {
        editReady = true;
    }
});

Typemint.init();
