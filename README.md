# SchoolIdentity

**Signature :** L'école connectée aux familles.

Socle initial de l'interface web SchoolIdentity, préparé pour être versionné sur GitHub.

## Contenu
- `index.html` : structure de la page d'accueil et accès de démonstration.
- `styles.css` : identité visuelle bleu marine / turquoise.
- `app.js` : interactions de démonstration.
- `manifest.webmanifest` : base de configuration installable (PWA).
- `supabase/schema.sql` : proposition initiale de schéma de données, à auditer et adapter.

## Important
Cette version est une **maquette frontend**, pas encore une application opérationnelle.
Aucun compte réel, paiement, QR code individuel, scan hors ligne ou SMS n'est activé.
Ne saisissez pas de données personnelles d'enfants dans cette version.

## Publication GitHub Pages
1. Créer un dépôt GitHub privé nommé `SchoolIdentity`.
2. Ajouter tous les fichiers de ce dossier à la racine du dépôt.
3. Pour tester via GitHub Pages, activer Pages dans les paramètres du dépôt et choisir la branche `main` et le dossier `/root`.
4. Pour un service public, vérifier les paramètres de confidentialité et ne jamais placer de clé secrète dans le frontend.

## Prochaines étapes techniques
1. Auditer le projet Supabase existant ou créer un projet dédié.
2. Définir les rôles et les politiques RLS.
3. Construire l'inscription parent/enfant et les abonnements.
4. Intégrer un prestataire de paiement avec validation serveur.
5. Générer des QR codes contenant des jetons opaques, jamais des données personnelles.
6. Développer le scan hors ligne et la synchronisation idempotente.
7. Intégrer une passerelle SMS / GSM adaptée aux contraintes Android et iOS.
