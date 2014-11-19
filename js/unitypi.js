// The MIT License (MIT)
// 
// Copyright (c) 2014 ligeek
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.


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
            sentence: 0,
        };
        this.written = this.jq.text();
        this.sq = [];

        this.run();
    };

    Unitypi.prototype = {
        construction: Unitypi,
        init: function() {
            var that = this;
            for(var i=0, len=that.options.string.length; i<len; i++) {
                that.sq.push(that.sequencer(that.options.string[i]));
                that.sq[i].tplen = (function() {
                    var length = 0;
                    for(var j=0; j<that.sq[i].length; j++) {
                        length += that.sq[i][j].length;
                    }
                    return length;
                })();
            }

            setTimeout(function() {
                that.typing(that.sq[that.pos.sentence]);
            }, this.options.startDelay);
        },
        typing: function(sq) {
            var that = this;

            var duration = (function() {
                var variation = 50;
                var randomSpeed = (Math.random()*variation - variation*0.5) + that.options.typingSpeed;
                return sq.tplen*600/randomSpeed;
            })();

            setTimeout(function() {
                if(that.pos.str === sq.length) {
                    if(that.pos.sentence === that.options.string.length-1) { return; }
                    setTimeout(function() {
                        that.backspace(sq);
                    }, that.options.backDelay);

                    that.options.onComplete();
                    return;
                }

                that.written = !that.pos.ch ? that.written+sq[that.pos.str][that.pos.ch] : that.written.substr(0, that.written.length-1)+sq[that.pos.str][that.pos.ch];
                that.jq.text(that.written);
                // eachTyping callback
                that.options.eachTyping(that.written, that.pos);

                if(that.pos.ch !== sq[that.pos.str].length-1) {
                    that.pos.ch++;	
                } else {
                    that.pos.str++;
                    that.pos.ch = 0;
                }
                that.typing(sq);
            }, duration);
        },
        backspace: function(sq) {
            var that = this; 
            var strlen = that.options.string.length;

            setTimeout(function() {
                if(!that.pos.str) {
                    if(that.pos.sentence !== strlen-1) {
                        that.pos.sentence++;
                        setTimeout(function() {
                            that.typing(that.sq[that.pos.sentence]);
                        }, that.options.startDelay);
                    }

                    that.options.onComplete();
                    return;
                }
                that.written = that.written.substr(0, that.written.length-1);
                that.jq.text(that.written);
                // eachBack callback
                that.options.eachBack(that.written, that.pos.sentence);

                that.pos.str--;

                that.backspace(sq);
            }, that.options.backSpeed);
        },
        run: function() {
            this.addCursor(this.options.cursor); 
            this.init(); 
        },
        addCursor: function(_symbol) {
            var symbol = _symbol;
            this.jq.after('<span id="blinker">'+symbol+'</span>');
            $('#blinker').css({
                'font-weight': 100,
                'font-size': parseInt(this.jq.css('font-size'))*1.14+'px'
            });
        
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
        string: ['반가워요, 프로그래머!', '원하시는 문장을 쓰시면,', '이렇게 타이핑이 됩니다!'],
        typingSpeed: 200,
        startDelay: 0,
        backDelay: 1000,
        backSpeed: 100,
        eachTyping: function() {},
        eachBack: function() {},
        onComplete: function() {},
        cursor: '|',
    };
})(window.jQuery);
