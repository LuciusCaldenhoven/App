export interface Slide {
  id: number;
  img: any; // Puedes usar ImageSourcePropType si las imágenes son locales
  title: string;
  description: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    img: require('../assets/productos.png'),
    title: 'Algo que ya no necesito',
    description: 'Vende productos de segunda mano que ya no usas',
    
  },
  {
    id: 2,
    img: require('../assets/servicios.png'),
    title: 'Mis servicios',
    description: 'Ofrece tus habilidades o trabajos para ganar dinero',

  },
  {
    id: 3,
    img: require('../assets/alquilar.png'),
    title: 'Algo que quiero alquilar',
    description: 'Publica productos para alquilar por días, semanas o el tiempo que elijas',

  },
];

export default slides;