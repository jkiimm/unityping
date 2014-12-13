// The MIT License (MIT)
// // Copyright (c) 2014 ligeek
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

    var Unityping = function(selector, options) {
        this.jq = $(selector); 
        this.options = $.extend({}, $.fn.unityping.defaults, options);
        this.beginCode = {
            han: 0xAC00,
            cho: 0x1100,
        };
        this.jamo = {
            cho: [
                'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ',
                'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
                'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ',
                'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
            ],
            jung: [
                'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ',
                'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
                'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ',
                'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ',
                'ㅣ' 
            ],
            jong: [
                '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ',
                'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
                'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ',
                'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
                'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ',
                'ㅌ', 'ㅍ', 'ㅎ' 
            ]
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

    Unityping.prototype = {
        construction: Unityping,
        init: function() {
            var that = this;
            for(var i=0, len=that.options.string.length; i<len; i++) {
                that.sq.push(that.sequencer(that.options.string[i]));
                that.sq[i].tplen = (function() {
                    var len = 0;
                    for(var j=0; j<that.sq[i].length; j++) {
                        len += that.sq[i][j].length;
                    }
                    return len;
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
                return (60*1000)/randomSpeed;
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
        addCursor: function(symbol) {
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
                var transHanChar = function(cho, jung, jong) {
                    jong = jong || 0;
                    if((typeof jung === 'undefined') && !jong) {
                        return String.fromCharCode(that.beginCode.cho+cho);
                    }
                    return String.fromCharCode(that.beginCode.han+((cho*21)+jung)*28+jong);
                };
                var jamo = that.jamo;

                arr.push(transHanChar(c.cho));

                if(c.jung > jamo.jung.indexOf('ㅗ') && c.jung < jamo.jung.indexOf('ㅛ')) {
                    arr.push(transHanChar(c.cho, jamo.jung.indexOf('ㅗ')));
                } else if(c.jung > jamo.jung.indexOf('ㅜ') && c.jung < jamo.jung.indexOf('ㅠ')) {
                    arr.push(transHanChar(c.cho, jamo.jung.indexOf('ㅜ')));
                } else if(c.jung > jamo.jung.indexOf('ㅡ') && c.jung < jamo.jung.indexOf('ㅣ')) {
                    arr.push(transHanChar(c.cho, jamo.jung.indexOf('ㅡ')));
                }
                arr.push(transHanChar(c.cho, c.jung));


                if(c.jong) {
                    if(c.jong > jamo.jong.indexOf('ㄲ') && c.jong < jamo.jong.indexOf('ㄴ')) {
                        arr.push(transHanChar(c.cho, c.jung, jamo.jong.indexOf('ㄱ')));
                    } else if(c.jong > jamo.jong.indexOf('ㄴ') && c.jong < jamo.jong.indexOf('ㄷ')) {
                        arr.push(transHanChar(c.cho, c.jung, jamo.jong.indexOf('ㄴ')));
                    } else if(c.jong > jamo.jong.indexOf('ㄹ') && c.jong < jamo.jong.indexOf('ㅁ')) {
                        arr.push(transHanChar(c.cho, c.jung, jamo.jong.indexOf('ㄹ')));
                    } else if(c.jong > jamo.jong.indexOf('ㅂ') && c.jong < jamo.jong.indexOf('ㅅ')) {
                        arr.push(transHanChar(c.cho, c.jung, jamo.jong.indexOf('ㅂ')));
                    }
                    arr.push(transHanChar(c.cho, c.jung, c.jong));
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
                hanCode = {};
                hanCode.jong = remainder % 28;
                hanCode.jung = ((remainder-hanCode.jong) / 28) % 21;
                hanCode.cho = (((remainder-hanCode.jong)/28) - hanCode.jung) / 21;


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

    $.fn.unityping = function(options) {
        return this.each(function() {
            var jq = $(this);
            jq.data('unityping', new Unityping(this, options));
        });
    };

    $.fn.unityping.defaults = {
        string: ['안녕하세요!', '원하시는 문장을 쓰시면,', '이렇게 타이핑이 됩니다!'],
        typingSpeed: 200,
        startDelay: 0,
        backDelay: 1000,
        backSpeed: 100,
        cursor: '|',
        eachTyping: function() {},
        eachBack: function() {},
        onComplete: function() {},
    };
})(window.jQuery);
