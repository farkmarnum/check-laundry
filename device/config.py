import os
from dotenv import load_dotenv

load_dotenv()

MIC_NAME = 'ATR4650-USB'

MONITOR_PERIOD = 60 # Report status once per minute

MAX_BUFFER_SIZE = 60 # just store the last minute
MIN_BUFFER_LENGTH = 30 # wait to send data until we have at least 30 seconds of it

MAX_TIME_BETWEEN_UPDATES_MS = 60 * 118 * 1000 # Make sure we send updates at least every 2 hrs (minus a few mins for buffer)

LOUDNESS_THRESHOLD = 3.25

API_KEY = os.environ['API_KEY']
API_URL = os.environ['API_URL']
STATION_ID = os.environ['STATION_ID']
