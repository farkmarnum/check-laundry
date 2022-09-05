FIVE_MINUTES = 60 * 5
LOUDNESS_THRESHOLD = 35

def notify(id, state):
    print(f'{id} => {state}') # TODO

def derive_state_from_buffer(buffer):
    last_five_mins = list(buffer)[-1 * FIVE_MINUTES:]
    average = sum(last_five_mins) / len(last_five_mins)

    if average > LOUDNESS_THRESHOLD:
        return 'running'

    return 'off'

_states = {}

def process(buffers):
    for (id, buffer) in buffers.items():
        if id not in _states:
            _states[id] = 'unknown'
        prev_state = _states[id]

        state = derive_state_from_buffer(buffer)

        if state != prev_state:
            prev_state = state
            notify(id, state)
