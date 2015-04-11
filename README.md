#Unityping
>jQuery - Hangul-typing effect plugin(한글 타이핑 플러그인)

![typing GIF](http://ligeek.github.io/unityping/images/unityping.gif)

#소개
한글 문장을 입력하면 웹상에서 초성, 중성, 종성 입력에 따른 **한글을 타이핑 치는듯한 효과**를 낼 수 있습니다. 기존의 타이핑 효과 플러그인을 한글로 입력했을시에는 초성, 중성, 종성 각각의 입력이 보이지 않고, 문자 하나씩 나타나 아쉬운 마음에 제작**(아 물론, 영어는 기본 지원)**.


#설치
## git을 이용한 방법
~~~ sh
$ git clone https://github.com/ligeek/unityping.git
~~~

## bower를 이용한 방법
~~~ sh 
$ bower install --save unityping
~~~

#사용법
잠깐, [jQuery](http://jquery.com)는 설치했죠?
~~~ javascript
<body>
    <span class="foo"></span>
    ...
    <script src="jquery.js"></script>
    <script src="unityping.js"></script>
    <script>
      	$(function(){
            $('.foo').unityping({
                string: ['두유 노우 김연아?', '두유 노우 강남스타일?', '두유 노우 지성팍?'],
                typingSpeed: 300, // 300타/분 (CPM; Characters per Minute)
                startDelay: 1000, // ms
                backSpeed: 100, // ms
                backDelay: 1000 // ms
            });
      	});
    </script>
</body>
~~~

## 커서 애니메이션을 넣는 방법
아래의 CSS코드를 복사해서 붙어넣으세요.
~~~ css
#blinker{
    -webkit-animation: blink 1.2s step-end infinite;
    -moz-animation: blink 1.2s step-end infinite;
    animation: blink 1.2s step-end infinite;
}
@keyframes blink {
    from, to { opacity: 0; }
    50% { opacity: 1; }
}
@-webkit-keyframes blink {
    from, to { opacity: 0; }
    50% { opacity: 1; }
}
@-moz-keyframes blink {
    from, to { opacity: 0; }
    50% { opacity: 1; }
}
~~~

## 좀 더 자세한 사용법들
[Wiki를 참조하세요!](https://github.com/ligeek/unityping/wiki)


#Note(비고)
현재는 아주 기본적인 기능만 담고 있으므로, 간단한 곳에만 활용하시는 것이 정신건강에 이롭습니다. 사용해보시고 건의하실 사항*(이 기능이 없는게 말이됨?)*이나 버그로 인해 고통을 받고 있다면 언제든지 [issue](https://github.com/ligeek/unityping/issues)에 올려주세요.



