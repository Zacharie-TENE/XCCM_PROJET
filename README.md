# XCCM - Document Composition Software

XCCM est un éditeur de documents conçu pour faciliter la création, la modification et l'exportation de documents à partir de granules. Ce projet permet aux utilisateurs de créer des documents, d'ajouter des titres, des paragraphes, de sauvegarder, d'importer du contenu et de les exporter au format PDF. Le logiciel inclut également des fonctionnalités d'authentification et de gestion des mots de passe.

## LIVRABLE

    En complement à ce readMe, est fourni un guide 'utilsiation , un guide de déploiement et un rapport de projet.
    Ces deux documents ont pour nom respectif GUIDE_UTILISATION, GUIDE_DEPLOIEMENT,RAPPORT_PROJET et se situent à la racine du projet.

## Fonctionnalités principales

- **Création de documents** : Ajoutez des titres, des paragraphes, du contenu dynamique.
- **Exportation en PDF (word pris en charge à l'export)** : Convertissez vos documents créés en PDF.
- **Authentification** : Créez un compte, connectez-vous et réinitialisez votre mot de passe.
- **Sauvegarde et chargement de documents** : Enregistrez vos documents et chargez-les au besoin.
- **Importation de contenu** : Importez des fichiers ou des données pour intégrer au contenu des documents.
- **chatbot basé sur gemini AI** : Pour assitance dans la generation du contenu.
-

## Technologies utilisées

- **Frontend** :
  - React.js
  - Next.js
  - Tailwind CSS
- **Backend** :
  - Next.js API Routes
  - MongoDB (Base de données)
  - Prisma ORM
- **Authentification** :
  - NextAuth.js pour l'authentification via email, Google et GitHub.
- **Exportation PDF et DOCX** : Utilisation de bibliothèques comme `html-to-pdfmake` et `html-to-docx`.

## Installation

Pour exécuter ce projet en local, vous devez suivre ces étapes :

### Prérequis

- Node.js (version 16 ou supérieure)
- MongoDB (une base de données MongoDB doit être configurée)

### Étapes d'installation

1. Clonez ce dépôt :

   ```bash
   git clone https://github.com/votre-utilisateur/nom-du-repository.git
   ```

2. Allez dans le dossier du projet :

```bash
  cd nom-du-repository
```

3. Installez les dépendances :

```bash
   npm install
```

4. Configurez votre fichier .env : Créez un fichier .env à la racine du projet et ajoutez-y vos variables d'environnement :

```bash
   DATABASE_URL=mongodb+srv://url
   AUTH_SECRET=<votre-secret>
   NEXTAUTH_SECRET=<votre-secret>
   GOOGLE_CLIENT_ID=<votre-client-id-google>
   GOOGLE_CLIENT_SECRET=<votre-client-secret-google>
```

5. Se placer dans le repertoire src : (**configuration de prisma**)
   Executer respectivement les commandes suivantes: `npx prisma generate` suivi par `npx prisma db push`

6. Lancez le serveur de développement :

```bash
   npm run dev
```

7. Accédez à l'application via http://localhost:3000: Ce port pouvant être occupé,utilisé le port affiché dans le terminal apres la commande npm run dev lancé. Si l'affichage parait etrange, ajuster à 75-80% l'affichage sur votre navigateur.

## Contribuer

Les contributions sont les bienvenues ! Si vous souhaitez améliorer ce projet, veuillez suivre ces étapes :

Fork le projet.
Créez une nouvelle branche pour votre fonctionnalité (git checkout -b feature/nouvelle-fonctionnalité).
Commitez vos modifications (git commit -am 'Ajout d\'une nouvelle fonctionnalité').
Poussez votre branche (git push origin feature/nouvelle-fonctionnalité).
Ouvrez une pull request.

## Auteurs

Ce projet dans son état actuel a été concu par :

- TENE FOGANG ZACHARIE (chef de projet)
- MBOUMELA ELTON
- KEUMOUO DIROIL JAMES
- DONFACK HILARY
- NFANGAM AMIRAH
- TCHATCHUEM DJOUM
- NDIFFO MANUELLA
- ALETANOU LOIC
- DEUTCHOUA MBOH
