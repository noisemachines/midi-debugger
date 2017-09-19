import stream from 'mithril/stream'
import dfs from 'date-fns'

const format = dfs.format
const events = stream([])
events.push = (...args) => events(events().concat(args))

const Midi = {
  enable : (options = {}) => {
    navigator.requestMIDIAccess(options)
      .then((access) => {
        Midi.inputs(access.inputs.values())
        Midi.outputs(access.outputs.values())
        access.onstatechange = (e) => {
          console.log(e)
          events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } ${ e.port.name } ${ e.port instanceof MIDIInput ? 'input' : 'output' } ${ e.port.state }, I/O available: ${ access.inputs.size }/${ access.outputs.size }`)
          Midi.inputs(access.inputs.values())
          Midi.outputs(access.outputs.values())
        }
      })
      .catch((err) => {
        events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } requestMIDIAccess error: ${ err.message }`)
        Midi.error = err
      })
  },
  events,
  permission : stream(),
  inputs     : stream(),
  outputs    : stream(),
}

Midi.inputs.map((inputs) => {
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = (message) => { events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } ${ message.data }`); console.log(message) }
  }
})
Midi.outputs.map((outputs) => {
  for (var output = outputs.next(); output && !output.done; output = outputs.next()) {
    output.value.onmidimessage = (message) => { events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } ${ message.data }`); console.log(message) }
  }
})

if (!navigator.requestMIDIAccess) {
  let err = new Error('WebMIDI is not supported in this browser')
  err.recoverable = false
  events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } WebMIDI is not supported in this browser`)
  Midi.error = err
} else {
  navigator.permissions.query({ name : 'midi' })
    .then((status) => {
      Midi.permission(status.state)
      status.onchange = () => Midi.permission(status.state)
    })
}

Midi.permission.map((state) => {
  events.push(`${ format(new Date(), 'HH:mm:ss.SSS') } Midi permission is ${ state }`)
  if (state === 'denied')
    Midi.error = new Error('Midi permission is denied')
})

export default Midi
