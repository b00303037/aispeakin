import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecorderService {
  context?: AudioContext;
  ws?: WebSocket;
  wsUrl: string = 'wss://stt.ubestream.com/wssapi/';
  relayNode?: AudioWorkletNode;
  audioData?: {
    size: number;
    buffer: Float32Array[];
    inputSampleRate: number;
    inputSampleBits: number;
    outputSampleRate: number;
    outputSampleBits: number;
    input: (data: number[]) => void;
    clear: () => void;
    encodeHeaderlessWavData: () => Promise<ArrayBuffer>;
  };

  recording$ = new BehaviorSubject<boolean>(false);

  private _APIKey?: string = '';
  private _candidates: string[] = ['zh', 'en', 'ja'];
  private _main_lang: string = 'zh';
  private _target_lang: string = 'en';
  private _log_name: string = '';
  private _prefix: number = 0;

  get main_lang(): string {
    return this._main_lang;
  }
  get prefix(): number {
    return this._prefix;
  }
  set APIKey(APIKey: string) {
    this._APIKey = APIKey;
  }
  set candidates(candidates: string[]) {
    this._candidates = candidates;
  }
  set main_lang(main_lang: string) {
    this._main_lang = main_lang;
  }
  set target_lang(target_lang: string) {
    this._target_lang = target_lang;
  }
  set log_name(log_name: string) {
    this._log_name = log_name;
  }

  startRecording(callback: Function): void {
    if (this.recording$.getValue()) {
      return;
    }

    this.recording$.next(true);

    if (this.context === undefined) {
      this.initAudioContext()
        .then(() => {
          this.startMic(callback);
        })
        .catch((error) => {
          console.error(error);

          this.stopRecording();
        });
    } else {
      this.startMic(callback);
    }
  }

  stopRecording(): void {
    if (this.ws !== undefined) {
      this.ws.close();
      this.ws = undefined;
    }

    if (this.relayNode !== undefined) {
      this.relayNode.port.postMessage('stop');
      this.relayNode = undefined;
    }

    this.recording$.next(false);
  }

  private initAudioContext(): Promise<void> {
    this.context = new AudioContext();

    return this.context.audioWorklet.addModule('assets/relay-worklet.js');
  }

  private startMic(callback: Function): void {
    if (navigator.mediaDevices === undefined) {
      this.stopRecording();

      window.alert('Browser not supported');

      return;
    }

    this._prefix++;
    this.newWebSocket(callback);

    navigator.mediaDevices
      .getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          autoGainControl: true,
          noiseSuppression: true,
        },
      })
      .then((stream: MediaStream) => this.thenFunc(stream))
      .catch((error) => {
        this.stopRecording();

        window.alert(error);
      });
  }

  private newWebSocket(callback: Function): void {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.binaryType = 'arraybuffer';
    this.ws.ACCEPTED = false;

    this.ws.addEventListener('open', () => {
      this.ws?.send(
        JSON.stringify({
          token: this._APIKey,
          candidates: this._candidates,
          main_lang: this._main_lang,
          target_lang: this._target_lang,
          log_name: this._log_name,
        })
      );
    });

    this.ws.addEventListener('message', (message: MessageEvent<string>) => {
      if (this.ws !== undefined && !this.ws.ACCEPTED) {
        if (message.data === 'OK') {
          this.ws.ACCEPTED = true;
        } else {
          this.ws.close();
        }

        return;
      }

      callback(message.data);
    });
  }

  private thenFunc(stream: MediaStream): void {
    const _this = this;

    if (this.context === undefined) {
      return;
    }

    this.audioData = {
      size: 0, // 錄音文件長度
      buffer: [], // 錄音緩存
      inputSampleRate: this.context.sampleRate, // 輸入採樣率
      inputSampleBits: 16, // 輸入採樣數位 8, 16
      outputSampleRate: 16000, // 輸出採樣率
      outputSampleBits: 16, // 輸出採樣數位 8, 16
      input: function (data: number[]) {
        this.buffer.push(new Float32Array(data));
        this.size += data.length;
      },
      clear: function () {
        this.size = 0;
        this.buffer = [];
      },
      encodeHeaderlessWavData: async function () {
        let bytes: Float32Array;

        {
          const data = new Float32Array(this.size);
          let offset = 0;

          for (let i = 0; i < this.buffer.length; i++) {
            data.set(this.buffer[i], offset);
            offset += this.buffer[i].length;
          }

          bytes = data;
        }

        const source = _this.context!.createBuffer(
          1,
          bytes.length,
          this.inputSampleRate
        );
        source.copyToChannel(bytes, 0);

        const offlineCtx = new OfflineAudioContext(
          source.numberOfChannels,
          source.duration * this.outputSampleRate,
          this.outputSampleRate
        );

        const offlineSource = offlineCtx.createBufferSource();
        offlineSource.buffer = source;
        offlineSource.connect(offlineCtx.destination);
        offlineSource.start();

        const ab = await offlineCtx.startRendering();
        const bytes2 = ab.getChannelData(0);
        const dataLength = bytes2.length * (this.outputSampleBits / 8);
        const buffer = new ArrayBuffer(dataLength);
        const data = new DataView(buffer);
        let offset = 0;

        if (this.outputSampleBits === 8) {
          for (let i = 0; i < bytes2.length; i++, offset += 1) {
            const s = Math.max(-1, Math.min(1, bytes2[i]));
            const val =
              255 / (65535 / ((s < 0 ? s * 0x8000 : s * 0x7fff) + 32768));

            data.setInt8(offset, val);
          }
        } else {
          for (let i = 0; i < bytes2.length; i++, offset += 2) {
            const s = Math.max(-1, Math.min(1, bytes2[i]));
            const val = s < 0 ? s * 0x8000 : s * 0x7fff;

            data.setInt16(offset, val, true);
          }
        }

        return buffer;
      },
    };

    const micNode = this.context.createMediaStreamSource(stream);

    this.relayNode = new AudioWorkletNode(this.context, 'relay-worklet');

    this.relayNode.port.onmessage = (message: MessageEvent<number[][]>) => {
      (async () => {
        if (
          this.audioData === undefined ||
          this.ws === undefined ||
          this.ws.readyState !== 1 ||
          !this.ws.ACCEPTED
        ) {
          return;
        }

        for (let d of message.data) {
          this.audioData.input(d);
        }

        let buff = await this.audioData.encodeHeaderlessWavData();

        this.audioData.clear();
        this.ws.send(buff);
      })()
        .then((error) => {})
        .catch((error) => {});
    };

    micNode.connect(this.relayNode).connect(this.context.destination);
  }
}
