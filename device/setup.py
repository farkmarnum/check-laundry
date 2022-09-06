from collections import deque
import sys

import numpy as np
import sounddevice as sd

from config import MIC_NAME, MAX_BUFFER_SIZE

def setup():
    microphones = [s for s in sd.query_devices() if MIC_NAME in s['name']]
    if len(microphones) < 1:
        sys.exit("Microphones not found.")

    device_indices = [int(s['index']) for s in microphones]
    samplerate = int(microphones[0]['default_samplerate'])
    buffers = {}
    animations = []

    def create_audio_callback(id):
        buffer = deque(maxlen=MAX_BUFFER_SIZE)
        buffers[str(id)] = buffer

        def audio_callback(indata, _frames, _time, _status):
            volume_norm = np.linalg.norm(indata) # Sort of a loudness calculation 🤷
            print(f'volume for {id} = {volume_norm}')
            buffer.append(volume_norm)

        return audio_callback

    streams = {
        str(index): sd.InputStream(
            device=index,
            channels=1,
            samplerate=samplerate,
            blocksize=samplerate, # 1 second
            callback=create_audio_callback(index),
        ) for index in device_indices
    }

    return buffers, streams, animations
