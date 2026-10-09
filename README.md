# ScAN micro:bit — prototype 0.1

Extension MakeCode pour 1 à 6 trous. Chaque contour métallique est raccordé à une entrée choisie par l'élève ; la pince déjà câblée se branche à un connecteur noir GND de la sensor:bit. Chaque DEL est reliée à une sortie choisie.

## Utilisation

1. Placer `initialiser ScAN avec 6 trous` au démarrage.
2. Ajouter un bloc `configurer trou ... contact ... DEL ...` pour chaque trou utilisé.
3. Ajouter les événements `lorsque le trou ... est touché` et programmer DEL, son, score, etc.
4. L'extension désactive la matrice 5×5 et exclut P5/P11 des choix de ports.

## Points à vérifier sur le matériel

- Prototype non compilé ni testé sur la micro:bit réelle.
- Tester les broches partagées avec d'autres fonctions (I²C, matrice, audio) et la compatibilité exacte avec la sensor:bit.
- La protection contre les ports en double refuse silencieusement la configuration conflictuelle : une indication plus explicite serait souhaitable dans une version ultérieure.
- Les numéros de trous sont saisis comme nombres 1–6 ; le contrôle à l'exécution ignore les valeurs hors limites.
- Les DEL sont supposées actives à l'état haut (à vérifier avec EF04063).
- L'écran OLED EF03155 n'est pas géré par cette extension.

## Installation (après publication)

Publier ce dossier dans un dépôt GitHub public, puis ajouter l'extension par son URL GitHub dans MakeCode micro:bit. La publication et les essais matériels restent à faire.
