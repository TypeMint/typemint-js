//var editor;

globalRegions = "";

editor = ContentTools.EditorApp.get();
editor.init('*[data-tm-editable]', 'data-tm-name');

// for saving, make sure you're using tm-name instead of name as the data attribute
editor.bind('save', function (regions) {
    var name, payload, xhr;

    // Set the editor as busy while we save our changes
    this.busy(true);

    // Collect the contents of each region into a FormData instance
    payload = {};
    // payload = new FormData();
    console.log(regions);

    globalRegions = regions;
    /*
    for (name in regions) {
      console.log(name);
        if (regions.hasOwnProperty(name)) {

            // payload.append( name, regions[name] );
            // var obj = { name: regions[name] };
            // payload.push(obj)
            payload[name] = regions[name];
        }
    }
    */

    // Send the update content to the server to be saved
    function onStateChange(ev) {
        // Check if the request is finished
        if (ev.target.readyState == 4) {
            editor.busy(false);
            if (ev.target.status == '200') {
                // Save was successful, notify the user with a flash
                new ContentTools.FlashUI('ok');
            } else {
                // Save failed, notify the user with a flash
                new ContentTools.FlashUI('no');
            }
        }
    };

    console.log(payload);

    onStateChange({
      target : {
        readyState : 4,
        status : '200'
      }
    })

    Typemint.compileChanges(regions);

    // var match = $('[data-tm-name="heading"]').html() == regions.heading;
    // console.log(match); // returns true yay

    /*
    xhr = new XMLHttpRequest();
    xhr.addEventListener('readystatechange', onStateChange);
    xhr.open('POST', '/save-my-page');
    xhr.send(payload);
    */
});
