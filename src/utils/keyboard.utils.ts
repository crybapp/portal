import ks from 'keysym'

export const fetchKeysymbol = (name: string) : string => {
  return ks.fromName(name)[0].names[0]
}

interface ConvertKeyCodeConfig {
  ctrl: boolean
  shift: boolean
}

export const convertKey = (code: string, { ctrl, shift }: ConvertKeyCodeConfig) : string => {
  let char
  const uCode = 'U00' + code.codePointAt(0).toString(16)

  switch (code) {
  case ' ':
    char = 'space'
    break
  case 'Enter':
    char = 'Return'
    break
  case 'Backspace':
    char = 'BackSpace'
    break
  case 'ArrowUp':
    char = 'Up'
    break
  case 'ArrowDown':
    char = 'Down'
    break
  case 'ArrowLeft':
    char = 'Left'
    break
  case 'ArrowRight':
    char = 'Right'
    break
  case 'PageUp':
    char = 'Page_Up'
    break
  case 'PageDown':
    char = 'Page_Down'
    break
  case 'Shift':
    char = 'Shift_L'
    break
  case 'Meta':
    char = 'Meta_L'
    break
  case 'Alt':
    char = 'Alt_L'
    break
  case 'Control':
    char = 'Control_L'
    break
  case 'Dead':
    char = 'dead_grave'
    break
  default:
    char = (code.length === 1 ? uCode : code)
    break
  }

  if (ctrl && char !== 'Control_L')
    return `ctrl+${char}`

  return char
}
