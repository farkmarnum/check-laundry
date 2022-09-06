#!/bin/bash

set -e

# Add necessary system packages
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install \
  python3-venv \
  libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev \
  libatlas-base-dev

# Set up virtual environment
rm -rf .venv
python3 -m venv .venv

# Install Python packages
. .venv/bin/activate
pip install -r requirements.txt
