var jQuery="undefined"===typeof jQuery?null:jQuery;
(function(a){a(document).ready(function(){var e=!1,c=a("#header"),f=c.outerHeight(!0),g=a("#footer").outerHeight(!0),h=a("#menu").outerHeight(!0),d=function(){var b=a(window).height();a("#wrapper").height(b-g);a("#content").height(b-c.outerHeight(!0)-g-h);a("#renderedPage").width(a("#content").width());a("#renderedPage").height(a("#content").height())};a("body").removeClass("no-js");a(window).resize(d);d();a(document).keypress(function(b){0===b.keyCode&&117===b.charCode&&(b.preventDefault(),window.location.href=
"https://github.com/irgon/"+a('meta[name="Project"]').attr("content")+"/tree/gh-pages/")});a("#menu a").click(function(b){b.preventDefault();a(this).parent().addClass("selected").siblings().removeClass("selected");a("#renderedPage").attr("src",a(this).attr("href"))});a("#content a.show").bind("click",function(b){b.preventDefault();e?(c.slideDown(),c.animate({marginTop:"+="+f.toString()},{step:function(){d()}}),a(this).text("Expand"),e=!1):(c.animate({marginTop:"-="+f.toString()},{step:function(){d()}}),
a(this).text("Contract"),e=!0)})})})(jQuery);