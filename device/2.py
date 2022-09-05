import sounddevice as sd
import numpy as np

MIC_NAME = 'ATR4650-USB'

all_devices = sd.query_devices()
microphones = [s for s in sd.query_devices() if s['name'] == MIC_NAME]
device_indices = [int(s['index']) for s in microphones]

samplerate = microphones[0]['default_samplerate']

def audio_callback_1(indata, frames, time, status):
    volume_norm = np.linalg.norm(indata)*10
    print('1' * int(volume_norm))

def audio_callback_2(indata, frames, time, status):
    volume_norm = np.linalg.norm(indata)*10
    print('2' * int(volume_norm))

stream_1 = sd.InputStream(device=device_indices[0], channels=1, samplerate=samplerate, callback=audio_callback_1)
stream_2 = sd.InputStream(device=device_indices[1], channels=1, samplerate=samplerate, callback=audio_callback_2)

with stream_1, stream_2:
    sd.sleep(10 * 1000)
