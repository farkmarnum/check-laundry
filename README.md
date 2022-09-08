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
bash -c 'sleep 15 && /opt/check-laundry/run.sh' 2>&1 | tee /home/pi/laundry.log &
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

# Backend
Pulumi API (AWS API Gateway + AWS Lambda) -> Pulumi Bucket (AWS S3)

Using S3 for storage instead of a DB since it's so cheap & our needs are minimal.


# Frontend
Basic HTML + CSS + JS frontend, staticly hosted on S3 and served w/ the same API from the backend.


# Cost

The Pi will report the status once per minute.
  - ~0.25KB of data * 60 mins * 24 hrs * 30 days -> 10800KB -> 10.8 MB -> $1.08 per month on Twilio (Super SIM).

The backend will store the data and determine the state.
  - 43,200 lambda invocations = < $1 per month.

We can use S3 as database.
  - storage & transfer costs = < $1 per month.

Total cost: ~$2 per month (potentially more if data packets from the Pi are larger)

🎉 🎉 🎉 
