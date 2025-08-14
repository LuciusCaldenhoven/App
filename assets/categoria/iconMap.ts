// iconMap.ts
import { ImageSourcePropType } from 'react-native';

// Normaliza nombres: quita acentos, espacios, etc. → "Tecnología y electrónica" → "tecnologia-y-electronica"
export const slugify = (s: string) =>
  s
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const CATEGORY_ICON_BY_SLUG: Record<string, ImageSourcePropType> = {
  'motos': require('@/assets/categoria/icons/moto.png'),
  'otros': require('@/assets/categoria/icons/puntos.png'),
  'motor-y-accesorios': require('@/assets/categoria/icons/casco-de-carreras.png'),
  'moda-y-accesorios': require('@/assets/categoria/icons/camiseta.png'),
  'tecnologia-y-electronica': require('@/assets/categoria/icons/tec.png'),
  'deporte-y-ocio': require('@/assets/categoria/icons/deportes.png'),
  'bicicletas': require('@/assets/categoria/icons/bicicleta-2.png'),
  'hogar-y-jardin': require('@/assets/categoria/icons/sofa.png'),
  'cine-libros-y-musica': require('@/assets/categoria/icons/musica-en-vivo.png'),
  'ninos-y-bebes': require('@/assets/categoria/icons/carrito-de-bebe.png'),
  'coleccionismo': require('@/assets/categoria/icons/mona-lisa.png'),
  'construccion-y-reformas': require('@/assets/categoria/icons/pared-de-ladrillo.png'),
  'propiedad': require('@/assets/categoria/icons/casa-nueva.png'),         
  'vehiculo': require('@/assets/categoria/icons/coche.png') 
};

export const DEFAULT_ICON: ImageSourcePropType =
  require('@/assets/categoria/icons/tec.png');
