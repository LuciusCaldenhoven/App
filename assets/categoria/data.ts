// src/assets/index/data.js o donde lo necesites

import { Bike, Car, Home, Book, Baby, Heart, Factory, Wrench, Tv, Shirt, Monitor, Dumbbell, } from "lucide-react-native";

const products = [
  {
    id: 1,
    icon: Dumbbell,
    title: "Deportes",
    description: "Artículos deportivos y de ejercicio",
  },
  {
    id: 2,
    icon: Car,
    title: "Vehículos",
    description: "Carros, motos y transporte en general",
  },
  {
    id: 3,
    icon: Bike,
    title: "Bicicletas",
    description: "Bicicletas y accesorios relacionados",
  },
  {
    id: 4,
    icon: Home,
    title: "Hogar",
    description: "Muebles, decoración y artículos de hogar",
  },
  {
    id: 5,
    icon: Book,
    title: "Cine, libros y música",
    description: "Entretenimiento, literatura y música",
  },
  {
    id: 6,
    icon: Baby,
    title: "Niños y bebés",
    description: "Ropa, juguetes y artículos para bebés",
  },
  {
    id: 7,
    icon: Heart,
    title: "Coleccionismo",
    description: "Artículos de colección y antigüedades",
  },
  {
    id: 8,
    icon: Factory,
    title: "Industria y agricultura",
    description: "Equipos industriales y agrícolas",
  },
  {
    id: 9,
    icon: Wrench,
    title: "Servicios",
    description: "Ofertas de servicios profesionales",
  },
  {
    id: 10,
    icon: Tv,
    title: "Electrodomésticos",
    description: "Cocina, limpieza y tecnología para el hogar",
  },
  {
    id: 11,
    icon: Monitor,
    title: "Electrónica",
    description: "Productos electrónicos",
  },
  {
    id: 12,
    icon: Shirt,
    title: "Ropa",
    description: "Ropa, moda y accesorios",
  },
];

const topProducts = [
  {
    id: 1,
    icon: Car,
    title: "Vehículos",
    description: "Carros, motos y transporte en general",
  },
  {
    id: 2,
    icon: Tv,
    title: "Electrodomésticos",
    description: "Cocina, limpieza y tecnología para el hogar",
  },
];

const product = { products, topProducts };

export default product;
