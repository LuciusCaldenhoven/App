import { scale } from "@/constants/scale"
import { COLORS } from "@/constants/theme"
import { FontAwesome6 } from "@expo/vector-icons"

const data = [
    {
        id: 1,
        label: 'Venta',
        value: 'Venta',
    },
    {
        id: 2,
        label: 'Alquiler',
        value: 'Alquiler',
    },
    {
        id: 3,
        label: 'Servicio',
        value: 'Servicio',
    },
]
const condicionData = [
    {
        id: 1,
        label: 'Nuevo',
        value: 'Nuevo',
    },
    {
        id: 2,
        label: 'Como nuevo',
        value: 'Como nuevo',
    },
    {
        id: 3,
        label: 'En buen estado',
        value: 'En buen estado',
    },
    {
        id: 4,
        label: 'En condiciones aceptables',
        value: 'En condiciones aceptables',
    },
    {
        id: 5,
        label: 'Lo ha dado todo',
        value: 'Lo ha dado todo',
    },
]
const Renta = [
    {
        id: 1,
        label: 'Hora',
        value: 'Hora',
    },
    {
        id: 2,
        label: 'Dia',
        value: 'Dia',
    },
    {
        id: 3,
        label: 'Semana',
        value: 'Semana',
    },
    {
        id: 4,
        label: 'Mes',
        value: 'Mes',
    },
]
const Planes = [
    {
        id: 1,
        label: 'Pro',
        value: 'Pro',
        component: <FontAwesome6 name ="fire-flame-curved" size={scale(18)}/>,
    },
    {
        id: 2,
        label: 'God',
        value: 'God',
        component: <FontAwesome6 name ="fire-flame-simple" size={scale(18)}/>
    },
    {
        id: 3,
        label: 'VendeYa',
        value: 'VendeYa',
        component: <FontAwesome6 name ="fire" size={scale(18)}/>,
    },
]
const ordenarPorData = [
    {
      id: 1,
      label: 'Más recientes',
      value: 'recientes',
    },
    {
      id: 2,
      label: 'Precio: menor a mayor',
      value: 'precioAsc',
    },
    {
      id: 3,
      label: 'Precio: mayor a menor',
      value: 'precioDesc',
    },
    {
      id: 4,
      label: 'Más relevantes',
      value: 'relevancia',
    },
  ];
  
  const fecha = [
    {
      id: 1,
      label: 'Todo',
      value: 'Todo',
    },
    {
      id: 2,
      label: 'Ultimas 24 horas',
      value: 'Ultimas 24 horas',
    },
    {
      id: 3,
      label: 'Ultimos 7 dias',
      value: 'Ultimos 7 dias',
    },
    {
      id: 4,
      label: 'Ultimos 30 dias',
      value: 'Ultimos 30 dias',
    },
  ];


const exportData = { data, Planes, Renta, condicionData,ordenarPorData,fecha };

export default exportData;
