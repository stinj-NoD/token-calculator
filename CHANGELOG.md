# Changelog

Toutes les modifications notables de ce projet sont documentées dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à un schéma de [versionnage sémantique](https://semver.org/lang/fr/) simplifié et géré manuellement (pas de build/`package.json`) :

- **MAJOR** : changement structurel cassant un lien partageable existant ou le format `?raw=1` (ex. renommage de clés JSON).
- **MINOR** : nouvelle fonctionnalité visible (nouveau fournisseur, nouveau panneau, nouvelle vue).
- **PATCH** : mise à jour de prix, correction de bug, ajustement de `proxyFactor`, texte/CSS.

## [1.2.0] - 2026-07-31

### Ajouté
- Bouton de conversion d'affichage $ → € dans l'en-tête : tous les coûts (cartes modèles, vue comparative, historique, simulateur, suivi de budget) peuvent être affichés en euros. Le taux de change (`exchangeRateUSDtoEUR`) est défini dans `data/providers.json` avec sa date de vérification, et le choix de devise est mémorisé (`localStorage`). Les montants restent stockés en dollars en interne ; seule la présentation change.
- Mise à jour automatique quotidienne du taux de change (CI GitHub Actions, `scripts/update-exchange-rate.js`) via l'API gratuite Frankfurter.app (taux officiels Banque Centrale Européenne) — commit automatique uniquement si le taux a changé. Les prix des modèles IA restent en revanche vérifiés manuellement (pas d'API fiable équivalente côté fournisseurs).

## [1.1.0] - 2026-07-31

### Ajouté
- Numéro de version affiché dans l'en-tête de l'application, avec lien vers ce changelog.
- `appVersion` inclus dans le JSON exposé par le mode `?raw=1`.
- Traçabilité des prix : chaque modèle expose désormais un lien `sourceUrl` vers sa page de tarification officielle et une date `verifiedOn` de dernière vérification humaine.
- Badge de fraîcheur par carte modèle (vert/orange/rouge selon l'ancienneté de la dernière vérification).
- Panneau « Historique des prix » par modèle, alimenté par le nouveau fichier `data/price-history.json`.
- Vérification automatique (CI GitHub Actions) de la synchronisation entre `data/providers.json` et la copie `FALLBACK_DATA` embarquée dans `index.html`.

## [1.0.0] - 2026-07-31

### Ajouté
- Première version versionnée de l'application (rétroactive — reprend l'état existant avant l'introduction du versionnage).
- Comptage de tokens réel (OpenAI o200k_base) ou estimé (proxy) pour 8 familles de modèles IA 2026 : Claude, ChatGPT/Codex, Gemini, GitHub Copilot, xAI Grok, Moonshot Kimi, Mistral AI, DeepSeek.
- Vue comparative de tous les modèles triés par coût.
- Simulateur de conversation multi-tours (mode moyennes ou texte réel), avec comparaison cross-fournisseurs.
- Suivi de budget mensuel avec historique journalier et alerte de dépassement.
- Historique des calculs, import de fichiers, export JSON/CSV, lien partageable.
- Mode `?raw=1` pour lecture programmatique par un navigateur automatisé.
- Support hors-ligne (PWA / service worker) et thème clair/sombre persisté.
