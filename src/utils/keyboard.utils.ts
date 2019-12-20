import ks from 'keysym'

export const fetchKeysymbol = (name: string) => {
    return ks.fromName(name)[0].names[0]
}

interface ConvertKeyCodeConfig {
    ctrl: boolean
    shift: boolean
}

const mappings = {
    32: 'space',
    13: 'Return',
    8: 'BackSpace',
    38: 'Up',
    40: 'Down',
    37: 'Left',
    39: 'Right'
}

export const convertKeyCode = (code: number, { ctrl, shift }: ConvertKeyCodeConfig) => {
    let char = String.fromCharCode(code)

    if(!shift)
        char = char.toLowerCase()

    if(code == 32)
        char = 'space'
    else if(code == 13)
        char = 'Return'
    else if(code == 8)
        char = 'BackSpace'
    else if(code == 38)
        char = 'Up'
    else if(code == 40)
        char = 'Down'
    else if(code == 37)
        char = 'Left'
    else if(code == 39)
        char = 'Right'
    else if(code == 190)
        if(shift)
            char = 'greater'
        else
            char = 'period'
    else if(code == 188)
        if(shift)
            char = 'less'
        else
            char = 'comma'
    else if(code == 186)
        if(shift)
            char = 'colon'
        else
            char = 'semicolon'
    else if(code == 222)
        if(shift)
            char = 'quotedbl'
        else
            char = 'apostrophe'
    else if(code == 191)
        if(shift)
            char = 'question'
        else
            char = 'slash'
    else if(code == 13)
        char = 'Return'
    else if(code == 189)
        if(shift)
            char = 'underscore'
        else
            char = 'minus'
    else if(code == 187)
        if(shift)
            char = 'plus'
        else
            char = 'equal'
    else if(code == 219)
        if(shift)
            char = 'braceleft'
        else
            char = 'bracketleft'
    else if(code == 221)
        if(shift)
            char = 'braceright'
        else
            char = 'bracketright'
    else if(code == 220)
        if(shift)
            char = 'bar'
        else
            char = 'backslash'

    if(shift)
        if(char == '1')
            char = 'exclam'
        else if(char == '2')
            char = 'at'
        else if(char == '3')
            char = 'numbersign'
        else if(char == '4')
            char = 'dollar'
        else if(char == '5')
            char = 'percent'
        else if(char == '6')
            char = 'upcaret'
        else if(char == '7')
            char = 'ampersand'
        else if(char == '8')
            char = 'asterisk'
        else if(char == '9')
            char = 'parenleft'
        else if(char == '0')
            char = 'parenright'

    if(ctrl)
        if(char == 'c')
            char = 'ctrl+c'
        else if(char == 'x')
            char = 'ctrl+x'
        else if(char == 'v')
            char = 'ctrl+v'
        else if(char == 'a')
            char = 'ctrl+a'
        

    return char
}
