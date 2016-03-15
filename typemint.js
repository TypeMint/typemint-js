if (typeof ROOTURL == "undefined") {
  ROOTURL = ""; // raw.githubusercontent.com/...
}

editReady = false;

Typemint = {
  editor : {
    init : function(){
      // if there isn't a content editable section, this won't do anything.
      Typemint.get.js("content-tools/editor.js");
    }
  },
  get: {
    js: function(filepath, tm_options, tm_callback) {
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
  compileChanges : function(regions){
    /// use the current URL to get the source

    $.get(window.location.href , function(src) {
      // my_var contains whatever that request returned
      // var $src = src;

      var pageContent =  $('<typemint />',{html:src}); //document.createElement('typemint'); // create virtual div
      //$(pageContent).html(src); // put the src into this virtual div so that you can modify the src vitually

      // replace the necessary parts
      for (name in regions) {
        console.log(name);
          if (regions.hasOwnProperty(name)) {
              $(pageContent).find('[data-tm-name='+ name +']').html(regions[name]);
          }
      }

      // for now I'm just replacing the page with the new content,
      // later I'll send this to the API to update the repo and make the changes permanent

      document.write($(pageContent).html());
      document.close();

    });
  }
};



// HTML
Typemint.get.html("dashboard_component.html");

// CSS
// all typemint themes require bootstrap.css, so no need to load it
// Custom styles for this template
Typemint.get.css("dashboard.css");

// HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries
Typemint.get.js("https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js", {
  remote: true,
  ie: true
});
Typemint.get.js("https://oss.maxcdn.com/respond/1.4.2/respond.min.js", {
  remote: true,
  ie: true
});

// JS
// jquery and bootstrap should already exist. so no need to load.
// IE10 viewport hack for Surface/desktop Windows 8 bug
Typemint.get.js("assets/js/ie10-viewport-bug-workaround.js");


// Content-tools
//Content-tools CSS
Typemint.get.css("content-tools/content-tools.min.css");
//Content-tools JS
Typemint.get.js("content-tools/content-tools.min.js", {}, function() {
  if (editReady) {
    console.log("initializing from loading contenttools.js");
    // turn on the editor
    Typemint.editor.init();
  } else {
    editReady = true;
  }
});


// last but not least (so that any css overrides are handled)
Typemint.get.css("typemint.css");
