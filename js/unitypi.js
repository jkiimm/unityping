(function($) {
    'use strict';

    var Unitypi = function(selector, options) {
        this.jq = $(selector); 
        this.options = $.extend({}, $.fn.unitypi.defaults, options);
        this.beginCode = {
            han: 0xAC00,
            cho: 0x1100,
        };
        this.pos = {
            str: 0,
            ch: 0,
        };
        this.written = this.jq.text();

        this.run();
    };

    Unitypi.prototype = {
        construction: Unitypi,
        init: function() {
            var that = this;
            var sq = that.sequencer(that.options.string);
            sq.tplen = (function() {
                var len = 0;
                for(var i=0; i<sq.length; i++) {
                    len += sq[i].length;
                }
                return len;
            })();

            setTimeout(function() {
                that.typing(sq);
            }, this.options.startDelay);
        },
        typing: function(sq) {
            var that = this;

            var duration = (function() {
                var variation = 50;
                var randomSpeed = (Math.random()*variation - variation*0.5) + that.options.typingSpeed;
                return sq.tplen*300/randomSpeed;
            })();

            setTimeout(function() {
                if(that.pos.str === sq.length) return;

                that.written = !that.pos.ch ? that.written+sq[that.pos.str][that.pos.ch] : that.written.substr(0, that.written.length-1)+sq[that.pos.str][that.pos.ch];
                that.jq.text(that.written);

                if(that.pos.ch !== sq[that.pos.str].length-1) {
                    that.pos.ch++;	
                } else {
                    that.pos.str++;
                    that.pos.ch = 0;
                }
                that.typing(sq);
            }, duration);
        },
        run: function() {
            this.init(); 
        },
        sequencer: function(str) {
            var that = this;
            var combiner = function(c) {
                var arr = [];
                arr.push(String.fromCharCode(that.beginCode.cho+c.cho()));
                arr.push(String.fromCharCode(that.beginCode.han+((c.cho()*21)+c.jung())*28));

                if(c.jong()) {
                    arr.push(String.fromCharCode(that.beginCode.han+((c.cho()*21)+c.jung())*28+c.jong()));
                }

                return arr;
            };
            var charDivider = function(uni) {
                // Not Hangul
                if(!/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(uni)) {
                    return [uni];
                } 

                // Hangul
                var remainder = uni.charCodeAt(0) - that.beginCode.han,
                hanCode = {
                    jong: function() {
                        return remainder % 28;
                    },
                    jung: function() {
                        return ((remainder-this.jong())/28) % 21;
                    },
                    cho: function() {
                        return (((remainder-this.jong())/28)-this.jung()) / 21;
                    }
                };

                return combiner(hanCode);
            };

            var sq = [];
            for(var i=0; i<str.length; i++) {
                var charArr = charDivider(str[i]);
                sq.push(charArr);
            }

            return sq;
        },
    };

    $.fn.unitypi = function(options) {
        return this.each(function() {
            var jq = $(this);
            jq.data('unitypi', new Unitypi(this, options));
        });
    };

    $.fn.unitypi.defaults = {
        string: '이걸본다면 누군가는 이걸 쓰고있다는거군',
        typingSpeed: 200,
        startDelay: 0,
    };
})(window.jQuery);
