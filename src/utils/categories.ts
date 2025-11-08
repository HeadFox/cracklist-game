import type { CategoryCard } from '../types/game';
import { shuffleDeck } from './deck';

// 78 category cards, each with 3 categories
const CATEGORY_CARDS: CategoryCard[] = [
  { id: 'cat-1', categories: ['Chanteuses', 'Pays d\'Afrique', 'Objets de cuisine'] },
  { id: 'cat-2', categories: ['Chanteurs', 'Pays d\'Europe', 'Meubles'] },
  { id: 'cat-3', categories: ['Groupes de musique', 'Capitales', 'Vêtements'] },
  { id: 'cat-4', categories: ['Instruments de musique', 'Villes de France', 'Animaux de la ferme'] },
  { id: 'cat-5', categories: ['Métiers', 'Fleuves', 'Animaux sauvages'] },

  { id: 'cat-6', categories: ['Films célèbres', 'Montagnes', 'Oiseaux'] },
  { id: 'cat-7', categories: ['Séries TV', 'Océans et mers', 'Poissons'] },
  { id: 'cat-8', categories: ['Acteurs', 'Îles', 'Insectes'] },
  { id: 'cat-9', categories: ['Actrices', 'Déserts', 'Reptiles'] },
  { id: 'cat-10', categories: ['Réalisateurs', 'Forêts', 'Mammifères'] },

  { id: 'cat-11', categories: ['Sports', 'Fruits', 'Marques de voiture'] },
  { id: 'cat-12', categories: ['Sportifs', 'Légumes', 'Marques de vêtements'] },
  { id: 'cat-13', categories: ['Sportives', 'Arbres', 'Marques tech'] },
  { id: 'cat-14', categories: ['Équipes de foot', 'Fleurs', 'Restaurants'] },
  { id: 'cat-15', categories: ['Jeux vidéo', 'Plantes', 'Fast-food'] },

  { id: 'cat-16', categories: ['Prénoms masculins', 'Couleurs', 'Boissons'] },
  { id: 'cat-17', categories: ['Prénoms féminins', 'Formes géométriques', 'Alcools'] },
  { id: 'cat-18', categories: ['Noms de famille', 'Matériaux', 'Cocktails'] },
  { id: 'cat-19', categories: ['Personnages de BD', 'Métaux', 'Cafés et thés'] },
  { id: 'cat-20', categories: ['Super-héros', 'Pierres précieuses', 'Sodas'] },

  { id: 'cat-21', categories: ['Écrivains', 'Fromages', 'Outils'] },
  { id: 'cat-22', categories: ['Livres célèbres', 'Pâtisseries', 'Électroménager'] },
  { id: 'cat-23', categories: ['Poètes', 'Plats italiens', 'Objets de bureau'] },
  { id: 'cat-24', categories: ['Philosophes', 'Plats asiatiques', 'Fournitures scolaires'] },
  { id: 'cat-25', categories: ['Scientifiques', 'Desserts', 'Jouets'] },

  { id: 'cat-26', categories: ['Peintres', 'Sauces', 'Jeux de société'] },
  { id: 'cat-27', categories: ['Sculpteurs', 'Épices', 'Jeux de cartes'] },
  { id: 'cat-28', categories: ['Compositeurs', 'Céréales', 'Instruments de mesure'] },
  { id: 'cat-29', categories: ['Danseurs', 'Viandes', 'Parties du corps'] },
  { id: 'cat-30', categories: ['Chorégraphes', 'Poissons (culinaire)', 'Organes'] },

  { id: 'cat-31', categories: ['Politiciens', 'Bonbons', 'Vêtements d\'hiver'] },
  { id: 'cat-32', categories: ['Inventeurs', 'Chocolats', 'Vêtements d\'été'] },
  { id: 'cat-33', categories: ['Explorateurs', 'Glaces', 'Chaussures'] },
  { id: 'cat-34', categories: ['Astronautes', 'Chips et snacks', 'Accessoires'] },
  { id: 'cat-35', categories: ['Pirates célèbres', 'Biscuits', 'Bijoux'] },

  { id: 'cat-36', categories: ['Rois et reines', 'Pains', 'Coiffures'] },
  { id: 'cat-37', categories: ['Empereurs', 'Pâtes', 'Styles de musique'] },
  { id: 'cat-38', categories: ['Présidents', 'Riz et grains', 'Danses'] },
  { id: 'cat-39', categories: ['Dictateurs', 'Soupes', 'Arts martiaux'] },
  { id: 'cat-40', categories: ['Révolutionnaires', 'Salades', 'Exercices physiques'] },

  { id: 'cat-41', categories: ['Dieux grecs', 'Condiments', 'Positions de yoga'] },
  { id: 'cat-42', categories: ['Dieux romains', 'Huiles', 'Maladies'] },
  { id: 'cat-43', categories: ['Dieux égyptiens', 'Noix', 'Médicaments'] },
  { id: 'cat-44', categories: ['Héros mythologiques', 'Graines', 'Spécialités médicales'] },
  { id: 'cat-45', categories: ['Créatures mythiques', 'Confitures', 'Blessures'] },

  { id: 'cat-46', categories: ['Planètes', 'Miels', 'Émotions'] },
  { id: 'cat-47', categories: ['Constellations', 'Sirops', 'Sentiments'] },
  { id: 'cat-48', categories: ['Étoiles', 'Laits', 'Traits de caractère'] },
  { id: 'cat-49', categories: ['Galaxies', 'Yaourts', 'Défauts'] },
  { id: 'cat-50', categories: ['Phénomènes astronomiques', 'Crèmes', 'Qualités'] },

  { id: 'cat-51', categories: ['Catastrophes naturelles', 'Pizzas', 'Peurs'] },
  { id: 'cat-52', categories: ['Climats', 'Burgers', 'Phobies'] },
  { id: 'cat-53', categories: ['Saisons', 'Sandwichs', 'Superstitions'] },
  { id: 'cat-54', categories: ['Mois de l\'année', 'Tacos', 'Rituels'] },
  { id: 'cat-55', categories: ['Jours de la semaine', 'Sushis', 'Croyances'] },

  { id: 'cat-56', categories: ['Langues', 'Tapas', 'Religions'] },
  { id: 'cat-57', categories: ['Alphabets', 'Mezze', 'Philosophies'] },
  { id: 'cat-58', categories: ['Dialectes', 'Dim sum', 'Courants artistiques'] },
  { id: 'cat-59', categories: ['Accents', 'Currys', 'Mouvements littéraires'] },
  { id: 'cat-60', categories: ['Expressions', 'Nems et rouleaux', 'Périodes historiques'] },

  { id: 'cat-61', categories: ['Guerres', 'Bières', 'Empires'] },
  { id: 'cat-62', categories: ['Batailles', 'Vins', 'Dynasties'] },
  { id: 'cat-63', categories: ['Traités', 'Champagnes', 'Civilisations'] },
  { id: 'cat-64', categories: ['Révolutions', 'Cidres', 'Tribus'] },
  { id: 'cat-65', categories: ['Indépendances', 'Rhums', 'Peuples anciens'] },

  { id: 'cat-66', categories: ['Monuments', 'Whiskys', 'Armes'] },
  { id: 'cat-67', categories: ['Châteaux', 'Vodkas', 'Armures'] },
  { id: 'cat-68', categories: ['Cathédrales', 'Gins', 'Véhicules militaires'] },
  { id: 'cat-69', categories: ['Musées', 'Tequilas', 'Grades militaires'] },
  { id: 'cat-70', categories: ['Palais', 'Liqueurs', 'Décorations'] },

  { id: 'cat-71', categories: ['Universités', 'Apéritifs', 'Codes et lois'] },
  { id: 'cat-72', categories: ['Bibliothèques', 'Digestifs', 'Tribunaux'] },
  { id: 'cat-73', categories: ['Laboratoires', 'Shooters', 'Crimes'] },
  { id: 'cat-74', categories: ['Observatoires', 'Vins chauds', 'Punitions'] },
  { id: 'cat-75', categories: ['Agences spatiales', 'Sangrias', 'Prisons'] },

  { id: 'cat-76', categories: ['Applications mobiles', 'Jus de fruits', 'Réseaux sociaux'] },
  { id: 'cat-77', categories: ['Sites web', 'Smoothies', 'Langages de programmation'] },
  { id: 'cat-78', categories: ['Systèmes d\'exploitation', 'Milkshakes', 'Émojis'] },
];

/**
 * Get a shuffled deck of category cards
 */
export function generateCategoryDeck(): CategoryCard[] {
  return shuffleDeck([...CATEGORY_CARDS]);
}

/**
 * Draw a random category card from the deck
 */
export function drawCategoryCard(deck: CategoryCard[]): { card: CategoryCard | null; remaining: CategoryCard[] } {
  if (deck.length === 0) {
    return { card: null, remaining: [] };
  }

  const card = deck[0];
  const remaining = deck.slice(1);

  return { card, remaining };
}

/**
 * Get all category cards (for testing/debugging)
 */
export function getAllCategoryCards(): CategoryCard[] {
  return CATEGORY_CARDS;
}
