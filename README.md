# ScAN micro:bit — v0.5

Extension MakeCode pour le jeu ScAN (micro:bit V2 + sensor:bit).

## Principe

- `initialiser(trous)` : désactive la matrice de DEL et prépare 1 à 6 trous.
- `configurer(trou, contact, del)` : mémorise les broches, active le pull-up du contact et éteint la DEL.
- `estTouche(trou)` : lit la broche **uniquement au moment de l'appel** et retourne `true` lorsque la pince reliée à GND touche le contour.
- `mettreDel(trou, allumee)` : commande la DEL du trou.
- `eteindreTout()` : éteint toutes les DEL configurées.

**Aucune boucle de surveillance ni aucun événement de contact dans l'extension.** Les élèves créent leurs propres conditions `si / sinon` dans `toujours`.

## Exemple de test (1 trou)

```typescript
scan.initialiser(1)
scan.configurer(1, scan.PortScAN.P8, scan.PortScAN.P2)
basic.forever(function () {
    if (scan.estTouche(1)) {
        scan.mettreDel(1, true)
    } else {
        scan.mettreDel(1, false)
    }
    basic.pause(20)
})
```

Contour métallique sur P8, pince sur GND, DEL sur P2.

## Notes

- Utiliser des ports distincts pour chaque entrée et sortie. Une configuration avec un port déjà utilisé est ignorée.
- La lecture est immédiate : les rebonds mécaniques ne sont pas filtrés par l'extension.
- Pour un son unique par contact, les élèves devront programmer la détection du passage de « non touché » à « touché ».
- P1 peut interagir avec les fonctions audio sur micro:bit V2; P8 est recommandé pour le premier essai.


## Correction v0.5
Conversion explicite de PortScAN vers DigitalPin pour les lectures, pull-up et sorties DEL.
