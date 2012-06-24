(function($) {

    $(document).ready(function() {
        var expanded = false,
            header = $('#header'),
            header_height = header.outerHeight(true),
            footer_height = $('#footer').outerHeight(true),
            menu_height = $('#menu').outerHeight(true),
            fixWindow = function() {
                var window_height = $(this).height();
                $('#wrapper').height(window_height - footer_height)
                $('#content').height(window_height - header.outerHeight(true) - footer_height - menu_height);
                $('#renderedPage').width($('#content').width());
                $('#renderedPage').height($('#content').height());
            }

        $(window).resize(fixWindow);
        fixWindow();

        $(document).keypress(function(e) {
            if(e.keyCode === 0 && e.charCode === 117) {
                e.preventDefault();
                window.location.href = 'https://github.com/irgon/' + $('meta[name="Project"]').attr('content') + '/tree/gh-pages/';
            }
        });

        $('#menu a').click(function(e) {
            var attrib = $('#renderedPage').is('object') ? 'data' : 'src';
            e.preventDefault();
            $(this).parent().addClass('selected').siblings().removeClass('selected');
            $('#renderedPage').attr(attrib, $(this).attr('href'));
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
                })
                $(this).text('Expand');
                expanded = false;
            } else {
                header.animate({
                    marginTop: '-=' + header_height.toString()
                }, {
                    step: function() {
                        fixWindow();
                    }
                })
                $(this).text('Contract');
                expanded = true;
            }
        });

    });

}(jQuery));