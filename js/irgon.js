(function($) {

    Translator = {
        CODES: {
            'en': 'en-US',
            'pl': 'pl-PL'
        },
        map: {},
        init: function() {
            var self = this;
            $.ajax({
                url: '/js/translations.json',
                dataType: 'json',
                success: function(response) {
                    self.map = response;
                }
            });
        },
        translate: function(lang) {
            var translations = this.map[lang], selector;
            if(translations) {
                for(selector in translations) {
                    $(selector).html(translations[selector]);
                }
            }
            $('html').attr('lang', this.CODES[lang]);
        }

    }

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
                var postId = $(this).attr('href').replace(/^.*\//, '').replace(/\.html$/, '');
                e.preventDefault();
                self.fetchPost(postId);
            });
            $('.list a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showList();
            })
            $('.prev a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showPreviousPost();
            })
            $('.next a', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showNextPost();
            })
            $(document).keypress(function(e) {
                var previousPostId, nextPostId, lastPost;
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
                                lastPost = self.currentPost ? self.currentPost : self.list[0];
                                self.fetchPost(lastPost);
                            }
                            break
                        case 39:
                            e.preventDefault();
                            self.showNextPost();
                            break;

                    }
                }
            })
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
            this.currentPost = postData.id;
            if(!this.postCache[postData.id]) {
                this.postCache[postData.id] = postData;
            }
            this.postContainer.find('h3').html(postData.title + ' <cite>' + postData.cite + '</cite>');
            for(lang in postData.description) {
                this.postContainer.find('.translate-' + lang).html(postData.description[lang]);
            }
            technologiesContainer.empty();
            for(tech in postData.technologies) {
                technologyVersion = postData.technologies[tech];
                technologiesContainer.append($('<li><abbr title="' + this.TECH[tech][1] + '">' + this.TECH[tech][0] + (technologyVersion ? ' ' + technologyVersion : '') + '</abbr></li>'));
            }
            $('li:last', technologiesContainer).addClass('last');
            technologiesContainer.append($('<li class="date"><span class="' + this.MONTHS[date[1]].toLowerCase() + '">' + this.MONTHS[date[1]] + '</span> ' + date[0] + '</li>'));
            if(postData.preview) {
                technologiesContainer.append($('<li class="preview"><a href="/' + postData.id + '/" target="_blank">See preview</a></li>'));
            }
            if(postData.online) {
                technologiesContainer.append($('<li class="online"><a href="' + postData.url + '">See online</a></li>'));
            }
            this.arrowsContainer.fadeIn(1000, function() {
                $(this).parent().removeClass('list');
            });
            this.postContainer.show();
            this.listContainer.hide();
        }
    }

    $(document).ready(function() {
        Translator.init();
        Portfolio.init();

        $('body').ajaxSend(function() {
            $(this).addClass('loading');
        }).ajaxComplete(function() {
            $(this).removeClass('loading');
        })
    });

}(jQuery))
