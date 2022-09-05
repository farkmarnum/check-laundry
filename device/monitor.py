import contextlib
import numpy as np
import sounddevice as sd

MIC_NAME = 'ATR4650-USB'

all_devices = sd.query_devices()
microphones = [s for s in sd.query_devices() if s['name'] == MIC_NAME]
device_indices = [int(s['index']) for s in microphones]

samplerate = int(microphones[0]['default_samplerate'])

buffers = {}

def create_audio_callback(id):
    buffer = []
    buffers[id] = buffer

    def audio_callback(indata, _frames, _time, _status):
        volume_norm = np.linalg.norm(indata)
        print(id, volume_norm)
        buffer.append(volume_norm)
    
    return audio_callback

streams = [
    sd.InputStream(
        device=index,
        channels=1,
        samplerate=samplerate,
        blocksize=samplerate,
        callback=create_audio_callback(str(index)),
    ) for index in device_indices
]

def main():
    with contextlib.ExitStack() as stack:
        for mgr in streams:
            stack.enter_context(mgr)

        while True:
            sd.sleep(15 * 1000)

if __name__ == '__main__':
    main()
    print(buffers)
