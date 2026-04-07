import type { Product } from "@/modules/catalog/domain/product";

export const catalogSeed: Product[] = [
  {
    id: 1,
    slug: "hogaza-masa-madre",
    category: "sourdough",
    name: {
      es: "Hogaza de Masa Madre",
      en: "Sourdough Boule",
    },
    description: {
      es: "Nuestra exclusiva masa madre fermentada por 48h.",
      en: "Our signature 48h fermented sourdough.",
    },
    price: 8.5,
    minOrder: 10,
    image: "https://www.santaelena.com.co/wp-content/uploads/2021/03/MG_6571-600x468.jpg",
    isActive: true,
  },
  {
    id: 2,
    slug: "panes-brioche",
    category: "brioche",
    name: {
      es: "Panes Brioche",
      en: "Brioche Buns",
    },
    description: {
      es: "Ricos y llenos de mantequilla para hamburguesas.",
      en: "Rich and buttery for burgers.",
    },
    price: 65,
    minOrder: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0QY_5625AdgtehKArFoSoaBk-1Jp60vz-8A&s",
    isActive: true,
  },
];
