#!/bin/bash

set -e

git stash
git pull || echo "git pull failed"

# Add necessary system packages
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install \
  python3-venv \
  libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev \
  libatlas-base-dev

# Set up virtual environment if needed
if [ ! -d "./venv" ]; then
  rm -rf .venv
  python3 -m venv .venv
fi

# Install Python packages
. .venv/bin/activate
pip install -r requirements.txt
