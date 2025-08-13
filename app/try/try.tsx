import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";

// --------------------
// 1) Tipos y helpers
// --------------------
type Leaf = null | string; // hoja "seleccionable"

interface CategoryNodeObj {
  [key: string]: CategoryNode;
}

type CategoryNode =
  | Leaf
  | string[]
  | CategoryNodeObj
  | (string | CategoryNodeObj)[];

// Un item normalizado para el render
type Item = {
  key: string;                 // nombre a mostrar
  hasChildren: boolean;        // si navega o no
  path: string[];              // ruta completa hasta aquí
};

// Dado un nodo (CategoryNode), devolver lista normalizada de hijos
function getChildren(node: CategoryNode, path: string[]): Item[] {
  if (!node) return []; // null => no hijos
  const items: Item[] = [];

  // Caso: array de strings o de objetos
  if (Array.isArray(node)) {
    node.forEach((entry, idx) => {
      if (typeof entry === "string") {
        // string es hoja
        items.push({
          key: entry,
          hasChildren: false,
          path: [...path, entry],
        });
      } else if (entry && typeof entry === "object") {
        // objeto de un solo nivel { "Nombre": CategoryNode }
        Object.entries(entry).forEach(([name, child]) => {
          items.push({
            key: name,
            hasChildren: !!child,
            path: [...path, name],
          });
        });
      }
    });
    return items.sort((a, b) => a.key.localeCompare(b.key, "es"));
  }

  // Caso: objeto { "Nombre": CategoryNode }
  if (typeof node === "object") {
    Object.entries(node).forEach(([name, child]) => {
      items.push({
        key: name,
        hasChildren: !!child,
        path: [...path, name],
      });
    });
    return items.sort((a, b) => a.key.localeCompare(b.key, "es"));
  }

  // Caso: string => es hoja (sin hijos)
  if (typeof node === "string") {
    return [];
  }

  return [];
}

// Leer subnodo por ruta
function getNodeByPath(root: Record<string, CategoryNode>, path: string[]): CategoryNode {
  let node: any = root;
  for (const segment of path) {
    if (node == null) return null;
    if (Array.isArray(node)) {
      // buscar el subobjeto con esa key dentro del array
      const entry = node.find((e) => typeof e === "object" && e !== null && Object.prototype.hasOwnProperty.call(e, segment));
      node = entry ? (entry as Record<string, CategoryNode>)[segment] : null;
    } else if (typeof node === "object") {
      node = node[segment] ?? null;
    } else {
      return null;
    }
  }
  return node as CategoryNode;
}

