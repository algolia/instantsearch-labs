class ChromeAPI {
  constructor() {
    this.recognition = null;
  }

  configureAPI(mic, searchInput, wave, initOptions, transcripting) {
    this.recognition = new webkitSpeechRecognition();

    this.recognition.interimResults = true;

    this.recognition.onresult = function(event) {
      let query = event.results[0][0].transcript;
      initOptions.helper.setQuery(query).search(); //Set the query and search
      setTimeout(function(){
        mic.innerHTML = '<i class="fas fa-microphone"></i>';
        wave.classList.add("hidden");
        searchInput.style.paddingLeft = "10px";
        transcripting.state = false;
      }, 1000);
      searchInput.value = query;
    };
  }

  startTranscription(mic, searchInput) {
    this.recognition.start();
  }

  stopTranscription(){
    this.recognition.stop();
  }
}

export default ChromeAPI;
