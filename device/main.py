import contextlib
from time import sleep

import matplotlib.pyplot as plt

from config import MONITOR_PERIOD
from setup import setup
from monitor import monitor

DEBUG = False

def loop():
    buffers, streams, _animations = setup()

    with contextlib.ExitStack() as stack:
        for mgr in streams:
            stack.enter_context(mgr)

        if DEBUG:
            plt.show() # block the thread and just plot the levels
        else:
            del _animations

        while True:
            sleep(MONITOR_PERIOD)
            monitor(buffers)

if __name__ == '__main__':
    loop()
