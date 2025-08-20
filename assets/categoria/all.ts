type Leaf = null | string; // hoja "seleccionable"

interface CategoryNodeObj {
  [key: string]: CategoryNode;
}

type CategoryNode =
  | Leaf
  | string[]
  | CategoryNodeObj
  | (string | CategoryNodeObj)[];



const DATA: Record<string, CategoryNode> = {
  "Motos": null,
  
  "Motor y accesorios": [
   {
    "Accesorios": [
      "Casco",
      "Botas de moto",
      "Guantes",
      "Chaqueta",
      "Protectores"
    ]
  },
    "GPS y electrónica",
    "Herramientas de moto",
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
  ],

  "Moda y accesorios": {
  "Ropa": [
    "Vestidos",
    "Faldas",
    "Pantalones",
    "Camisas",
    "Chaquetas",
    "Abrigos",
    "Sudaderas",
    "Trajes",
    "Ropa deportiva",
    "Ropa interior",
    "Casaca",
  ],
  "Calzado": [
    "Zapatillas",
    "Zapatos",
    "Botas",
    "Sandalias",
    "Chanclas",
    "Tacones",
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
        ]
      },
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
        ]
      },
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
        ]
      }
    ],
    "Sonido: auriculares y altavoces": [
      {
        "Dispositivos de sonido": [
          "Altavoces",
          "Auriculares",
          "Home cinema",
          "Minicadenas",
          "Radios",
          "Reproductores de CD",
          "Reproductores de vinilos",
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
        ]
      }
    ],
    "Fotografía: cámaras y drones": [
      {
        "Cámaras": [
          "Cámaras compactas",
          "Cámaras deportivas",
          "Cámaras instantáneas",
          "Cámaras réflex",
          "Cámaras sin espejo",
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
        ]
      }
    ],
    "Telefonía: móviles y smartwatches": [
      "Celulares",
      "Smartwatches y pulsera de actividad",
      "Teléfonos vintage",
      "Teléfonos fijos",
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
        ]
      }
    ],
    "Informática: ordenadores y tablets": [
      "Laptops",
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
    "Entradas y eventos",
    "Coleccionismo deportivo",
    "Arte y manualidades",
    "Juguetes y juegos",
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
  },
  "Electrodomésticos": [

  {
    "Electrodomésticos de cocina": [
      "Refrigeradoras y congeladoras",
      "Cocinas y hornos",
      "Microondas",
      "Campanas extractoras",
      "Lavavajillas"
    ]
  },

  {
    "Lavandería y plancha": [
      "Lavadoras",
      "Secadoras",
      "Centros de lavado",
      "Planchas",
      "Centros de planchado",
      "Vaporizadores"
    ]
  },

  {
    "Pequeños electrodomésticos": [
      "Licuadoras",
      "Batidoras",
      "Procesadores de alimentos",
      "Cafeteras",
      "Tostadoras",
      "Sandwicheras",
      "Freidoras de aire",
      "Ollas arroceras",
      "Exprimidores",
      "Hervidores eléctricos",
      "Parrillas eléctricas",
      "Aspiradoras",
      "Secadores de pelo",
      "Planchas de cabello"
    ]
  },

  {
    "Piezas y recambios": [
      "Filtros",
      "Motores",
      "Bandejas",
      "Puertas",
      "Accesorios"
    ]
  },

  {
    "Vitrocerámica": [
      "Cocinas vitrocerámicas",
      "Repuestos de vitrocerámica"
    ]
  },
],

  "Cine, Libros y Música": {
    "Cine": [
      "Cine y películas",
      "Merchandising de cine",
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

    ],
    "Baño e higiene": [
      "Bañeras",
      "Esponjas y termómetros",
      "Orinales",
    ],
    "Carros, sillas y accesorios": [
      "Accesorios de carros y sillas",
      "Carros de bebé",
      "Mochilas portabebés",
      "Sillas de coche",
    ],
    "Habitación": [
      "Armarios y cómodas",
      "Cunas",
      "Decoración infantil",
      "Otros muebles",
    ],
    "Juguetes": [
      "Juguetes de aprendizaje",
      "Juguetes de construcción",
      "Juguetes electrónicos",
      "Juguetes musicales",
      "Muñecas y accesorios",
      "Peluches",
      "Vehículos y pistas",
    ],
    "Ropa y calzado": [
      "Abrigos",
      "Camisetas y camisas",
      "Calzado",
      "Conjuntos",
      "Pantalones y faldas",
      "Ropa interior",
      "Vestidos",
    ],
    "Seguridad": [
      "Barreras de seguridad",
      "Cámaras y vigilabebés",
      "Intercomunicadores",
    ],
    "Tronas y andadores": [
      "Andadores",
      "Correpasillos",
      "Tronas"
    ],
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

  "Vehículos": [
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
  ],
  "Industria y agricultura": [

  {
    "Maquinaria industrial": [
      "Compresores",
      "Generadores y plantas eléctricas",
      "Soldadoras",
      "Montacargas",
      "Máquinas CNC",
      "Bombas industriales",
      "Tornos y fresadoras",
      "Compresores de aire"
    ]
  },

  {
    "Herramientas profesionales": [
      "Taladros y rotomartillos",
      "Esmeriles y amoladoras",
      "Sierras eléctricas",
      "Atornilladores",
      "Herramienta manual",
      "Kits y estuches de herramientas"
    ]
  },

  {
    "Seguridad industrial (EPP)": [
      "Cascos y caretas",
      "Lentes y protección facial",
      "Guantes",
      "Botas de seguridad",
      "Arneses y líneas de vida",
      "Protectores auditivos",
      "Ropa ignífuga y de alta visibilidad"
    ]
  },

  {
    "Instrumentación y medición": [
      "Multímetros y pinzas amperimétricas",
      "Manómetros",
      "Termómetros y pirómetros",
      "Medidores láser y niveles",
      "Básculas y balanzas",
      "Registradores de datos (dataloggers)"
    ]
  },

  {
    "Suministros y consumibles": [
      "Abrasivos y discos",
      "Adhesivos y selladores",
      "Lubricantes y grasas",
      "Electrodos y alambres de soldadura",
      "Tornillería y fijaciones",
      "Cadenas, correas y poleas",
      "Mangueras y conectores"
    ]
  },

  {
    "Neumática e hidráulica": [
      "Cilindros y actuadores",
      "Válvulas y distribuidores",
      "Compresores",
      "Mangueras y racores",
      "Unidades hidráulicas",
      "Filtros y reguladores"
    ]
  },

  {
    "Energía y bombeo": [
      "Bombas de agua",
      "Bombas sumergibles",
      "Hidrolavadoras",
      "Motores eléctricos",
      "Paneles solares",
      "Controladores e inversores",
      "Baterías"
    ]
  },

  {
    "Agricultura": [
      {
        "Maquinaria agrícola": [
          "Tractores",
          "Cosechadoras",
          "Sembradoras",
          "Arados y rastras",
          "Pulverizadoras",
          "Motocultores"
        ]
      },
      {
        "Riego": [
          "Sistemas de goteo",
          "Aspersores",
          "Bombas para riego",
          "Tuberías y fittings",
          "Temporizadores y controladores"
        ]
      },
      {
        "Insumos agrícolas": [
          "Semillas",
          "Fertilizantes",
          "Sustratos",
          "Control de plagas"
        ]
      },
      {
        "Herramientas agrícolas": [
          "Machetes",
          "Palas y picos",
          "Azadones",
          "Carretillas",
          "Cosecha y poda"
        ]
      },
      {
        "Invernaderos y viveros": [
          "Estructuras y túneles",
          "Mallas y plásticos",
          "Bandejas y macetas",
          "Sistemas de ventilación"
        ]
      },
      {
        "Ganadería": [
          "Alimento animal",
          "Bebederos y comederos",
          "Cercos eléctricos",
          "Ordeñadoras",
          "Identificación (aretes)",
          "Medicinas y suplementos"
        ]
      },
      {
        "Avicultura y porcicultura": [
          "Incubadoras",
          "Criadoras y calefactores",
          "Comederos y bebederos",
          "Jaulas y corrales"
        ]
      },
      {
        "Apicultura": [
          "Colmenas",
          "Trajes y protección",
          "Extractores de miel",
          "Herramientas de apicultor"
        ]
      },
      {
        "Acuicultura": [
          "Aireadores",
          "Bombas y filtros",
          "Redes",
          "Tanques y liners"
        ]
      }
    ]
  },
],

  "Otros": null,
};


export default DATA;    