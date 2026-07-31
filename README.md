# Calculateur de tokens IA — 2026

Application web mono-fichier pour estimer le nombre de tokens et le coût d'un texte sur les principaux modèles IA 2026 : Claude / Claude Code, ChatGPT / Codex, Gemini, GitHub Copilot, xAI Grok, Moonshot AI Kimi, Mistral AI et DeepSeek.

**Usage** : ouvrir `index.html` directement dans un navigateur (double-clic), ou visiter [la page publiée sur GitHub Pages](https://stinj-nod.github.io/token-calculator/).

Aucun build, aucune dépendance à installer — seule ressource externe : le tokenizer OpenAI `o200k_base` chargé depuis un CDN pour un comptage exact sur ChatGPT/Codex (les autres fournisseurs sont approximés via ce même tokenizer, faute de tokenizer public).

## Fonctionnalités

- Comptage de tokens réel (OpenAI) ou estimé (autres fournisseurs) avec coût par modèle et niveau d'effort/raisonnement, pour 8 familles d'IA.
- Filtres d'affichage par fournisseur (préférence mémorisée) et vue tableau comparatif classant tous les modèles par coût pour le texte courant.
- Simulateur de conversation multi-tours : estime le coût cumulé d'un échange complet avec accumulation du contexte, tour après tour.
- Suivi de consommation réelle et budget mensuel, avec historique journalier et alerte de dépassement.
- Prix et modèles chargés depuis [`data/providers.json`](data/providers.json) — toujours à jour sur la version publiée en ligne.
- Import de fichiers texte/code (glisser-déposer ou sélection).
- Export des résultats en JSON ou CSV, et lien partageable.
- Historique des calculs conservé localement dans le navigateur.
- Mode "résultat brut" (`?raw=1` en complément d'un lien partageable) qui affiche uniquement un bloc JSON copiable — utile pour un script pilotant un navigateur automatisé (Playwright/Puppeteer). Ce n'est **pas** une vraie API serveur : la page reste un fichier statique, ce mode ne fait qu'en simplifier la lecture programmatique.

## Mettre à jour les prix

Éditer [`data/providers.json`](data/providers.json) **et** la copie `FALLBACK_DATA` en tête du `<script>` de `index.html` (utilisée uniquement si le fichier JSON ne peut pas être chargé, par exemple en ouverture locale `file://`), puis commit + push — la page publiée reflète automatiquement la dernière version au prochain chargement.
