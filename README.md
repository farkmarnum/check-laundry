# Check Laundry 🤔 🧺

A simple service so I don't have to walk down 2 flights of stairs to see if the washing machines are available.

https://checklaundry.com


# Device

## Hardware
Sensors -> Raspberry Pi -> LTE modem -> Twilio SIM -> Backend

## Software
Basic Python script that uses the `sounddevice` library to process audio input, compute loudness, and periodically update the backend with data.

## Setup
To install, add the code in the `device` folder into `/opt/check-laundry` or somewhere else sensible. Then run this for setup:
```bash
# Add necessary system packages
sudo DEBIAN_FRONTEND=noninteractive apt-get -y install \
  python3-venv \
  libportaudio0 libportaudio2 libportaudiocpp0 portaudio19-dev \
  libatlas-base-dev

# Set up virtual environment
python3 -m venv .venv

# Install Python packages
. .venv/bin/activate
pip install -r requirements.txt
```

Next, you'll want to set up the Pi so that the process runs at startup. Add this to `/etc/rc.local`, right before the `exit 0` line:
```bash
bash -c 'sleep 15 && cd /opt/check-laundry && run.sh' 2>&1 | tee /home/pi/laundry.log &
```

Lastly, you'll need to add an `.env` file for config. Add this to an `.env` file in the same directory as `run.sh`:
```
API_KEY=<your API key here>
API_URL=https://<your domain>/api/v1/status
STATION_ID=<the laundry station ID, your choice>
```

Then, you can reboot the Pi to start the script:
```bash
sudo reboot
```

## Deploying changes to the Pi
```bash
export PI_IP=192.168.1.120 # Connect via ethernet or WiFi, then you can use nmap and/or arp-scan to find the IP
scp -r ./. pi@$PI_IP:/opt/check-laundry
```

Or you could just remove the SD card and load the code onto it that way.


# Backend
Pulumi API (AWS API Gateway + AWS Lambda) -> Pulumi Bucket (AWS S3)

Using S3 for storage instead of a DB since it's so cheap & our needs are minimal.


# Frontend
Basic HTML + CSS + JS frontend, staticly hosted on S3 and served w/ the same API from the backend.


# Cost
The Pi will report the status whenever the state of a unit changes.
  - This request + response is around 10 KB of data (mostly TCP handshake & headers)
  - Assume each washer is used twice each day (so, 2 on events and 2 off events)
  - In addition, we'll want to add a ping to tell the backend that the Pi is still running even if no state changes. We can do that every 2 hrs. (so, 12 events)
  - 16 events * 10KB * 30 days -> 4800KB -> 4.8 MB -> $0.50 per month on Twilio (Super SIM).

The backend will store the data and determine the state.
  - 43,200 lambda invocations = < $1 per month.

We can use S3 as database.
  - storage & transfer costs = < $1 per month.

Total cost: $1-2 per month

🎉 🎉 🎉 
