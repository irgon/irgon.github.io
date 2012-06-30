/*jslint browser: true, white: true */
/*properties
    addClass, animate, attr, bind, charCode, click, height, href, is, keyCode,
    keypress, location, marginTop, outerHeight, parent, preventDefault, ready,
    removeClass, resize, siblings, slideDown, step, text, toString, width
*/

var jQuery = typeof(jQuery) === 'undefined' ? null : jQuery;

(function($) {

    "use strict";

    $(document).ready(function() {
        var expanded = false,
            header = $('#header'),
            header_height = header.outerHeight(true),
            footer_height = $('#footer').outerHeight(true),
            menu_height = $('#menu').outerHeight(true),
            fixWindow = function() {
                var window_height = $(window).height();
                $('#wrapper').height(window_height - footer_height);
                $('#content').height(window_height - header.outerHeight(true) - footer_height - menu_height);
                $('#renderedPage').width($('#content').width());
                $('#renderedPage').height($('#content').height());
            };

        $('body').removeClass('no-js');
        $(window).resize(fixWindow);
        fixWindow();

        $(document).keypress(function(e) {
            if(e.keyCode === 0 && e.charCode === 117) {
                e.preventDefault();
                window.location.href = 'https://github.com/irgon/' + $('meta[name="Project"]').attr('content') + '/tree/gh-pages/';
            }
        });

        $('#menu a').click(function(e) {
            e.preventDefault();
            $(this).parent().addClass('selected').siblings().removeClass('selected');
            $('#renderedPage').attr('src', $(this).attr('href'));
        });

        $('#content a.show').bind('click', function(e) {
            e.preventDefault();
            if(expanded) {
                header.slideDown();
                header.animate({
                    marginTop: '+=' + header_height.toString()
                }, {
                    step: function() {
                        fixWindow();
                    }
                });
                $(this).text('Expand');
                expanded = false;
            } else {
                header.animate({
                    marginTop: '-=' + header_height.toString()
                }, {
                    step: function() {
                        fixWindow();
                    }
                });
                $(this).text('Contract');
                expanded = true;
            }
        });

    });

}(jQuery));