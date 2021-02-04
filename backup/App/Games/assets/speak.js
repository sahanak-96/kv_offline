var speakfalg = 0;
var voices;
var msg = new SpeechSynthesisUtterance();
voices = window.speechSynthesis.getVoices();
console.log("check:" + window.speechSynthesis.getVoices());
function setvoice() {
	msg = new SpeechSynthesisUtterance();
	voices = window.speechSynthesis.getVoices();
	setTimeout(speaksound, 1000)
}

function speaksound() {
	var s;
	var scripts = document.getElementsByTagName("script");
	for (i = 0; i < scripts.length; i++) {
		var temp = scripts[i].innerHTML
		if (temp.indexOf("msg.text") !== -1) {
			s = scripts[scripts.length - 1].innerHTML;
		}
	}
	var ret = "";
	if (/'/.test(s)) {
		ret = s.match(/'(.*?)'/)[1];
	}
	else if (/"/.test(s)) {
		ret = s.match(/"(.*?)"/)[1];
	}
	console.log("s : " + s);
	msg.text = ret;
	voices = window.speechSynthesis.getVoices();
	if (voices == '') {
		setvoice();
	}
	console.log("voice calling");
	console.log("voices  check : " + voices[0]);
	for (i = 0; i < voices.length; i++) {
		//alert(voices[i].name+" : " +voices[i].lang+" : " +voices[i].voiceURI);
		//alert(voices[i].voiceURI);
		if (voices[i].voiceURI == "Google UK English Female" || voices[i].voiceURI == "com.apple.speech.synthesis.voice.karen" || voices[i].voiceURI == "com.apple.ttsbundle.Moira-compact" || voices[i].voiceURI == "urn:moz-tts:sapi:Microsoft Zira Desktop - English (United States)?en-US") {

			msg.voice = voices[i];
			//alert(voices[i].voiceURI);
		}
	}
	if (msg.voice == null) {
		console.log("voice null check : " + msg.voice + ": " + voices[0]);
		msg.voice = voices[0];
	}
	msg.volume = 1; // 0 to 1
	msg.pitch = 1; //0 to 2
	msg.rvIndex = 0
	msg.rvTotal = 1
	console.log(msg.voice);
	msg.lang = 'hi-IN';
	if (speakfalg == 0) {
		if (msg.voice != null) {
			console.log("speaking");
			window.speechSynthesis.speak(msg);
			speakfalg = 1;
		}
		console.log("msg.voice : " + msg.voice);
		console.log("msg.volume : " + msg.volume);
		console.log("msg.pitch : " + msg.pitch);
		console.log("msg.rate : " + msg.rate);
		console.log("msg.rvIndex : " + msg.rvIndex);
		console.log("msg.rvTotal : " + msg.rvTotal);
		console.log("msg.text : " + msg.text);
	}
	msg.onend = function () {
		speakfalg = 0;
		function load_js() {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'assets/speak.js';
			head.appendChild(script);
		}
		load_js();
	};
}