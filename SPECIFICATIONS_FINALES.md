# Spécifications : App de prise de rendez-vous ZAS Anvers

Ce document définit les spécifications du prototype avancé pour **ZAS Anvers**, conçu pour l'autonomie des seniors.

## 1. Identité Visuelle (ZAS Anvers)
- **Couleur Primaire :** Vert Turquoise (Code : `#00A5AD`).
- **Ambiance :** Propre, sereine, professionnelle.
- **Supports :** Responsive (Smartphone, Tablette, Ordinateur).

## 2. Architecture par Niveau (UI Différenciée)
Chaque niveau possède sa propre structure de page :

### A. Profil "Débutant" (🐢) - Le Mode Tunnel
- **Layout :** Vertical, un seul élément par ligne, espacement massif.
- **Interaction :** Boutons "Suivant/Retour" géants. Pas de défilement si possible (pagination stricte).
- **Aide :** ZAS-Bot parle automatiquement.

### B. Profil "Intermédiaire" (🚶) - Le Mode Guidé
- **Layout :** Liste de cartes standard, bien aérées.
- **Interaction :** Navigation par étapes avec barre de progression.
- **Aide :** ZAS-Bot apparaît au survol ou au clic.

### C. Profil "Avancé" (🚀) - Le Mode Dashboard
- **Layout :** Grille compacte (2-3 colonnes), filtres de recherche actifs.
- **Interaction :** Accès direct à toutes les infos, historique visible.
- **Aide :** ZAS-Bot discret en bas d'écran.

## 3. L'Assistant IA : "ZAS-Bot"
- **Rôle :** Traducteur de jargon médical en langage simple.
- **Comportement :** Adapté au niveau choisi.

## 4. Parcours Utilisateur
1. **Accueil :** Sélection Langue + Profil.
2. **Recherche (Adaptée au niveau) :**
   - Débutant : 1 spécialité par page.
   - Inter : Liste simple.
   - Avancé : Recherche & Filtres.
3. **Prise de RDV :** Calendrier adapté (Gros boutons vs Grille compacte).
4. **Mode Accompagnateur :** Flux de "Double Validation".

## 5. Spécifications Techniques
- **Accessibilité :** WCAG AAA.
- **Self-Service :** Pas de bouton d'appel, support IA uniquement.
