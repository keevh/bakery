import type { Product } from "@/modules/catalog/domain/product";

export const catalogSeed: Product[] = [
  {
    id: 1,
    slug: "pandebono",
    category: "amasijo",
    name: {
      es: "Pandebono",
      en: "Pandebono",
    },
    description: {
      es: "Amasijo de yuca y queso fresco, suave y elástico.",
      en: "Cassava-and-cheese dough, soft and chewy.",
    },
    price: 1.5,
    minOrder: 6,
    image: "https://recetas.encolombia.com/wp-content/uploads/2021/03/Pandebono.jpg",
    isActive: true,
  },
  {
    id: 2,
    slug: "swiss-roll",
    category: "dulce",
    name: {
      es: "Rollo Suizo",
      en: "Swiss Roll",
    },
    description: {
      es: "Bizcocho esponjoso enrollado con arequipe.",
      en: "Fluffy sponge rolled with dulce de leche.",
    },
    price: 12.0,
    minOrder: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmlF4-aTdFlZ7yplMB779_F7JQ-_6znidbFQ&s",
    isActive: true,
  },
  {
    id: 3,
    slug: "alinado-bread",
    category: "amasijo",
    name: {
      es: "Pan Aliñado",
      en: "Aliñado Bread",
    },
    description: {
      es: "Pan tolimense blando y cremoso, de miga tierna.",
      en: "Soft, creamy Tolima loaf with a tender crumb.",
    },
    price: 3.5,
    minOrder: 4,
    image: "https://peterpan24horas.com/storage/2019/07/P2000.jpg",
    isActive: true,
  },
  {
    id: 4,
    slug: "bunuelos",
    category: "amasijo",
    name: {
      es: "Buñuelos",
      en: "Buñuelos",
    },
    description: {
      es: "Bolitas fritas de queso, crocantes y tiernas.",
      en: "Fried cheese balls, crisp outside and tender inside.",
    },
    price: 1.25,
    minOrder: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnJa49kseYBZdToHQxWmYwnaf64k90V6e5OA&s",
    isActive: true,
  },
  {
    id: 5,
    slug: "cascarita-roll",
    category: "hojaldre",
    name: {
      es: "Cascarita",
      en: "Cascarita Roll",
    },
    description: {
      es: "Pan hojaldrado bogotano, crocante y suave.",
      en: "Bogotá flaky roll, crunchy and soft.",
    },
    price: 1.2,
    minOrder: 6,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3oAahgdVknsnK0N1Pvh-mSJyyTExrwMOmyQ&s",
    isActive: true,
  },
  {
    id: 6,
    slug: "mille-feuille",
    category: "hojaldre",
    name: {
      es: "Mil Hojas",
      en: "Mille-feuille",
    },
    description: {
      es: "Capas de hojaldre con crema y arequipe.",
      en: "Puff-pastry layers with cream and dulce de leche.",
    },
    price: 3.75,
    minOrder: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0obo3mt_eUJCw80phj8-QeBN2Ml_XEW6qXQ&s",
    isActive: true,
  },
  {
    id: 7,
    slug: "croissant",
    category: "hojaldre",
    name: {
      es: "Croissant",
      en: "Croissant",
    },
    description: {
      es: "Hojaldre de mantequilla, dorado y crujiente.",
      en: "Buttery pastry, golden and crisp.",
    },
    price: 2.5,
    minOrder: 4,
    image: "https://mejorconsalud.as.com/wp-content/uploads/2015/07/croissants-de-jam%C3%B3n-y-queso.jpg",
    isActive: true,
  },
  {
    id: 8,
    slug: "arequipe-roscon",
    category: "dulce",
    name: {
      es: "Roscón de Arequipe",
      en: "Arequipe Roscón",
    },
    description: {
      es: "Rosca suave rellena de arequipe.",
      en: "Soft ring filled with dulce de leche.",
    },
    price: 4.5,
    minOrder: 2,
    image: "https://legrandfrances.co/wp-content/uploads/2020/07/Roscon_Arequipe_1-400x225.png",
    isActive: true,
  },
  {
    id: 9,
    slug: "corn-cookie",
    category: "galleteria",
    name: {
      es: "Galleta de Maíz",
      en: "Corn Cookie",
    },
    description: {
      es: "Galleta de maíz crocante, ligera y tostada.",
      en: "Crunchy corn cookie, light and toasted.",
    },
    price: 0.9,
    minOrder: 12,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4SYBHIZ8Aw_TjtazHWiWV-xHI5uD6AEY5mg&s",
    isActive: true,
  },
  {
    id: 10,
    slug: "mantecada",
    category: "galleteria",
    name: {
      es: "Mantecada",
      en: "Mantecada",
    },
    description: {
      es: "Pastelito de mantequilla esponjoso y húmedo.",
      en: "Fluffy, moist butter cake.",
    },
    price: 1.6,
    minOrder: 6,
    image: "https://elmolinodelartesano.com/wp-content/uploads/2018/09/mantecada-de-ahuyama.jpg",
    isActive: true,
  },
];
