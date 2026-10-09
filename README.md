# ScAN micro:bit — prototype v0.2

Extension MakeCode pour le jeu ScAN (1 à 6 trous).

## Modifications v0.2
- Événements déclenchés avec `control.raiseEvent` / `control.onEvent` : les sons et pauses des élèves ne bloquent plus la surveillance des autres trous.
- Résistance pull-up activée sur la broche de contact choisie dans chaque bloc `configurer`.
- Filtrage de 30 ms et un événement par contact continu.

## Branchement
- Pince déjà câblée : connecteur Dupont femelle vers GND (noir) de la sensor:bit.
- Chaque contour métallique vers une entrée configurée.
- Chaque DEL vers sa sortie configurée.

## Essai conseillé
1. `initialiser ScAN avec 1 trous` puis `configurer trou 1 contact P1 DEL P2`.
2. `lorsque le trou 1 est touché` → DEL ON, tonalité, DEL OFF.
3. Vérifier que le son se produit uniquement lors d'un nouveau contact.

**Prototype non testé sur matériel réel.** Si aucun événement n'est détecté, tester la lecture brute de P1 avec `pins.digitalReadPin` et vérifier l'initialisation du pull-up.
