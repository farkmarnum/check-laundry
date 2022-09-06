MIC_NAME = 'ATR4650-USB'

MONITOR_PERIOD = 15 # check every 15 seconds

MAX_BUFFER_SIZE = 60 * 60 * 2 # store the last 2 hours

MIN_BUFFER_LENGTH = 30 # wait to analyze until we have at least 30 seconds

BUFFER_HISTORY_TO_PROCESS = 60 * 3 # average loudness across the last 3 minutes

LOUDNESS_THRESHOLD = 20
