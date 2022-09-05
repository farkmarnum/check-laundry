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

# def audio_callback_1(indata, _frames, _time, _status):
#     volume_norm = np.linalg.norm(indata)
#     print('1:', volume_norm)

# def audio_callback_2(indata, _frames, _time, _status):
#     volume_norm = np.linalg.norm(indata)
#     print('2:', volume_norm)

# stream_1 = sd.InputStream(device=device_indices[0], channels=1, samplerate=samplerate, callback=audio_callback_1, blocksize=samplerate)
# stream_2 = sd.InputStream(device=device_indices[1], channels=1, samplerate=samplerate, callback=audio_callback_2, blocksize=samplerate)

streams = [
    sd.InputStream(device=index, channels=1, samplerate=samplerate, callback=create_audio_callback(str(index)), blocksize=samplerate) for index in device_indices
]

@profile
def main():
    with contextlib.ExitStack() as stack:
        for mgr in streams:
            stack.enter_context(mgr)

        print(3)
        sd.sleep(10 * 1000)
        print(4)

if __name__ == '__main__':
    main()
    print(buffers)
