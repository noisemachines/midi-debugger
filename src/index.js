import m    from 'mithril'
import midi from './midi'

midi.enable()

window.midi = midi

midi.events.map((evts) => evts.map((evt) => { console.log(evt) }))
midi.events.map(m.redraw)

m.mount(document.body, {
  view : () => midi.events().map((evt) => m('', evt))
})
