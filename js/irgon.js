/*jslint browser: true, white: true */
/*properties
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12',
    CODES, MONTHS, TECH, addClass, ajax, append, arrowsContainer, attr, call,
    charCode, cite, click, css, currentPost, dataType, date, description, empty,
    en, fadeIn, fadeOut, fetchPost, find, hasOwnProperty, hide, href, html, id,
    imagesLoaded, indexOf, init, is, js, keyCode, keypress, list, listContainer,
    location, map, mysql, online, parent, php, pl, postCache, postContainer,
    preventDefault, preview, ready, removeClass, replace, show, showList,
    showNextPost, showPost, showPreviousPost, split, success, technologies,
    title, toLowerCase, translate, url, xhtml
*/

var jQuery = typeof(jQuery) === 'undefined' ? null : jQuery;

(function($) {

    "use strict";

    var Translator = {
        CODES: {
            'en': 'en-US',
            'pl': 'pl-PL'
        },
        map: {},
        init: function() {
            var self = this;
            $('body').addClass('loading');
            $.ajax({
                url: '/js/translations.json',
                dataType: 'json',
                success: function(response) {
                    self.map = response;
                    $('body').removeClass('loading');
                }
            });
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
        init: function() {
            $('body').addClass('loading');

            this.arrowsContainer = $('#portfolio .arrows');
            this.listContainer = $('#portfolio ul.portfolio');
            this.postContainer = $('#portfolio div.portfolio');

            var self = this;
            $.ajax({
                url: '/js/portfolio.json',
                dataType: 'json',
                success: function(response) {
                    self.list = response;
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

            $('body').removeClass('loading');
        },
        showList: function() {
            this.arrowsContainer.fadeOut(1000, function() {
                $(this).parent().addClass('list');
            });
            this.postContainer.hide();
            this.listContainer.show();
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
        },
        showPost: function(postData) {
            var lang,
                tech,
                technologyVersion,
                date = postData.date.split('-'),
                technologiesContainer = $('.technologies', this.postContainer);
            this.postContainer.imagesLoaded(function() {
                $('body').removeClass('loading');
            });
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
            this.postContainer.find('img.preview').attr('src', '/images/posts/' + postData.id + '.png');
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
                technologiesContainer.append($('<li class="online"><a href="' + postData.url + '" target="_blank">See online</a></li>'));
            }
            this.arrowsContainer.fadeIn(1000, function() {
                $(this).parent().removeClass('list');
            });
            this.postContainer.show();
            this.listContainer.hide();
        }
    };

    $(document).ready(function() {
        $('body').removeClass('no-js');
        Translator.init();
        Portfolio.init();
    });

}(jQuery));
