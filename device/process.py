import json
from urllib.request import urlopen, Request
from config import API_KEY, API_URL, STATION_ID, MIN_BUFFER_LENGTH

def notify(unit_data):
    headers = { 'api-key': API_KEY, 'Content-Type': 'application/json' }
    data = json.dumps({ 'data': unit_data }).encode('utf-8')

    request = Request(f'{API_URL}/{STATION_ID}', headers=headers, data=data)

    with urlopen(request) as response:
        print(f'Notifing server. Response status = {response.status}')


def process(buffers):
    data = {}

    for (id, buffer) in buffers.items():
        if len(buffer) < MIN_BUFFER_LENGTH:
            continue

        average_loudness = sum(buffer) / len(buffer)
        data[id] = average_loudness

    if len(data) > 0:
        notify(data)
