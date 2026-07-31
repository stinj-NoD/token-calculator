# Calculateur de tokens IA — 2026

Application web mono-fichier pour estimer le nombre de tokens et le coût d'un texte sur les principaux modèles IA 2026 : Claude / Claude Code, ChatGPT / Codex, Gemini et GitHub Copilot.

**Usage** : ouvrir `index.html` directement dans un navigateur (double-clic), ou visiter la page publiée sur GitHub Pages une fois activée.

Aucun build, aucune dépendance à installer — seule ressource externe : le tokenizer OpenAI `o200k_base` chargé depuis un CDN pour un comptage exact sur ChatGPT/Codex (les autres fournisseurs sont approximés via ce même tokenizer, faute de tokenizer public).

## Fonctionnalités

- Comptage de tokens réel (OpenAI) ou estimé (Claude, Gemini, Copilot) avec coût par modèle et niveau d'effort/raisonnement.
- Prix et modèles chargés depuis [`data/providers.json`](data/providers.json) — toujours à jour sur la version publiée en ligne.
- Import de fichiers texte/code (glisser-déposer ou sélection).
- Export des résultats en JSON ou CSV, et lien partageable.
- Historique des calculs conservé localement dans le navigateur.

## Mettre à jour les prix

Éditer [`data/providers.json`](data/providers.json) puis commit + push — la page publiée reflète automatiquement la dernière version au prochain chargement.
