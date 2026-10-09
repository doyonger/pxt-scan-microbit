/** Extension ScAN : détection de contacts et DEL indépendantes. */
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
    let contacts: number[] = [ -1, -1, -1, -1, -1, -1 ]
    let leds: number[] = [ -1, -1, -1, -1, -1, -1 ]
    let stable: boolean[] = [ false, false, false, false, false, false ]
    let candidate: boolean[] = [ false, false, false, false, false, false ]
    let changedAt: number[] = [ 0, 0, 0, 0, 0, 0 ]
    const eventSource = 8201
    let started = false
    const debounceMs = 30

    function digital(port: number): DigitalPin {
        return port as DigitalPin
    }

    function valid(n: number): boolean {
        return n >= 1 && n <= count
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
            stable[i] = false
            candidate[i] = false
            changedAt[i] = 0
        }
        if (!started) {
            started = true
            basic.forever(function () {
                const now = input.runningTime()
                for (let i = 0; i < count; i++) {
                    if (contacts[i] < 0) continue
                    const touching = pins.digitalReadPin(digital(contacts[i])) == 0
                    if (touching != candidate[i]) {
                        candidate[i] = touching
                        changedAt[i] = now
                    }
                    if (candidate[i] != stable[i] && now - changedAt[i] >= debounceMs) {
                        stable[i] = candidate[i]
                        if (stable[i]) control.raiseEvent(eventSource, i + 1)
                    }
                }
                basic.pause(10)
            })
        }
    }

    /**
     * Associe les broches du contour métallique et de la DEL à un trou.
     * Pull-up : résistance interne qui maintient le signal à 1 sans contact ; la pince reliée au GND le fait passer à 0.
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
        contacts[i] = c
        leds[i] = d
        stable[i] = false
        candidate[i] = false
        changedAt[i] = input.runningTime()
        pins.setPull(digital(c), PinPullMode.PullUp)
        pins.digitalWritePin(digital(d), 0)
    }

    /** Déclenche un événement une fois par contact ; les sons ne bloquent pas la surveillance. */
    //% block="lorsque le trou %trou est touché"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% draggableParameters=false
    //% weight=80
    export function lorsqueTouche(trou: number, handler: () => void): void {
        if (trou >= 1 && trou <= 6) control.onEvent(eventSource, trou, handler)
    }

    /** Indique si la pince touche actuellement ce contour (après filtrage). */
    //% block="le trou %trou est touché ?"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% weight=70
    export function estTouche(trou: number): boolean {
        return valid(trou) && stable[trou - 1]
    }

    /** Allume ou éteint la DEL associée au trou. */
    //% block="mettre la DEL du trou %trou à %allumee"
    //% trou.min=1 trou.max=6 trou.defl=1
    //% allumee.shadow=toggleOnOff
    //% weight=60
    export function mettreDel(trou: number, allumee: boolean): void {
        if (!valid(trou)) return
        const p = leds[trou - 1]
        if (p >= 0) pins.digitalWritePin(digital(p), allumee ? 1 : 0)
    }

    /** Éteint toutes les DEL configurées. */
    //% block="éteindre toutes les DEL"
    //% weight=50
    export function eteindreTout(): void {
        for (let i = 0; i < count; i++) {
            if (leds[i] >= 0) pins.digitalWritePin(digital(leds[i]), 0)
        }
    }
}
