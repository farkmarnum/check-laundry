from collections import deque
import sys

import numpy as np
import sounddevice as sd

import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

from config import MIC_NAME, MAX_BUFFER_SIZE

colors = 'bgrcm'

def setup():
    microphones = [s for s in sd.query_devices() if s['name'] == MIC_NAME]
    if len(microphones) < 1:
        sys.exit("Microphones not found.")

    device_indices = [int(s['index']) for s in microphones]
    samplerate = int(microphones[0]['default_samplerate'])
    buffers = {}
    animations = []

    def create_audio_callback(id):
        buffer = deque(maxlen=MAX_BUFFER_SIZE)
        buffers[str(id)] = buffer

        class Visualiser:
            def __init__(self):
                self.fig, self.ax = plt.subplots()
                self.ln, = plt.plot([], [], colors[id])

            def plot_init(self):
                return self.ln

            def update_plot(self, _frame):
                self.ax.plot(range(len(buffer)), buffer, colors[id])
                return self.ln

        vis = Visualiser()
        ani = FuncAnimation(vis.fig, vis.update_plot, init_func=vis.plot_init)
        animations.append(ani)

        def audio_callback(indata, _frames, _time, _status):
            volume_norm = np.linalg.norm(indata)
            buffer.append(volume_norm)

        return audio_callback

    streams = {
        [str(index)]: sd.InputStream(
            device=index,
            channels=1,
            samplerate=samplerate,
            blocksize=samplerate, # 1 second
            callback=create_audio_callback(index),
        ) for index in device_indices
    }

    return buffers, streams, animations
