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
        label: 'Usado',
        value: 'Usado',
    },
    {
        id: 3,
        label: 'Reacondicionado',
        value: 'Reacondicionado',
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


export  { data, Planes, Renta, condicionData };
