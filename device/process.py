import json
import time
from urllib.request import urlopen, Request
from config import (
    API_KEY,
    API_URL,
    STATION_ID,
    MIN_BUFFER_LENGTH,
    LOUDNESS_THRESHOLD,
    MAX_TIME_BETWEEN_UPDATES_MS
)

# NOTE: unit_data is in the form { <unit_id>: <unit_state> }
def notify(data):
    headers = { 'api-key': API_KEY, 'Content-Type': 'application/json' }
    data = json.dumps({ 'data': data }).encode('utf-8')

    request = Request(f'{API_URL}/{STATION_ID}', method='POST', headers=headers, data=data)

    with urlopen(request) as response:
        print(f'Notifing server. Response status = {response.status}')


_states = {}

def process(buffers):
    now = int(time.time() * 1000)

    new_data = {}

    for (id, buffer) in buffers.items():
        if len(buffer) < MIN_BUFFER_LENGTH:
            continue

        average_loudness = sum(buffer) / len(buffer)
        new_state = 'on' if average_loudness > LOUDNESS_THRESHOLD else 'off'

        # If the state of this unit has changed, add it to new_data & update _states
        # Or, if it's been long enough since our last update, send the data anyway
        if (
            id not in _states or
            _states[id]['state'] != new_state
            or _states[id]['timestamp'] - now > MAX_TIME_BETWEEN_UPDATES_MS
        ):
            # TODO: remove this debugging
            if id not in _states:
                print(f'{id} was not in {_states}')
            elif _states[id]['state'] != new_state:
                print(f"_states[id]['state'] = {_states[id]['state']}, new_state = {new_state}")
            else:
                print(f"_states[id]['timestamp'] = {_states[id]['timestamp']}, now = {now}, diff = {_states[id]['timestamp'] - now}, MAX_TIME_BETWEEN_UPDATES={MAX_TIME_BETWEEN_UPDATES_MS}")

            d = { 'state': new_state, 'timestamp': now }
            new_data[id] = d
            _states[id] = d

    # If some state has changed, send it to the backend
    if len(new_data) > 0:
        notify(new_data)