// --------------------
// 2) Datos (recorta o expande a gusto)
//    IMPORTANTE: Este objeto es JSON válido. Agrega el resto de tus categorías aquí.
// --------------------
const DATA: Record<string, CategoryNode> = {
  "Motos": null,

  "Motor y accesorios": [
    "Sólo seleccionar \"Motor y accesorios\"",
    "GPS y electrónica",
    "Herramientas",
    {
      "Recambios de coches y furgonetas": [
        "Accesorios",
        "Aceites, lubricantes y líquidos",
        "Carrocerías",
        "Faros y luces indicadoras",
        "Llantas",
        "Motor y piezas de motor",
        "Neumáticos",
        "Seguridad",
        "Suspensión y dirección"
      ]
    },
    {
      "Recambios de motos y cuatriciclos": [
        "Aceites, lubricantes y líquidos",
        "Faros y luces indicadoras",
        "Motor y piezas de motor",
        "Neumáticos",
        "Vestimenta y protección"
      ]
    },
    "Otros"
  ],

  "Moda y accesorios": {
    "Mujer": null,
    "Hombre": [
      "Calzado",
      "Ropa"
    ],
    "Accesorios": [
      "Accesorios para el cabello",
      "Bolsos y mochilas",
      "Bufandas y chales",
      "Cinturones",
      "Corbatas y pañuelos",
      "Gafas de sol",
      "Guantes",
      "Paraguas",
      "Relojes",
      {
        "Sombreros y gorras": [
          "Boinas",
          "Diademas y cintas",
          "Gorras",
          "Gorros",
          "Gorros de invierno",
          "Sombreros",
          "Otros sombreros y gorras"
        ]
      },
      "Otros accesorios"
    ],
    "Joyería": [
      "Anillos",
      "Broches",
      "Cadenas",
      "Colgantes",
      "Collares",
      "Conjuntos de joyas",
      "Cuentas",
      "Gemelos",
      "Joyeros",
      "Pendientes",
      "Piercings",
      "Pulseras",
      "Tobilleras",
      "Otras joyas"
    ],
    "Belleza": [
      "Colonia",
      {
        "Cuidado personal": [
          "Aftershave y colonia",
          "Artículos y kits de cuidado personal",
          "Cuidado corporal",
          "Cuidado de las manos",
          "Cuidado de las uñas",
          "Cuidado del cabello",
          "Cuidado facial",
          "Otros productos de cuidado personal"
        ]
      },
      "Maquillaje",
      "Perfume",
      {
        "Utensilios y accesorios": [
          "Utensilios de afeitado",
          "Utensilios de maquillaje",
          {
            "Utensilios de peinado": [
              "Cepillos para el pelo",
              "Planchas para el pelo",
              "Rizadores",
              "Secadores"
            ]
          },
          "Utensilios para el cuidado corporal",
          "Utensilios para el cuidado facial",
          "Utensilios para el cuidado personal",
          "Utensilios para las uñas",
          "Otros utensilios"
        ]
      },
      "Otros productos de belleza"
    ]
  },

  "Tecnología y electrónica": {
    "Imagen: televisores y proyectores": [
      "Televisores",
      "Proyectores",
      {
        "Accesorios de televisores y proyectores": [
          "Antenas",
          "Cables",
          "Fundas",
          "Mandos a distancia",
          "Soportes",
          "Otros accesorios de televisores y proyectores"
        ]
      }
    ],
    "Sonido": [
      {
        "Dispositivos de sonido": [
          "Altavoces",
          "Auriculares",
          "Home cinema",
          "Minicadenas",
          "Radios",
          "Reproductores de CD",
          "Reproductores de vinilos",
          "Otros dispositivos de sonido"
        ]
      },
      {
        "DJ y audio profesional": [
          "Amplificadores",
          "Controladoras",
          "Ecualizadores",
          "Mesas de mezcla",
          "Micrófonos",
          "Monitores de estudio",
          "Platos DJ",
          "Otros artículos de DJ y audio profesional"
        ]
      }
    ],
    "Fotografía": [
      {
        "Cámaras": [
          "Cámaras compactas",
          "Cámaras deportivas",
          "Cámaras instantáneas",
          "Cámaras réflex",
          "Cámaras sin espejo",
          "Otros tipos de cámaras"
        ]
      },
      {
        "Accesorios de fotografía": [
          "Baterías",
          "Filtros",
          "Flashes",
          "Fundas y mochilas",
          "Objetivos",
          "Tarjetas de memoria",
          "Trípodes",
          "Otros accesorios de fotografía"
        ]
      }
    ],
    "Telefonía: móviles y smartwatches": [
      "Smartphones",
      "Smartwatches y pulsera de actividad",
      "Teléfonos vintage",
      "Teléfonos fijos",
      "Otros teléfonos",
      {
        "Accesorios de móviles y smartwatches": [
          "Cargadores y cables para móviles",
          "Powerbanks",
          "Fundas y carcasas para móviles",
          "Baterías para móviles",
          "Soportes para móviles",
          "Cristales templados para móviles",
          "Palos selfies",
          "Trípodes para móviles",
          "Manos libres",
          "Aros de luz para móviles",
          "Estabilizadores para móviles",
          "Amplificadores de pantalla para móviles",
          "Localizadores para móvil",
          "Piezas de recambio",
          "Otros accesorios de móviles y smartwatches"
        ]
      }
    ],
    "Informática: ordenadores y tablets": [
      "Portátiles",
      "Ordenadores de sobremesa",
      "Realidad virtual y aumentada",
      "Tablets",
      "E-readers",
      {
        "Periféricos": [
          "Impresoras",
          "Monitores",
          "Ratones",
          "Teclados",
          "Escáneres",
          "Webcams",
          "Otros periféricos"
        ]
      },
      "Componentes y piezas de ordenador",
      {
        "Accesorios de informática": [
          "Accesorios para portátiles",
          "Accesorios para tablets",
          "Accesorios consumibles para impresoras",
          "Software",
          "Redes y conectividad",
          "Discos duros externos",
          "Cables de informática",
          "Pendrives y memorias USB"
        ]
      }
    ],
    "Gaming: consolas y videojuegos": [
      "Consolas y accesorios",
      {
        "PC gaming y streaming": [
          "Portátiles gaming",
          "Ordenadores sobremesa gaming",
          "Monitores gaming",
          "Ratones gaming",
          "Teclados gaming",
          "Sillas gaming",
          "Mesas gaming",
          "Alfombrillas gaming",
          "Mandos para PC",
          "Volantes para PC",
          "Altavoces gaming",
          "Micrófonos para PC gamer",
          "Auriculares gaming",
          "Juegos para PC",
          "Accesorios de PC gaming"
        ]
      },
      "Videojuegos y más",
      "Otros artículos de gaming"
    ]
  },

  "Deporte y ocio": [
    "Sólo seleccionar \"Deporte y ocio\"",
    "Acampada y senderismo",
    "Acuáticos",
    "Airsoft y paintball",
    "Artes marciales y boxeo",
    "Bádminton",
    "Baloncesto",
    "Balonmano",
    "Béisbol",
    "Billar",
    "Caza",
    "Ciclismo",
    "Equitación",
    "Escalada",
    "Esgrima",
    "Esquí y snowboard",
    "Fútbol",
    "Golf",
    "Hockey",
    "Monopatín y patines",
    "Montañismo",
    "Natación",
    "Pádel",
    "Pesca",
    "Rugby",
    "Surf y bodyboard",
    "Tenis",
    "Tenis de mesa",
    "Tiro con arco",
    "Voleibol",
    "Otros deportes",
    "Material de gimnasio y fitness",
    "Instrumentos musicales",
    "Entradas y eventos",
    "Coleccionismo deportivo",
    "Arte y manualidades",
    "Juguetes y juegos",
    "Otros artículos de ocio"
  ],

  "Bicicletas": {
    "Accesorios para bicicletas": [
      "Bombas e infladores",
      "Electrónica para bicicletas",
      "Luces",
      "Portabicicletas",
      "Rodillos"
    ],
    "Bicicletas y triciclos": [
      "Bicicletas Infantiles",
      "Bicicletas ciudad",
      "Bicicletas de carretera",
      "Bicicletas eléctricas",
      "Bicicletas plegables",
      "Fixies",
      "MTB",
      "Monociclos",
      "Triciclos"
    ],
    "Piezas y recambios de bici": [
      "Cuadros",
      "Herramientas",
      "Neumáticos y cámaras",
      "Piezas",
      "Recambios",
      "Ruedas",
      "Sillín"
    ],
    "Protección y vestimenta": [
      "Alforjas",
      "Cascos",
      "Gafas ciclismo y de sol",
      "Ropa ciclismo",
      "Zapatillas y cubrezapatillas"
    ],
    "Otros": null
  },

  "Hogar y jardín": {
    "Baño": [
      "Accesorios de baño",
      "Bañeras",
      "Cabinas de ducha",
      "Grifería",
      "Inodoros",
      "Lavabos",
      "Muebles de baño",
      "Platos de ducha",
      "Saunas"
    ],
    "Cocina": [
      "Campanas extractoras",
      "Encimeras",
      "Fregaderos",
      "Grifería",
      "Muebles de cocina"
    ],
    "Decoración": [
      "Alfombras",
      "Cortinas y estores",
      "Cuadros y marcos",
      "Espejos",
      "Iluminación",
      "Jarrones",
      "Relojes decorativos",
      "Textiles del hogar"
    ],
    "Jardín": [
      "Casetas y cobertizos",
      "Césped artificial",
      "Decoración de jardín",
      "Herramientas de jardín",
      "Iluminación de jardín",
      "Muebles de jardín",
      "Piscinas",
      "Riego"
    ],
    "Muebles": [
      "Armarios",
      "Camas",
      "Colchones",
      "Comedores",
      "Escritorios",
      "Estanterías",
      "Mesas",
      "Sillas",
      "Sillones y sofás"
    ],
    "Otros": null
  },

  "Cine, Libros y Música": {
    "Cine": [
      "Cine y películas",
      "Merchandising de cine",
      "Otros"
    ],
    "Libros": [
      "Arte y diseño",
      "Ciencias",
      "Ciencias sociales",
      "Cómics y manga",
      "Derecho",
      "Diccionarios e idiomas",
      "Economía y empresa",
      "Educación y pedagogía",
      "Filosofía y pensamiento",
      "Gastronomía",
      "Historia",
      "Informática",
      "Ingeniería y tecnología",
      "Infantil y juvenil",
      "Literatura",
      "Medicina",
      "Otros",
      "Psicología y autoayuda",
      "Religión y espiritualidad",
      "Viajes y turismo"
    ],
    "Música": {
      "CDs, Vinilos y Casetes": [
        "Casetes",
        "Otros formatos de audio",
        "CDs Música",
        "CDs idiomas",
        "Vinilos"
      ],
      "Equipo profesional de sonido": [
        "Cables",
        "Compresores y ecualizadores",
        "Dispositivos de grabación",
        "Mesas de mezclas y DJ",
        "Micrófonos y accesorios"
      ],
      "Instrumentos musicales": {
        "Other type of instruments": null,
        "Instrumentos de Percusión": [
          "Cajas",
          "Claves",
          "Pandereta",
          "Platos",
          "Tambores"
        ],
        "Instrumentos de cuerda": [
          "Arpa",
          "Banjo",
          "Contrabajo",
          "Mandolina",
          "Ukelele",
          "Viola",
          "Violonchelo",
          "Violín"
        ],
        "Instrumentos de viento": [
          "Armónica",
          "Bajón",
          "Clarinete",
          "Corneta",
          "Flauta",
          "Flauta dulce",
          "Flautín",
          "Saxofón",
          "Trompeta"
        ],
        "Pianos y teclados": [
          "Pianos",
          "Teclados"
        ]
      },
      "Partituras y libretos": null,
      "Pósters y merchandising de música": null
    }
  },

  "Niños y bebés": {
    "Alimentación": [
      "Biberones y tetinas",
      "Calienta biberones y esterilizadores",
      "Chupetes y mordedores",
      "Sillas de comer",
      "Termos y potitos",
      "Otros"
    ],
    "Baño e higiene": [
      "Bañeras",
      "Esponjas y termómetros",
      "Orinales",
      "Otros"
    ],
    "Carros, sillas y accesorios": [
      "Accesorios de carros y sillas",
      "Carros de bebé",
      "Mochilas portabebés",
      "Sillas de coche",
      "Otros"
    ],
    "Habitación": [
      "Armarios y cómodas",
      "Cunas",
      "Decoración infantil",
      "Otros muebles",
      "Otros"
    ],
    "Juguetes": [
      "Juguetes de aprendizaje",
      "Juguetes de construcción",
      "Juguetes electrónicos",
      "Juguetes musicales",
      "Muñecas y accesorios",
      "Peluches",
      "Vehículos y pistas",
      "Otros"
    ],
    "Ropa y calzado": [
      "Abrigos",
      "Camisetas y camisas",
      "Calzado",
      "Conjuntos",
      "Pantalones y faldas",
      "Ropa interior",
      "Vestidos",
      "Otros"
    ],
    "Seguridad": [
      "Barreras de seguridad",
      "Cámaras y vigilabebés",
      "Intercomunicadores",
      "Otros"
    ],
    "Tronas y andadores": [
      "Andadores",
      "Correpasillos",
      "Tronas"
    ],
    "Otros": null
  },

  "Coleccionismo": [
    "Antigüedades",
    "Artesanías y decoración",
    "Artículos de escritorio",
    "Banderas",
    "Coches y motocicletas",
    "Coleccionismo deportivo",
    "Coleccionismo militar",
    "Filatelia y sellos",
    "Imanes",
    "Llaveros",
    "Monedas y billetes",
    "Muñecos",
    "Naipes",
    "Postales y souvenirs",
    "Relojes",
    "Otros"
  ],

  "Construcción y reformas": [
    "Sólo seleccionar 'Construcción y reformas'",
    "Balcones",
    "Electricidad e Iluminación",
    "Escaleras y andamios",
    "Ferretería",
    {
      "Herramientas y maquinaria": [
        "Herramientas",
        "Herramientas eléctricas",
        "Maquinaria"
      ]
    },
    "Madera y otros materiales",
    "Pavimentos y revestimientos",
    {
      "Pinturas y barnices": [
        "Barnices",
        "Pinturas"
      ]
    },
    {
      "Puertas y ventanas": [
        "Cristales",
        "Puertas",
        "Puertas correderas",
        "Ventanas"
      ]
    },
    "Otros"
  ],

  "Propiedad": [
    "Piso",
    "Casa",
    "Habitación",
    "Local / Oficina",
    "Garaje",
    "Terreno",
    "Trastero"
  ],

  "Vehículo": [
    "Coches",
    "Camiones",
    "Furgonetas",
    "Caravanas",
    "Autocaravanas",
    "Vehículos industriales",
    "Vehículos clásicos",
    "Quads",
    "Buggies",
    "Embarcaciones",
    "Motos acuáticas",
    "Aviones",
    "Ultraligeros",
    "Otros"
  ]
};


