# Check Laundry 🤔 🧺

A simple service so I don't have to walk down 2 flights of stairs to see if the washing machines are available.

https://checklaundry.com


# Device

## Hardware
Sensors -> Raspberry Pi Zero W -> Sixfab 3G-4G/LTE Base Hat -> Tellit ME910C1-WW modem -> Twilio Super SIM -> Backend API

## Software
Basic Python script that uses the `sounddevice` library to process audio input, compute loudness, and periodically update the backend with data.

## Setup
You'll need to set up your Pi to work with your LTE modem. Here are some resources:
- [Twilio](https://www.twilio.com/docs/iot/supersim/getting-started-super-sim-raspberry-pi-sixfab-base-hat)

Copy the source code in the `device` folder into `/opt/check-laundry` on the Pi or somewhere else sensible:
```bash
export PI_IP=<the IP of your PI> # Connect via ethernet or WiFi, then you can use nmap and/or arp-scan to find the IP
cd device
rsync -r --exclude=.git --exclude=.venv --exclude=__pycache__ --exclude=.DS_Store ./ pi@$PI_IP:/opt/check-laundry
```

Setup:
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

Next, you'll want to set up the Pi so that the process runs at startup. Also, we need to make sure the LTE modem gets set up on startup.
Add this to `/etc/rc.local`, right before the `exit 0` line:
```bash
# Start check-laundry process:
bash -c 'sleep 30 && cd /opt/check-laundry && ./run.sh' 2>&1 | tee /home/pi/laundry.log &
```

Lastly, you'll need to add an `.env` file for config. Add this to an `.env` file in the same directory as `run.sh`:
```
API_KEY=<your API key here>
API_URL=https://<your domain>/stationData
STATION_ID=<the laundry station ID, your choice>
```


Then, you can reboot the Pi to start the script:
```bash
sudo reboot
```


# Backend
Pulumi API (AWS API Gateway + AWS Lambda) -> Pulumi Bucket (AWS S3)

We're using S3 for storage instead of a database since it's so cheap & our needs are minimal.


# Frontend
Preact frontend, hosted on S3 and served w/ the same API used for the backend.


# Cost
The Pi will report the status whenever the state of a unit changes.
  - This request + response is around 10 KB of data (mostly TCP handshake & headers)
  - Assume each washer is used twice each day (so, 2 on events and 2 off events)
  - In addition, we'll want to add a ping to tell the backend that the Pi is still running even if no state changes. We can do that every 2 hrs. (so, 12 events)
  - 16 events * 10KB * 30 days -> 4800KB -> 4.8 MB -> $0.50 per month on Twilio (Super SIM).

The backend will store the data and determine the state.
  - 43,200 lambda invocations = ~$0.25 per month.

We can use S3 as database.
  - storage & transfer costs = ~ $0.05 per month.

Twilio Super SIM charges $2/month per active SIM.

Total cost: ~$3 per month

🎉 🎉 🎉 
