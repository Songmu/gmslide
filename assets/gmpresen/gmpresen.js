(function () {
"use strict";
/*global $: false, document, setInterval, clearInterval, location, window, alert, _ */

var Presen = {
    init: function (slides) {
        var start_time = new Date();
        start_time.setMilliseconds(0);
        this.start_time = start_time;

        this.sections = $('div.slide');

        this.init_page();
        this.rewrite();

        $("#total_page").html(Presen.sections.length);

        var self = this;

        setInterval(
            function () { self.cron(); }, 500
        );
    },
    init_page: function () {
        if (location.hash === "") {
            this.page = 0;
        } else {
            this.page = Number(location.hash.substr(1));
        }
    },
    has_next: function () {
        return this.page < this.sections.length-1;
    },
    next: function () {
        if (!this.has_next()) {
            return;
        }
        this.page++;
        this.rewrite();
    },
    has_prev: function () {
        return this.page > 0;
    },
    prev: function (){
        if (!this.has_prev()) {
            return;
        }
        this.page--;
        this.rewrite();
    },
    cron: function () {
        var now = new Date();
        $("#time").html(now.hms());

        $("#current_page").html((Presen.page+1));

        var used_time = parseInt( (now - Presen.start_time)/1000, 10 );
        var used_min = parseInt(used_time/60.0, 10);
        var used_sec = parseInt( used_time - (used_min*60.0), 10 );
        $('#used_time').html('' + Presen.two_column(used_min) + ':' + Presen.two_column(used_sec));

        var body = $(window);
        var topic = $('#topics');
        if (topic.width() > body.width()) {
            topic.html(' ' +topic.width() + " " + body.width());
        }
    },
    rewrite: function () {
        var p = this.page;
        var slide = this.sections[p];

        $("#topics").html(slide);
        location.hash  = "#" + p;
    },
    two_column: function (i) {
        var m = "" + i;
        if (m.length == 1) { m = "0"+m; }
        return m;
    },
    change_font_size: function (selector, factor) {
        var px = $(selector).css('font-size');
            px = parseInt(px.replace('px', ''), 10) + factor;
            px = "" + px + "px";
        $(selector).css('font-size', px);

        Presen.pre_font_size = parseInt(Presen.pre_font_size, 10) + factor + "px";
    }
};

Date.prototype.hms = function () {
    return '' + Presen.two_column(this.getHours()) + ":" + Presen.two_column(this.getMinutes()) + ":" + Presen.two_column(this.getSeconds());
};

Presen.observe_key_event = function () {
    $(document).keydown(function(e) {
        switch(e.keyCode){
            case 82: // r
                location.reload();
                break;

            case 80: // p
            case 75: // k
            case 38: Presen.prev();e.stopPropagation();break;

            case 78: // n
            case 74: // j
            case 40: Presen.next();e.stopPropagation();break;

//            case 70: // f
//                $('#footer').toggle();
//                e.stopPropagation();
//                break;

            case 190: // > and .
                Presen.change_font_size('#topics', +10);
                break;
            case 188: // < and ,
                Presen.change_font_size('#topics', -10);
                break;
        }
    });
};

// -------------------------------------------------------------------------

$(
  function (){
    Presen.init();
    Presen.observe_key_event();
  });
})();
