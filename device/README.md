# Laundry monitor

This code is meant to run on a Raspberry Pi.


# How it works
It streams audio input from USB microphones, recording the average loudness of each, once per second. 

Then, every 15 seconds, it checks the average loudness across the last 3 minutes. If that's above a threshold, it considers the washer to be 'running', otherwise 'off'.

If that state is different from the previous state, it sends a network request to the backend API.
