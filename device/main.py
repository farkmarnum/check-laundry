import time
import contextlib
import sounddevice as sd

from config import MONITOR_PERIOD
from setup import setup
from process import process

def loop():
    buffers, streams = setup()
    states = {}

    with contextlib.ExitStack() as stack:
        for mgr in streams.values():
            stack.enter_context(mgr)

        while True:
            sd.sleep(MONITOR_PERIOD * 1000)
            states = process(states, buffers)

if __name__ == '__main__':
    # If the script crashes, take a short break and start over:
    while True:
        try:
            loop()
        except Exception as e:
            print(e)
            print("Restarting in 5...")
            time.sleep(5)
