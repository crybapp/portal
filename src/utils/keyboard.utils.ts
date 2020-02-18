import ks from 'keysym'

export const fetchKeysymbol = (name: string) => {
    return ks.fromName(name)[0].names[0]
}

interface ConvertKeyCodeConfig {
    ctrl: boolean
    shift: boolean
}

export const convertKey = (code: string, { ctrl, shift }: ConvertKeyCodeConfig) => {
    let char = code
    let uCode = 'U00' + code.codePointAt(0).toString(16)

    if(ctrl)
        switch(code) {
            case "c":
                return 'ctrl+c'
            case "v":
                return 'ctrl+v'
            case "a":
                return 'ctrl+a'
            case "f":
                return 'ctrl+f'
        }

    switch (code) {
        case " ":
            char = 'space'
            break
        case "Enter":
            char = 'Return'
            break
        case "Backspace":
            char = 'BackSpace'
            break
        case "ArrowUp":
            char = 'Up'
            break
        case "ArrowDown":
            char = 'Down'
            break
        case "ArrowLeft":
            char = 'Left'
            break
        case "ArrowRight":
            char = 'Right'
            break
        case "Shift":
            char = 'Shift_L'
            break
        case "Meta":
            char = 'Meta_L'
            break
        case "Alt":
            char = 'Alt_L'
            break
        case "Tab":
            char = 'Tab'
            break
        case "Control":
            char = 'Control_L'
            break
        case "Dead":
            char = 'dead_grave'
            break
        default:
            char = uCode
    }

    return char
}
