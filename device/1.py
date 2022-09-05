import pyaudio
import numpy as np

# CHUNK = 4096 # number of data points to read at a time

p = pyaudio.PyAudio()

devices = [p.get_device_info_by_index(i) for i in range(p.get_device_count())]
mic = [d for d in devices if 'MacBook Pro Microphone' == d['name']][0]

sample_rate = mic['defaultSampleRate']

chunk = sample_rate * (200 / 1000)

stream=p.open(format=pyaudio.paInt16, channels=1, rate=sample_rate, input=True, frames_per_buffer=chunk)

for i in range(10):
    data = np.fromstring(stream.read(chunk),dtype=np.int16)
    print(data)

stream.stop_stream()
stream.close()
p.terminate()
