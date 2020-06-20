export default function(type, volume) {
  let audio = new Audio()

  switch(type) {
    case 'error': audio.src = this.$audioUrl + 'error.mp3'; break;
    case 'sms':   audio.src = this.$audioUrl + 'sms.mp3'; break;
    case 'bell':  audio.src = this.$audioUrl + 'bell.mp3'; break;
    default:      return;
  }
  if(volume) audio.volume = volume

  audio.play()
}