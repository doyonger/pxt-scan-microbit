/** Extension ScAN : configuration des contacts et des DEL, sans surveillance en arrière-plan. */
//% color=#1676A2 icon="\uf0e7" block="ScAN"
namespace scan {
    export enum PortScAN {
        //% block="P0"
        P0 = 0,
        //% block="P1"
        P1 = 1,
        //% block="P2"
        P2 = 2,
        //% block="P3"
        P3 = 3,
        //% block="P4"
        P4 = 4,
        //% block="P6"
        P6 = 6,
        //% block="P7"
        P7 = 7,
        //% block="P8"
        P8 = 8,
        //% block="P9"
        P9 = 9,
        //% block="P10"
        P10 = 10,
        //% block="P12"
        P12 = 12,
        //% block="P13"
        P13 = 13,
        //% block="P14"
        P14 = 14,
        //% block="P15"
        P15 = 15,
        //% block="P16"
        P16 = 16
    }

    let count = 0
    let contacts: number[] = [-1, -1, -1, -1, -1, -1]
    let leds: number[] = [-1, -1, -1, -1, -1, -1]

    // DigitalPin est une énumération matérielle MakeCode : ses valeurs
    // internes ne sont pas les numéros imprimés sur les broches.
    function digital(port: number): DigitalPin {
        switch (port) {
            case 0: return DigitalPin.P0
            case 1: return DigitalPin.P1
            case 2: return DigitalPin.P2
            case 3: return DigitalPin.P3
            case 4: return DigitalPin.P4
            case 6: return DigitalPin.P6
            case 7: return DigitalPin.P7
            case 8: return DigitalPin.P8
            case 9: return DigitalPin.P9
            case 10: return DigitalPin.P10
            case 12: return DigitalPin.P12
            case 13: return DigitalPin.P13
            case 14: return DigitalPin.P14
            case 15: return DigitalPin.P15
            case 16: return DigitalPin.P16
            default: return DigitalPin.P0
        }
    }

    function valid(trou: number): boolean {
        return trou >= 1 && trou <= count && trou == Math.round(trou)
    }

    function usedElsewhere(port: number, except: number): boolean {
        for (let i = 0; i < 6; i++) {
            if (i != except && (contacts[i] == port || leds[i] == port)) return true
        }
        return false
    }

    /**
     * Prépare le jeu et libère les broches de la matrice 5 × 5.
     * @param trous nombre de trous (1 à 6), eg: 6
     */
    //% block="initialiser ScAN avec %trous trous"
    //% trous.min=1 trous.max=6 trous.defl=6
    //% weight=100
    export function initialiser(trous: number): void {
        led.enable(false)
        count = Math.max(1, Math.min(6, Math.round(trous)))
        for (let i = 0; i < 6; i++) {
            contacts[i] = -1
            leds[i] = -1
        }
    }

    /**
     * Associe les broches du contour et de la DEL. Active automatiquement le pull-up du contact.
     * Pull-up : une résistance interne qui permet de reconnaître si la pince touche le contour métallique (0) ou non (1).
     * @param trou numéro du trou, eg: 1
     */
    //% block="configurer trou %trou contact %contact DEL %del"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% weight=90
    export function configurer(trou: number, contact: PortScAN, del: PortScAN): void {
        if (!valid(trou)) return
        const i = trou - 1
        const c = contact as number
        const d = del as number
        if (c == d || usedElsewhere(c, i) || usedElsewhere(d, i)) return
        // Éteindre l'ancienne DEL si ce trou est reconfiguré.
        if (leds[i] >= 0 && leds[i] != d) pins.digitalWritePin(digital(leds[i]), 0)
        contacts[i] = c
        leds[i] = d
        pins.setPull(digital(c), PinPullMode.PullUp)
        pins.digitalWritePin(digital(d), 0)
    }

    /** Retourne vrai si le contour est relié au GND par la pince. Lecture immédiate, sans balayage permanent. */
    //% block="le trou %trou est touché ?"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% weight=80
    export function estTouche(trou: number): boolean {
        if (!valid(trou)) return false
        const p = contacts[trou - 1]
        if (p < 0) return false
        return pins.digitalReadPin(digital(p)) == 0
    }

    /** Allume ou éteint la DEL associée au trou. */
    //% block="mettre la DEL du trou %trou à %allumee"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% allumee.shadow=toggleOnOff
    //% weight=70
    export function mettreDel(trou: number, allumee: boolean): void {
        if (!valid(trou)) return
        const p = leds[trou - 1]
        if (p >= 0) pins.digitalWritePin(digital(p), allumee ? 1 : 0)
    }

    /** Éteint toutes les DEL configurées. */
    //% block="éteindre toutes les DEL"
    //% weight=60
    export function eteindreTout(): void {
        for (let i = 0; i < count; i++) {
            if (leds[i] >= 0) pins.digitalWritePin(digital(leds[i]), 0)
        }
    }
}
