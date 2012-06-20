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
        init: function() {
            this.arrowsContainer = $('#portfolio .arrows');
            this.listContainer = $('#portfolio ul.portfolio');
            this.postContainer = $('#portfolio div.portfolio');

            var self = this;
            $('> li > a', this.listContainer).click(function(e) {
                var postId = $(this).attr('href').replace(/^.*\//, '').replace(/\.html$/, '');
                e.preventDefault();
                self.showPost(postId);
            });
            $('.list', this.arrowsContainer).click(function(e) {
                e.preventDefault();
                self.showList();
            })
            $(document).keypress(function(e) {
                if(e.charCode === 0 && e.keyCode === 40) {
                    e.preventDefault();
                    self.showList();
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
        showPost: function(postId) {
            var self = this;
            $.ajax({
                url: '/js/posts/' + postId + '.json',
                dataType: 'json',
                success: function(response) {
                    var lang,
                        tech,
                        technologyVersion,
                        date = response.date.split('-'),
                        technologiesContainer = $('.technologies', self.postContainer);
                    self.postContainer.find('h3').html(response.title + ' <cite>' + response.cite + '</cite>');
                    for(lang in response.description) {
                        self.postContainer.find('.translate-' + lang).html(response.description[lang]);
                    }
                    technologiesContainer.empty();
                    for(tech in response.technologies) {
                        technologyVersion = response.technologies[tech];
                        technologiesContainer.append($('<li><abbr title="' + self.TECH[tech][1] + '">' + self.TECH[tech][0] + (technologyVersion ? ' ' + technologyVersion : '') + '</abbr></li>'));
                    }
                    $('li:last', technologiesContainer).addClass('last');
                    technologiesContainer.append($('<li class="date"><span class="' + self.MONTHS[date[1]].toLowerCase() + '">' + self.MONTHS[date[1]] + '</span> ' + date[0] + '</li>'));
                    if(response.online) {
                        technologiesContainer.append($('<li class="online"><a href="' + response.url + '">See online</li>'));
                    }
                    self.arrowsContainer.fadeIn(1000, function() {
                        $(this).parent().removeClass('list');
                    });
                    self.postContainer.show();
                    self.listContainer.hide();
                }
            });
        }
    }

    $(document).ready(function() {
        Translator.init();
        Portfolio.init();
    });

}(jQuery))