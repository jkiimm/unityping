Unitypi
=========
Hangul Typing effect plugin(한글 타이핑 효과!).

Introduction(소개)
----
>한글 문장을 입력하면 웹상에서 초성, 중성, 종성 입력에 따른 **한글을 타이핑 치는듯한 효과**를 낼 수 있습니다. 기존의 타이핑 효과 플러그인을 한글로 입력했을시에는 초성, 중성, 종성 각각의 입력이 보이지 않고, 문자 하나씩 나타나 아쉬운 마음에 제작.  


Install(설치)
----
### 일반적인 방법
오른쪽에 있는 Download ZIP을 누르시거나, [여기에서!](https://github.com/ligeek/unitypi/archive/master.zip)

### git을 이용한 방법
~~~ sh
$ git clone https://github.com/ligeek/unitypi.git
~~~

### bower를 이용한 방법
~~~ sh 
$ bower install -S unitypi
~~~

Usage(사용법)
----
잠깐, [jQuery](http://jquery.com)는 설치했죠?
~~~ javascript
<body>
    <span class="foo"></span>
    ...
    <script src="jquery.js"></script>
    <script src="unitypi.js"></script>
    <script>
      	$(function(){
            $('.foo').unitypi({
                string: '두유 노우 김연아?',
                typingSpeed: 100, // 100타/분
                startDelay: 1000 // ms
                backSpeed: 100, // ms
                backDelay: 1000 // ms
            });
      	});
    </script>
</body>
~~~

### backspace 해제
출력된 문장을 지우지 않고 그대로 유지하고 싶으면, `backSpeed: false`로 설정.
~~~ javascript
$('.foo').unitypi({
    string: '문장을 그대로 유지하고 싶나요?',
    typingSpeed: 100, // 100타/분
    startDelay: 1000 // 1000ms
    backSpeed: false // backspace 해제
});
~~~



Note(비고)
----
현재는 아주 기본적인 기능만 담고 있으므로, 정말 간단한 곳에만 활용하시는 것이 정신건강에 이롭습니다. 사용해보시고 건의하실 사항*(이 기능이 없는게 말이되??)*이나 버그로 인한 스트레스를 받고 있다면 언제든지 [issue](https://github.com/ligeek/unitypi/issues)에 올려주세요!

