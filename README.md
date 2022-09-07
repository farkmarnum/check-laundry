# Check Laundry 🤔 🧺

A simple service so I don't have to walk down 2 flights of stairs to see if the washing machines are available.

https://checklaundry.com


# Device

## Hardware
Sensors -> Raspberry Pi -> LTE modem -> Twilio SIM -> Backend

## Software
Basic Python script that uses the `sounddevice` library to process audio input, compute loudness, and periodically update the backend with data.


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
