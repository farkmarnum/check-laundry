from config import MIN_BUFFER_LENGTH, BUFFER_HISTORY_TO_PROCESS, LOUDNESS_THRESHOLD

def notify(id, state):
    print(f'{id} => {state}') # TODO

def derive_state_from_buffer(buffer):
    if len(buffer) < MIN_BUFFER_LENGTH:
        return 'unknown'

    last_chunk = list(buffer)[-1 * BUFFER_HISTORY_TO_PROCESS:]
    average = sum(last_chunk) / len(last_chunk)

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
        print(f'state for {id} = {state}')

        if state != prev_state:
            prev_state = state
            notify(id, state)
