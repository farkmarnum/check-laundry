#!/bin/bash

set -e

. .venv/bin/activate
python3 main.py 2>&1 | tee /home/pi/laundry.log
