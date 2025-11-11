# Déploiement sur GitHub Pages

Ce guide explique comment déployer l'application sur GitHub Pages.

## 📋 Prérequis

1. **Google Cloud Console configuré** (voir GOOGLE_SETUP.md)
2. **Client ID OAuth créé**

## 🔧 Configuration GitHub

### Étape 1: Ajouter le Client ID comme Secret GitHub

1. Allez sur votre dépôt GitHub: https://github.com/HeadFox/cracklist-game
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**
5. Nom: `VITE_GOOGLE_CLIENT_ID`
6. Valeur: Votre Client ID (ex: `123456789-abc.apps.googleusercontent.com`)
7. Cliquez sur **Add secret**

### Étape 2: Configurer Google Cloud Console pour GitHub Pages

Allez sur: https://console.cloud.google.com/apis/credentials?project=divine-beach-477810-p1

Cliquez sur votre **OAuth 2.0 Client ID** et ajoutez:

**Authorized JavaScript origins:**
```
https://headfox.github.io
```

**Authorized redirect URIs:**
```
https://headfox.github.io/cracklist-game/
```

Cliquez sur **Save**.

### Étape 3: Activer GitHub Pages

1. Sur GitHub, allez dans **Settings** → **Pages**
2. Source: **GitHub Actions**

## 🚀 Déployer

### Option 1: Merger vers main (Automatique)

```bash
# Créer une Pull Request depuis la branche actuelle vers main
gh pr create --title "Google Photos Live Converter" --body "Complete implementation"

# Ou merger directement
git checkout main
git merge claude/google-photos-live-converter-011CUz1kbtLzhV2dApQ7ihbr
git push origin main
```

Le déploiement se fera automatiquement via GitHub Actions.

### Option 2: Déclenchement manuel

1. Allez sur **Actions** dans GitHub
2. Sélectionnez le workflow **Deploy to GitHub Pages**
3. Cliquez sur **Run workflow**

## ✅ Vérification

Après le déploiement (environ 2-3 minutes):

1. Allez sur: https://headfox.github.io/cracklist-game/
2. Cliquez sur **Sign in with Google (NEW)**
3. Acceptez les permissions Google Photos
4. L'application devrait fonctionner!

## 🐛 Dépannage

### Le build échoue

- Vérifiez que le secret `VITE_GOOGLE_CLIENT_ID` est bien configuré
- Vérifiez les logs du workflow dans l'onglet Actions

### Erreur OAuth "redirect_uri_mismatch"

- Vérifiez que `https://headfox.github.io/cracklist-game/` est bien dans les redirect URIs
- Assurez-vous qu'il n'y a pas de slash en trop

### Erreur 403 sur l'API

- Vérifiez que l'API Google Photos Library est activée
- Vérifiez que vous êtes ajouté comme utilisateur test
- Vérifiez que les scopes sont bien configurés dans l'écran de consentement

## 📊 Monitoring

Vous pouvez voir les requêtes API dans Google Cloud Console:
https://console.cloud.google.com/apis/api/photoslibrary.googleapis.com/metrics?project=divine-beach-477810-p1
