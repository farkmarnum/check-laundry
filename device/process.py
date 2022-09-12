import json
import time
import copy
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

def process(states, buffers):
    now = int(time.time() * 1000)

    new_states = copy.deepcopy(states)
    new_data = {}

    for (id, buffer) in buffers.items():
        if len(buffer) < MIN_BUFFER_LENGTH:
            continue

        average_loudness = sum(buffer) / len(buffer)
        new_state = 'on' if average_loudness > LOUDNESS_THRESHOLD else 'off'

        # If the state of this unit has changed, add it to new_data & update _states
        # Or, if it's been long enough since our last update, send the data anyway
        if (
            id not in new_states or
            new_states[id]['state'] != new_state
            or new_states[id]['timestamp'] - now > MAX_TIME_BETWEEN_UPDATES_MS
        ):
            # TODO: remove this debugging
            if id not in new_states:
                print(f'{id} was not in {new_states}')
            elif new_states[id]['state'] != new_state:
                print(f"_states[id]['state'] = {new_states[id]['state']}, new_state = {new_state}")
            else:
                print(f"_states[id]['timestamp'] = {new_states[id]['timestamp']}, now = {now}, diff = {new_states[id]['timestamp'] - now}, MAX_TIME_BETWEEN_UPDATES={MAX_TIME_BETWEEN_UPDATES_MS}")

            d = { 'state': new_state, 'timestamp': now }
            new_data[id] = d
            new_states[id] = d

    # If some state has changed, send it to the backend
    if len(new_data) > 0:
        notify(new_data)
    
    return new_states
