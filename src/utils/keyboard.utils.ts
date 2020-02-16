import ks from 'keysym'

export const fetchKeysymbol = (name: string) => {
    return ks.fromName(name)[0].names[0]
}

interface ConvertKeyCodeConfig {
    ctrl: boolean
    shift: boolean
}

export const convertKeyCode = (code: string, { ctrl, shift }: ConvertKeyCodeConfig) => {
    let char = code

    if(code === " ")
        char = 'space'
    else if(code === "Enter")
        char = 'Return'
    else if(code === "Backspace")
        char = 'BackSpace'
    else if(code === "ArrowUp")
        char = 'Up'
    else if(code === "ArrowDown")
        char = 'Down'
    else if(code === "ArrowLeft")
        char = 'Left'
    else if(code === "ArrowRight")
        char = 'Right'
    else if(code === ".")
        char = 'period'
    else if(code === ">")
        char = 'greater'
    else if(code === "<")
        char = 'less'
    else if(code === ",")
        char = 'comma'
    else if(code === ":")
        char = 'colon'
    else if(code === ";")
        char = 'semicolon'
    else if(code === "\"")
        char = 'quotedbl'
    else if(code === "\'")
        char = 'apostrophe'
    else if(code === "?")
        char = 'question'
    else if(code === "/")
        char = 'slash'
    else if(code === "_")
        char = 'underscore'
    else if(code === "-")
        char = 'minus'
    else if(code === "+")
        char = 'plus'
    else if(code === "=")
        char = 'equal'
    else if(code === "[")
        char = 'braceleft'
    else if(code === "{")
        char = 'bracketleft'
    else if(code === "]")
        char = 'braceright'
    else if(code === "}")
        char = 'bracketright'
    else if(code === "|")
        char = 'bar'
    else if(code === "\\")
        char = 'backslash'
    else if(code === "!")
        char = 'exclam'
    else if(code === "@")
        char = 'at'
    else if(code === "#")
        char = 'numbersign'
    else if(code === "$")
        char = 'dollar'
    else if(code === "%")
        char = 'percent'
    else if(code === "^")
        char = 'upcaret'
    else if(code === "&")
        char = 'ampersand'
    else if(code === "*")
        char = 'asterisk'
    else if(code === "(")
        char = 'parenleft'
    else if(code === ")")
        char = 'parenright'
    else if(code === "`")
        char = 'grave'
    else if(code === "~")
        char = 'asciitilde'

    if(ctrl)
        if(char === 'c')
            char = 'ctrl+c'
        else if(char === 'x')
            char = 'ctrl+x'
        else if(char === 'v')
            char = 'ctrl+v'
        else if(char === 'a')
            char = 'ctrl+a'
        else if(char === 'f')
            char = 'ctrl+f'
        

    return char
}
