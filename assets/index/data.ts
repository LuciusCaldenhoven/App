// src/assets/index/data.js o donde lo necesites

import {
  Bike,
  Car,
  Home,
  Book,
  Baby,
  Heart,
  Factory,
  Wrench,
  Tv,
  Shirt,
  Monitor,
  Dumbbell,
} from "lucide-react-native";

const products = [
  {
    id: 1,
    icon: Dumbbell,
    image: require('./deporte.png'),
    title: "Deportes",
    description: "Artículos deportivos y de ejercicio",
  },
  {
    id: 2,
    icon: Car,
    image: require('./cocheMoto.png'),
    title: "Vehículos",
    description: "Carros, motos y transporte en general",
  },
  {
    id: 3,
    icon: Bike,
    image: require('./bicicleta.png'),
    title: "Bicicletas",
    description: "Bicicletas y accesorios relacionados",
  },
  {
    id: 4,
    icon: Home,
    image: require('./HogarJardin.png'),
    title: "Hogar",
    description: "Muebles, decoración y artículos de hogar",
  },
  {
    id: 5,
    icon: Book,
    image: require('./cine3d.png'),
    title: "Cine, libros y música",
    description: "Entretenimiento, literatura y música",
  },
  {
    id: 6,
    icon: Baby,
    image: require('./NinosBebes.png'),
    title: "Niños y bebés",
    description: "Ropa, juguetes y artículos para bebés",
  },
  {
    id: 7,
    icon: Heart,
    image: require('./coleccionismo.png'),
    title: "Coleccionismo",
    description: "Artículos de colección y antigüedades",
  },
  {
    id: 8,
    icon: Factory,
    image: require('./industria.png'),
    title: "Industria y agricultura",
    description: "Equipos industriales y agrícolas",
  },
  {
    id: 9,
    icon: Wrench,
    image: require('./servicios.png'),
    title: "Servicios",
    description: "Ofertas de servicios profesionales",
  },
  {
    id: 10,
    icon: Tv,
    image: require('./electrodomesticos.png'),
    title: "Electrodomésticos",
    description: "Cocina, limpieza y tecnología para el hogar",
  },
  {
    id: 11,
    icon: Monitor,
    image: require('./electronica.png'),
    title: "Electrónica",
    description: "Productos electrónicos",
  },
  {
    id: 12,
    icon: Shirt,
    image: require('./ropa.png'),
    title: "Ropa",
    description: "Ropa, moda y accesorios",
  },
];

const topProducts = [
  {
    id: 1,
    icon: Car,
    image: require('./cocheMoto.png'),
    title: "Vehículos",
    description: "Carros, motos y transporte en general",
  },
  {
    id: 2,
    icon: Tv,
    image: require('./electrodomesticos.png'),
    title: "Electrodomésticos",
    description: "Cocina, limpieza y tecnología para el hogar",
  },
];

const product = { products, topProducts };

export default product;
