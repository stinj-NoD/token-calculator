# Calculateur de tokens IA — 2026

**Version actuelle : 1.2.0** — voir [`CHANGELOG.md`](CHANGELOG.md) pour l'historique complet des versions.

Application web mono-fichier pour estimer le nombre de tokens et le coût d'un texte sur les principaux modèles IA 2026 : Claude / Claude Code, ChatGPT / Codex, Gemini, GitHub Copilot, xAI Grok, Moonshot AI Kimi, Mistral AI et DeepSeek.

**Usage** : ouvrir `index.html` directement dans un navigateur (double-clic), ou visiter [la page publiée sur GitHub Pages](https://stinj-nod.github.io/token-calculator/).

Aucun build, aucune dépendance à installer — seule ressource externe : le tokenizer OpenAI `o200k_base` chargé depuis un CDN pour un comptage exact sur ChatGPT/Codex (les autres fournisseurs sont approximés via ce même tokenizer, faute de tokenizer public).

## Fonctionnalités

- Comptage de tokens réel (OpenAI) ou estimé (autres fournisseurs) avec coût par modèle et niveau d'effort/raisonnement, pour 8 familles d'IA.
- Filtres d'affichage par fournisseur (préférence mémorisée) et vue tableau comparatif classant tous les modèles par coût pour le texte courant.
- Simulateur de conversation multi-tours : estime le coût cumulé d'un échange complet avec accumulation du contexte, tour après tour.
- Suivi de consommation réelle et budget mensuel, avec historique journalier et alerte de dépassement.
- Prix et modèles chargés depuis [`data/providers.json`](data/providers.json) — toujours à jour sur la version publiée en ligne.
- Traçabilité des prix : chaque modèle affiche un badge de fraîcheur (vert/orange/rouge selon l'ancienneté de la dernière vérification), un lien direct vers la page de tarification officielle du fournisseur, et un panneau « Historique des prix » consultable depuis chaque carte, alimenté par [`data/price-history.json`](data/price-history.json).
- Import de fichiers texte/code (glisser-déposer ou sélection).
- Export des résultats en JSON ou CSV, et lien partageable.
- Historique des calculs conservé localement dans le navigateur.
- Mode "résultat brut" (`?raw=1` en complément d'un lien partageable) qui affiche uniquement un bloc JSON copiable — utile pour un script pilotant un navigateur automatisé (Playwright/Puppeteer). Ce n'est **pas** une vraie API serveur : la page reste un fichier statique, ce mode ne fait qu'en simplifier la lecture programmatique.

## Mettre à jour les prix

Suivre cette checklist à chaque changement de prix, dans l'ordre :

1. **Historique** : ajouter une entrée dans [`data/price-history.json`](data/price-history.json) (clé = `id` du modèle) avec la date du jour, le nouveau prix et un `sourceUrl` vers l'annonce/la page officielle.
2. **Données courantes** : éditer [`data/providers.json`](data/providers.json) **et** la copie `FALLBACK_DATA` en tête du `<script>` de `index.html` (utilisée uniquement si le fichier JSON ne peut pas être chargé, par exemple en ouverture locale `file://`) — mettre à jour `priceIn`/`priceOut`, `sourceUrl` et `verifiedOn` (date du jour) pour chaque modèle concerné. Une CI GitHub Actions ([`.github/workflows/check-fallback-sync.yml`](.github/workflows/check-fallback-sync.yml)) vérifie automatiquement que les deux fichiers restent synchronisés sur chaque pull request.
3. **Version** : incrémenter au moins le PATCH de `APP_VERSION` dans `index.html` et ajouter une ligne dans [`CHANGELOG.md`](CHANGELOG.md) (section « Prix mis à jour »).

Puis commit + push — la page publiée reflète automatiquement la dernière version au prochain chargement.

## Publier une nouvelle version

Ce projet n'a pas de build ni de `package.json` : le numéro de version est une simple constante `APP_VERSION` dans `index.html`, suivant un schéma [SemVer](https://semver.org/lang/fr/) simplifié documenté en tête de [`CHANGELOG.md`](CHANGELOG.md).

1. Mettre à jour `const APP_VERSION = "X.Y.Z";` dans `index.html`.
2. Mettre à jour `const CACHE_NAME = "tokencalc-vX.Y.Z";` dans `sw.js` (sinon les utilisateurs hors-ligne restent bloqués sur l'ancien cache du service worker).
3. Mettre à jour la mention « Version actuelle » en tête de ce `README.md`.
4. Ajouter une entrée correspondante dans `CHANGELOG.md`.
5. Committer tous ces changements ensemble, puis taguer le commit : `git tag -a vX.Y.Z -m "..."` et `git push --tags`.

## Licence

Projet libre et gratuit, publié sous licence [MIT](LICENSE).
