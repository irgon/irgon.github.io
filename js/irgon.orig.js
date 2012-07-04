/*jslint browser: true, white: true */
/*properties
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
    BACKCODES, CODES, MONTHS, TECH, addClass, ajax, append, arrowsContainer,
    attr, bind, call, charCode, cite, click, cookie, css, currentLanguage,
    currentPost, currentUrl, data, dataType, date, description, empty, en,
    'en-US', fadeIn, fadeOut, fetchPost, find, fitText, hasOwnProperty, hash,
    height, hide, href, html, id, imgPreview, indexOf, init, is, js, keyCode,
    keypress, language, list, listContainer, location, log, map, match, mysql,
    navigator, on, online, parent, php, pl, 'pl-PL', postCache, postContainer,
    preventDefault, preview, ready, removeClass, replace, resize,
    setCurrentLanguage, show, showList, showNextPost, showPost, showPreviousPost,
    sliderContainer, split, success, technologies, title, toLowerCase, translate,
    url, userLanguage, watchUrl, width, xhtml
*/




var jQuery = typeof(jQuery) === 'undefined' ? null : jQuery;

(function($) {

    "use strict";

    var Translator = {
        CODES: {
            'en': 'en-US',
            'pl': 'pl-PL'
        },
        BACKCODES: {
            'en-US': 'en',
            'pl-PL': 'pl'
        },
        map: {},
        currentLanguage: null,
        init: function() {
            var self = this;
            this.currentLanguage = (document.cookie.match(/language=([a-z]{2})/) ? document.cookie.match(/language=([a-z]{2})/)[1] : null) || this.BACKCODES[window.navigator.userLanguage] || this.BACKCODES[window.navigator.language] || this.BACKCODES[$('html').attr('lang')];
            $('body').addClass('loading').addClass('loading-lang');
            $.ajax({
                url: '/js/translations.json',
                dataType: 'json',
                success: function(response) {
                    self.map = response;
                    self.translate(self.currentLanguage);
                    $('body').removeClass('loading').removeClass('loading-lang');
                }
            });
            $('#languages a').click(function(e) {
                e.preventDefault();
                self.setCurrentLanguage($(this).data('lang'));
                self.translate(self.currentLanguage);
            });
        },
        setCurrentLanguage: function(lang) {
            this.currentLanguage = lang;
            document.cookie = 'language=' + lang;
        },
        translate: function(lang) {
            var translations = this.map[lang], selector;
            if(translations) {
                for(selector in translations) {
                    if(translations.hasOwnProperty(selector)) {
                        $(selector).html(translations[selector]);
                    }
                }
            }
            $('html').attr('lang', this.CODES[lang]);
        }
    },
    Portfolio = {
        TECH: {
            'html':  ['HTML', 'HyperText Markup Language'],
            'xhtml': ['XHTML', 'eXtensible HyperText Markup Language'],
            'css':   ['CSS', 'Cascading Style Sheets'],
            'js':    ['JS', 'JavaScript'],
            'php':   ['PHP', 'PHP: Hypertext Preprocessor'],
            'mysql': ['MySQL']
        },
        MONTHS: {
            '01': 'Jan',
            '02': 'Feb',
            '03': 'Mar',
            '04': 'Apr',
            '05': 'May',
            '06': 'Jun',
            '07': 'Jul',
            '08': 'Aug',
            '09': 'Sep',
            '10': 'Oct',
            '11': 'Nov',
            '12': 'Dec'
        },
        list: [],
        currentPost: null,
        postCache: {},
        currentUrl: null,
        init: function() {
            $('body').addClass('loading');

            this.arrowsContainer = $('#portfolio .arrows');
            this.listContainer = $('#portfolio ul.portfolio');
            this.postContainer = $('#portfolio div.portfolio');
            this.sliderContainer = $('#slider');
            this.imgPreview = this.postContainer.find('img.preview');

            this.imgPreview.bind('load', function() {
                $('body').removeClass('loading');
            });

            var self = this;
            $.ajax({
                url: '/js/portfolio.json',
                dataType: 'json',
                success: function(response) {
                    self.list = response;
                    self.watchUrl();
                }
            });

            $('> li > a', this.listContainer).click(function(e) {
                var postId = $(this).attr('href').replace(/^[a-zA-Z0-9_\-\/]*\//, '').replace(/\.html$/, '');
                e.preventDefault();
                self.fetchPost(postId);
            });
            $('.list a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showList();
            });
            $('.prev a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showPreviousPost();
            });
            $('.next a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showNextPost();
            });
            $(document).keypress(function(e) {
                var lastPost;
                if(e.keyCode === 0 && e.charCode === 117) {
                    e.preventDefault();
                    window.location.href = 'https://github.com/irgon/irgon.github.com/';
                }
                if(e.charCode === 0) {
                    switch(e.keyCode) {
                        case 37:
                            e.preventDefault();
                            self.showPreviousPost();
                            break;
                        case 40:
                            e.preventDefault();
                            if(self.postContainer.is(':visible')) {
                                self.showList();
                            } else {
                                lastPost = self.currentPost || self.list[0];
                                self.fetchPost(lastPost);
                            }
                            break;
                        case 39:
                            e.preventDefault();
                            self.showNextPost();
                            break;
                    }
                }
            });

            $('#top a').attr('href', '#');

            $('body').removeClass('loading');
        },
        watchUrl: function() {
            var self = this;
            setInterval(function() {
                var urlId = window.location.hash.replace(/^#!\//, '').replace(/\/?$/, '');
                if(self.currentUrl !== urlId) {
                    self.currentUrl = urlId;
                    if(self.list.indexOf(urlId) > -1) {
                        self.fetchPost(urlId);
                    } else {
                        if(!window.location.href.match(/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/)) {
                            self.showList();
                        }
                    }
                }
            }, 100);
        },
        showList: function() {
            $('#content').addClass('view-list').removeClass('view-item');
            this.arrowsContainer.fadeOut(1000, function() {
                $(this).parent().addClass('list');
            });
            this.postContainer.hide();
            this.listContainer.show();
            this.sliderContainer.show();
            window.location.href = '/#';
        },
        showPreviousPost: function() {
            var previousPostId = this.list[this.list.indexOf(this.currentPost) - 1];
            if(previousPostId) {
                this.fetchPost(previousPostId);
            }
        },
        showNextPost: function() {
            var nextPostId = this.list[this.list.indexOf(this.currentPost) + 1];
            if(nextPostId) {
                this.fetchPost(nextPostId);
            }
        },
        fetchPost: function(postId) {
            $('body').addClass('loading');
            this.imgPreview.attr('src', '');
            if(this.currentUrl !== postId) {
                window.location.href = '/#!/' + postId;
            } else {
                var self = this;
                if(this.postCache[postId]) {
                    this.showPost(this.postCache[postId]);
                } else {
                    $.ajax({
                            url: '/js/posts/' + postId + '.json',
                            dataType: 'json',
                            success: function(response) {
                                self.showPost.call(self, response);
                            }
                    });
                }
            }
        },
        showPost: function(postData) {
            var lang,
                tech,
                technologyVersion,
                date = postData.date.split('-'),
                technologiesContainer = $('.technologies', this.postContainer);
            this.sliderContainer.hide();
            this.currentPost = postData.id;
            if(!this.postCache[postData.id]) {
                this.postCache[postData.id] = postData;
            }
            this.postContainer.find('h3').html(postData.title + ' <cite>' + postData.cite + '</cite>');
            for(lang in postData.description) {
                if(postData.description.hasOwnProperty(lang)) {
                    this.postContainer.find('.translate-' + lang).html(postData.description[lang]);
                }
            }
            technologiesContainer.empty();
            for(tech in postData.technologies) {
                if(postData.technologies.hasOwnProperty(tech)) {
                    technologyVersion = postData.technologies[tech];
                    technologiesContainer.append($('<li><abbr title="' + this.TECH[tech][1] + '">' + this.TECH[tech][0] + (technologyVersion ? ' ' + technologyVersion : '') + '</abbr></li>'));
                }
            }
            $('li:last', technologiesContainer).addClass('last');
            technologiesContainer.append($('<li class="date"><span class="' + this.MONTHS[date[1]].toLowerCase() + '">' + this.MONTHS[date[1]] + '</span> ' + date[0] + '</li>'));
            if(postData.preview) {
                technologiesContainer.append($('<li class="preview"><a href="/' + postData.id + '/" target="_blank">See preview</a></li>'));
            }
            if(postData.online) {
                technologiesContainer.append($('<li class="online"><a href="' + postData.url + '" target="_blank" rel="nofollow">See online</a></li>'));
            }
            this.arrowsContainer.fadeIn(1000, function() {
                $(this).parent().removeClass('list');
            });
            Translator.translate(Translator.currentLanguage);
            this.imgPreview.attr('src', '/images/posts/' + postData.id + '.jpg');
            if(this.imgPreview.height() > 0) {
                $('body').removeClass('loading');
            }
            $('#content').addClass('view-item').removeClass('view-list');
            this.postContainer.show();
            this.listContainer.hide();
        }
    };

    $(document).ready(function() {
        $('body').removeClass('no-js');
        Translator.init();
        Portfolio.init();
        $('#top h1 a').fitText(0.433);
    });

    $(window).on('resize', function() {
        var $slider = $('#slider'), $sliderImg = $slider.find('img'), $sliderLi = $slider.find('li');
        $slider.height($slider.width() * 0.618033988);
        $sliderImg.width($slider.width());
        $sliderLi.width($sliderImg.width()).height($sliderImg.height()).css('marginTop', '-' + ($sliderImg.height() / 2) + 'px').css('marginLeft', '-' + ($sliderImg.width() / 2) + 'px');
    }).resize();

}(jQuery));
