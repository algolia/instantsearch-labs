class GcpAPI {
  constructor() {
    this.myStream = null;
    this.inputPoint = null;
    this.scriptProcessor = null;

    this.constraints = {
      audio: {
        mandatory: {
          googEchoCancellation: "false",
          googAutoGainControl: "false",
          googNoiseSuppression: "false",
          googHighpassFilter: "false"
        }
      }
    };
  }

  configureAPI(socket, searchInput, initOptions) {
    socket.on("dataFromGCP", data => {
      let query = data;
      initOptions.helper.setQuery(query).search(); //Set the query and search
      searchInput.value = query;
    });
  }

  startTranscription(mic, socket) {
    navigator.mediaDevices
      .getUserMedia(this.constraints)
      .then(stream => {
        this._startRecording(stream, socket);
      })
      .catch(function(err) {
        console.log(err.name + ": " + err.message);
      }); // always check for errors at the end.
  }

  stopTranscription(socket) {
    if (this.myStream) {
      //Stopping the mic
      this.myStream.getAudioTracks()[0].stop();
      this.myStream = null;
      this.scriptProcessor.removeEventListener(
        "audioprocess",
        this._streamAudioData
      );
      socket.emit("endStream", {});
    }
  }

  _startRecording(stream, socket) {
    socket.emit("startStream", {});

    let MyAudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioContext = new MyAudioCtx();

    this.myStream = stream;

    this.inputPoint = audioContext.createGain();
    const microphone = audioContext.createMediaStreamSource(this.myStream);
    const analyser = audioContext.createAnalyser();
    this.scriptProcessor = this.inputPoint.context.createScriptProcessor(
      2048,
      1,
      1
    );

    microphone.connect(this.inputPoint);
    this.inputPoint.connect(analyser);
    this.inputPoint.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputPoint.context.destination);
    this.scriptProcessor.addEventListener(
      "audioprocess",
      this._streamAudioData
    );
    this.scriptProcessor.socketParam = socket;
    this.scriptProcessor.contextParam = this;
  }

  _streamAudioData(e) {
    let socket = e.target.socketParam;
    let that = e.target.contextParam;
    const float32Samples = e.inputBuffer.getChannelData(0);

    socket.emit(
      "audiodata",
      that._downsampleBuffer(float32Samples, 44100, 16000)
    );
  }

  _downsampleBuffer(buffer, sampleRate, outSampleRate) {
    if (outSampleRate === sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw "downsampling rate show be smaller than original sample rate";
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (
        var i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  }
}

export default GcpAPI;
