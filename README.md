# 🎓 College Emmanuel

College Emmanuel est une application de gestion scolaire conçue pour les établissements de petite et moyenne taille. Elle fournit un tableau de bord moderne permettant la gestion des élèves, enseignants, emplois du temps, notes, communications et administration scolaire.

---

## 📋 Sommaire

- Description
- Fonctionnalités
- Stack technique
- Prérequis
- Installation & démarrage
- Structure du projet
- Variables d'environnement
- Tests
- Contribution
- Licence
- Contact

---

## 📖 Description

College Emmanuel facilite l'administration scolaire en centralisant toutes les opérations essentielles dans une seule plateforme :

- Gestion des élèves
- Gestion des enseignants
- Gestion des classes
- Emplois du temps
- Gestion des notes
- Communication interne
- Tableau de bord administratif

---

## ✨ Fonctionnalités

### Administration
- Tableau de bord analytique
- Gestion des utilisateurs
- Gestion des rôles et permissions

### Élèves
- Inscription des élèves
- Gestion des dossiers scolaires
- Suivi des performances

### Enseignants
- Gestion des enseignants
- Attribution des cours

### Académique
- Gestion des classes
- Emplois du temps
- Gestion des notes
- Bulletins scolaires

### Communication
- Notifications
- Messages internes

---

## 🛠 Stack technique

### Frontend
- React.js
- Tailwind CSS
- Vite

### Backend
- Node.js
- Express.js

### Base de données
- Supabase

### Desktop
- Electron

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir :

- Node.js v16+
- Git
- Compte Supabase (optionnel)

---

## 🚀 Installation & démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/muembiahub/college-emmanuel.git

cd college-emmanuel
```

### 2. Installer les dépendances

Frontend :

```bash
cd frontend
npm install
```

Backend :

```bash
cd ../backend
npm install
```

---

### 3. Configurer les variables d'environnement

Créer un fichier `.env` dans les dossiers concernés.

Backend :

```env
PORT=4000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-key
JWT_SECRET=une_chaine_secrete
```

Frontend :

```env
VITE_API_URL=http://localhost:4000
```

---

### 4. Lancer le projet

Backend :

```bash
cd backend
npm run dev
```

Frontend :

```bash
cd frontend
npm run dev
```

Electron (optionnel) :

```bash
cd electron
npm run dev
```

---

## 📂 Structure du projet

```bash
college-emmanuel/
│
├── frontend/        # Interface utilisateur React
├── backend/         # API Express.js
├── database/        # Schémas et migrations Supabase
├── electron/        # Version desktop
├── main.js          # Processus principal Electron
├── preload.js       # API sécurisée Electron
└── package.json
```

---

## 🧪 Tests

Exécuter les tests :

Backend :

```bash
cd backend
npm test
```

Frontend :

```bash
cd frontend
npm test
```

---

## 🤝 Contribution

Les contributions sont les bienvenues.

Étapes :

1. Créez une branche :

```bash
git checkout -b nouvelle-fonctionnalite
```

2. Effectuez vos modifications

3. Commitez :

```bash
git commit -m "Ajout d'une nouvelle fonctionnalité"
```

4. Envoyez :

```bash
git push origin nouvelle-fonctionnalite
```

5. Ouvrez une Pull Request

Bonnes pratiques :

- Respecter le style du projet
- Ajouter des tests
- Documenter les nouvelles API

---

## 📜 Licence

Licence MIT (ou remplacez par votre licence).

---

## 📧 Contact

Mainteneur : Jonathan Muembia

GitHub : https://github.com/muembiahub

---

Merci d'utiliser **College Emmanuel** 🎓