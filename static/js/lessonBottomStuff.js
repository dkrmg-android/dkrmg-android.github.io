$(function () {
    loadIncludes();
    loadFeatherLight();
    pageInit();
});

// include html wherever appropriate
function loadIncludes() {
    $('[data-include]').each(function () {
        var $container = $(this);
        var path = $container.data('include');

        $.get(path, function (data) {
            $container.html(data);
            Prism.highlightElement($container[0]);
        });
    });
}

// add featherlight to images
function loadFeatherLight() {
    var addToAll = true;
    $('img').each(function () {

        var $element = $(this);
        //$element.attr('width', $element.width()).attr('height', $element.height());

        var isZoomable = !$element.hasClass('noZoom');
        if (isZoomable) {
            var src = $element.attr('src');
            $element.attr('data-featherlight', src);
        }

    });
}

// init page and init the helper buttons
function pageInit() {
    $('div.help-container').each(function () {
        var $dialog = $(this);
        var id = $dialog.attr('id');
        var $source = $('button.help-link[data-target="' + id + '"]');

        $source.click(function () {
            $dialog.dialog('open');
        });

        $dialog.dialog({
            autoOpen: false,
            height: 'auto',
            minHeight: 0,
            maxHeight: 600,
            width: 'auto',
            //                    maxWidth: 600, // doesn't work if width: 'auto' is also set :(
            show: 'slideDown',
            hide: 'slideUp',
            //                    modal: true,
            position: { my: "center top", at: "center bottom", of: $source },
            open: function (event, ui) {
                //hide titlebar. src: http://stackoverflow.com/a/25629837/
                $(this).parent().children('.ui-dialog-titlebar').hide();

                // src: http://stackoverflow.com/a/7924361/
                $(document).mouseup(function (e) {
                    var clicked = $(e.target); // get the element clicked
                    if (clicked.is($dialog)
                                    || clicked.parents().is($dialog)
                                    || clicked.is('.ui.dialog-titlebar')) {
                        return; // click happened within the dialog, do nothing here
                    } else { // click was outside the dialog, so close it
                        $dialog.dialog("close");
                    }
                });
            }
        });
    });

    $('button.help-link[data-target]').click(function (event) {
        event.preventDefault();
        var targetId = $(this).data('target');
        var $target = $('#' + targetId);
        $target.dialog('open');
    });
}
