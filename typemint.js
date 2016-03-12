if (typeof ROOTURL == "undefined") {
  ROOTURL = ""; // raw.githubusercontent.com/...
}

Typemint = {
  get: {
    js: function(filepath) {
      return $.getScript("" + ROOTURL + filepath);
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

          div.appendChild( div.cloneNode() );
          div2.appendChild( div );

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

  }
};

// HTML
Typemint.get.html("dashboard_component.html");

// CSS
// all typemint themes require bootstrap.css, so no need to load it
// Custom styles for this template
Typemint.get.css("dashboard.css");
Typemint.get.css("typemint.css");
// HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries
Typemint.get.css("https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js", {
  remote: true,
  ie: true
});
Typemint.get.css("https://oss.maxcdn.com/respond/1.4.2/respond.min.js", {
  remote: true,
  ie: true
});

// JS
// jquery and bootstrap should already exist. so no need to load.
// IE10 viewport hack for Surface/desktop Windows 8 bug
Typemint.get.js("assets/js/ie10-viewport-bug-workaround.js");