// --------------------
// 3) UI
// --------------------
export default function CategoryBrowserScreen() {
  const [path, setPath] = useState<string[]>([]);

  const currentNode = useMemo(() => getNodeByPath(DATA, path), [path]);
  const items = useMemo(() => {
    // Si no hay ruta, mostramos top-level (keys de DATA)
    if (path.length === 0) {
      return Object.keys(DATA)
        .sort((a, b) => a.localeCompare(b, "es"))
        .map<Item>((k) => ({
          key: k,
          hasChildren: !!DATA[k],
          path: [k],
        }));
    }
    return getChildren(currentNode, path);
  }, [currentNode, path]);

  const title = path[path.length - 1] ?? "Categorías";

  const onPressItem = (item: Item) => {
    if (item.hasChildren) {
      setPath(item.path);
    } else {
      // Es hoja seleccionable (sin hijos): aquí podrías navegar a tu pantalla de listado, crear filtro, etc.
      Alert.alert("Seleccionado", item.path.join(" > "));
    }
  };

  const goBack = () => setPath((p) => p.slice(0, -1));
  const goHome = () => setPath([]);

  const Breadcrumbs = () => (
    <View style={styles.breadcrumbs}>
      <Pressable onPress={goHome} style={styles.crumb}>
        <Text style={styles.crumbText}>Inicio</Text>
      </Pressable>
      {path.map((seg, idx) => (
        <View key={idx} style={styles.crumbWrap}>
          <Text style={styles.crumbSep}>›</Text>
          <Pressable
            onPress={() => setPath(path.slice(0, idx + 1))}
            style={styles.crumb}
          >
            <Text style={styles.crumbText}>{seg}</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {path.length > 0 ? (
          <Pressable onPress={goBack} style={styles.backBtn}>
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.title}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <Breadcrumbs />

      <FlatList
        data={items}
        keyExtractor={(item) => item.path.join("///")}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressItem(item)} style={styles.row}>
            <Text style={styles.rowText}>{item.key}</Text>
            <Text style={styles.rowChevron}>{item.hasChildren ? "›" : "•"}</Text>
          </Pressable>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

// --------------------
// 4) Estilos (dark-friendly)
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnText: {
    fontSize: 18,
    color: "#fff",
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  breadcrumbs: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 6,
  },
  crumbWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  crumb: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  crumbText: {
    color: "#DADADA",
    fontSize: 12,
  },
  crumbSep: {
    color: "#555",
  },
  separator: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginLeft: 16,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowText: {
    color: "#F2F2F2",
    fontSize: 16,
  },
  rowChevron: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 18,
    fontWeight: "600",
  },
});
