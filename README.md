# Portfolio Full-Stack (React + Node.js + MongoDB)

Portfolio développeur **full-stack polyvalent** (MERN, Django, React Native/Expo, WordPress...) avec
espace d'administration sécurisé permettant de :

- Ajouter / modifier / supprimer des **projets** (image, technologies, lien GitHub, lien démo)
- Ajouter / modifier / supprimer des **compétences/technologies** avec **logo**, catégorie et niveau de maîtrise
- Mettre à jour le **CV** (le nouveau remplace l'ancien sur le bouton "Télécharger le CV")
- Recevoir les **messages de contact** (nom complet, email, WhatsApp/téléphone, service souhaité) — enregistrés en
  base ET envoyés par email

## Design
- Thème sombre, élégant, inspiré d'un éditeur de code mais sobre (pas de "gradient violet IA" générique)
- Palette : émeraude (`#34D399`) + or (`#FBBF24`) sur fond anthracite
- Animations légères au scroll (fade + translation), bandeau défilant des technologies, hover dynamiques
- Entièrement responsive (mobile, tablette, desktop)

## Structure
```
portfolio/
├── backend/   → API Express + MongoDB (Mongoose) + sécurité (helmet, rate-limit, validation)
└── frontend/  → React (Vite) + Tailwind CSS + lucide-react (icônes)
```

---

## 1. Installation du backend

```bash
cd backend
npm install
cp .env.example .env
```

### Base de données MongoDB
**Option A — MongoDB local** :
```
MONGO_URI=mongodb://localhost:27017/portfolio
```

**Option B — MongoDB Atlas (gratuit, recommandé)** :
1. Crée un compte sur https://www.mongodb.com/cloud/atlas
2. Crée un cluster gratuit (M0)
3. Database Access → crée un utilisateur + mot de passe
4. Network Access → "Allow access from anywhere" (0.0.0.0/0) pour commencer
5. Connect → "Drivers" → copie l'URL :
```
MONGO_URI=mongodb+srv://utilisateur:motdepasse@cluster0.xxxxx.mongodb.net/portfolio
```

### Fichier `.env` complet (backend)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://utilisateur:motdepasse@cluster0.xxxxx.mongodb.net/portfolio
JWT_SECRET=une_chaine_aleatoire_tres_longue_et_secrete
ADMIN_EMAIL=ton_email@gmail.com
ADMIN_PASSWORD=UnMotDePasseFort123!
CLIENT_URL=http://localhost:5173

SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ton_email@gmail.com
SMTP_PASS=motdepasseapplication16caracteres
NOTIFY_EMAIL=ton_email@gmail.com
```

Génère un `JWT_SECRET` aléatoire :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Créer le compte admin et lancer le serveur
```bash
npm run seed     # crée le compte admin (une seule fois)
npm run dev      # API sur http://localhost:5000
```

---

## 2. Installation du frontend

```bash
cd frontend
npm install
npm run dev      # site sur http://localhost:5173
```

Le frontend redirige automatiquement `/api` et `/uploads` vers le backend (voir `vite.config.js`).

---

## 3. Configuration complète des emails (recevoir les messages de contact)

Chaque message du formulaire de contact est enregistré en base (visible dans l'admin, onglet `messages.js`)
**et** envoie un email de notification avec : nom complet, email, téléphone/WhatsApp, service souhaité et message.

### Avec Gmail (recommandé)
**Étape 1 — Activer la validation en 2 étapes**
1. https://myaccount.google.com/security
2. "Validation en deux étapes" → active-la avec ton téléphone

**Étape 2 — Créer un mot de passe d'application**
1. https://myaccount.google.com/apppasswords
2. Nom de l'app : `Portfolio`
3. Google génère un code à 16 caractères (ex: `abcd efgh ijkl mnop`)
4. Copie-le **sans les espaces** → c'est `SMTP_PASS`

**Étape 3 — `.env`**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=ton_email@gmail.com
SMTP_PASS=abcdefghijklmnop
NOTIFY_EMAIL=ton_email@gmail.com
```

### Alternative Outlook / Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=ton_email@outlook.com
SMTP_PASS=ton_mot_de_passe
NOTIFY_EMAIL=ton_email@outlook.com
```

### Tester sans envoyer de vrais emails (Mailtrap)
1. Compte gratuit sur https://mailtrap.io
2. Inbox → SMTP Settings → copie les identifiants
```env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=ton_user_mailtrap
SMTP_PASS=ton_pass_mailtrap
NOTIFY_EMAIL=ton_email@gmail.com
```

Si les variables `SMTP_*` ne sont pas configurées, les messages restent enregistrés et visibles dans
l'admin — seul l'email de notification ne sera pas envoyé.

---

## 4. Connexion à l'espace admin

Va sur `http://localhost:5173/admin/login` et connecte-toi avec `ADMIN_EMAIL` / `ADMIN_PASSWORD` (créés via `npm run seed`).
Ce lien n'est volontairement pas affiché sur le site public — garde-le pour toi.

Depuis l'espace admin :
- **projets.js** : ajoute tes projets (capture d'écran, technologies, liens GitHub/démo, mise en avant "phare")
- **competences.js** : ajoute chaque techno apprise avec son **logo** (image), une catégorie
  (Frontend, Backend, Base de données, DevOps, Outils...) et un niveau de maîtrise
- **cv.js** : uploade un nouveau CV en PDF — il remplace automatiquement l'ancien
- **messages.js** : consulte les messages reçus via le formulaire de contact

---

## 5. Personnalisation

- Remplace "Votre Nom" dans `frontend/src/components/Hero.jsx`
- Adapte le texte "À propos" dans `frontend/src/pages/Home.jsx` (section `about`) à ton parcours réel
- La liste de technologies du bandeau défilant se modifie dans `stackBadges` (`Hero.jsx`)
- Couleurs : `frontend/tailwind.config.js` (variables `accent` = émeraude, `accent2` = or)
- Polices : Space Grotesk (titres), Inter (texte), JetBrains Mono (code) — chargées dans `index.html`

---

## 6. Déploiement

- **Backend** : Render, Railway ou VPS. Utilise MongoDB Atlas en production. Mets `NODE_ENV=production`.
- **Frontend** : `npm run build` puis déploie `dist/` sur Vercel ou Netlify.
- Mets à jour `CLIENT_URL` (backend) avec l'URL réelle du frontend déployé (CORS), et l'URL de l'API côté frontend si besoin.
- Utilise HTTPS en production (obligatoire pour les cookies/headers sécurisés).

---

## 7. Sécurité — ce qui est déjà en place

- Mots de passe admin **hashés** avec bcrypt, jamais stockés en clair
- Authentification par **JWT** (expiration 7 jours), aucune inscription publique (un seul compte créé via `npm run seed`)
- **Helmet** : en-têtes HTTP sécurisés
- **express-mongo-sanitize** : protection contre les injections NoSQL
- **express-validator** : validation stricte des données entrantes (email, longueur des champs...)
- **Rate limiting** :
  - 10 tentatives de connexion admin / 15 min (anti brute-force)
  - 5 messages de contact / heure / IP (anti-spam)
  - 300 requêtes API / 15 min (protection générale)
- **CORS** restreint au domaine du frontend (`CLIENT_URL`)
- Upload de fichiers limité par type et taille (images ≤ 5 Mo pour les projets, ≤ 2 Mo pour les logos, CV en PDF ≤ 10 Mo uniquement)
- Emails de notification : contenu utilisateur échappé (anti-injection HTML)
- Messages d'erreur génériques en production (pas de fuite de stack trace)

**Bonnes pratiques à respecter** :
- Ne commite jamais ton fichier `.env`
- Change `JWT_SECRET` et `ADMIN_PASSWORD` avant la mise en production
- Active HTTPS en production
