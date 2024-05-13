class RelayWorklet extends AudioWorkletProcessor {
  constructor() {
    super();
    this.chunks = [];
    this.total = 0;
    this._stop = false;
    this.port.onmessage = ({ data }) => {
      if (data == "stop") this._stop = true;
    };
  }

  process(inputs, outputs) {
    if (this._stop) return false;
    const inputChannelData = inputs[0][0];
    //this.port.postMessage(inputChannelData);

    this.chunks.push(inputChannelData.slice(0));
    this.total += inputChannelData.length;
    if (this.total >= 8000) {
      this.port.postMessage(this.chunks);
      this.chunks = [];
      this.total = 0;
    }
    return true;
  }
}

registerProcessor("relay-worklet", RelayWorklet);
