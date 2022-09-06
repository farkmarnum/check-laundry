import contextlib
from time import sleep
import sounddevice as sd

from config import MONITOR_PERIOD
from setup import setup
from process import process

def loop():
    buffers, streams, _animations = setup()

    with contextlib.ExitStack() as stack:
        for mgr in streams.values():
            stack.enter_context(mgr)

        while True:
            sd.sleep(MONITOR_PERIOD * 1000)
            process(buffers)

if __name__ == '__main__':
    loop()
