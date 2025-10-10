// stores/createPostStore.ts
import { create } from "zustand";
import type { StateCreator } from "zustand";

/** Datos principales (solo campos, sin métodos) */
export type CreatePostData = {
  images: string[]; // URIs locales o storageIds
  title: string;
  price: number; // con comas formateadas si quieres
  currency: string; // e.g. "PEN" | "USD"
  condition: string; // "Nuevo" | "Usado" | ...
  category: string; // ej ['Ropa','Zapatos']
  subcategory: string;
  location: string; // texto libre
  nivel2?: string; // categoría nivel 2 (opcional)
  nivel3?: string; // categoría nivel 3 (opcional)
  nivel4?: string; // categoría nivel 4 (opcional)
  description: string;
  tipo:string;
  // Envío
  deliveryEnabled: boolean;
  number: string;

  // Vista previa de coordenadas (por ejemplo desde el mapa)
  previewLat?: number;
  previewLng?: number;
};

/** Store = datos + métodos */
export type CreatePostStore = CreatePostData & {
  setField: <K extends keyof CreatePostData>(
    key: K,
    value: CreatePostData[K]
  ) => void;
  setMany: (patch: Partial<CreatePostData>) => void;
  addImage: (uri: string) => void;
  removeImageAt: (index: number) => void;
  clear: () => void;
};

/** Estado inicial */
const initialState: CreatePostData = {
  images: [],
  title: "",
  price: 0,
  tipo: "",
  currency: "PEN",
  condition: "",
  category: "",
  subcategory: "",
  nivel2: undefined,
  nivel3: undefined,
  nivel4: undefined,
  location: "",
  description: "",
  deliveryEnabled: true,
  number: "",
  previewLat: undefined,
  previewLng: undefined,
};

/**
 * Tipado explícito del slice/creator para evitar `any` en set/get
 * StateCreator<CreatePostStore> es (set, get, api) => CreatePostStore
 */
const createPostSlice: StateCreator<CreatePostStore> = (set, get) => ({
  // fields
  ...initialState,

  // setters
  setField: (<K extends keyof CreatePostData>(
    key: K,
    value: CreatePostData[K]
  ) =>
    set((state) => ({
      ...state,
      [key]: value,
    }))) as CreatePostStore["setField"],

  setMany: (patch: Partial<CreatePostData>) =>
    set((state) => ({ ...state, ...patch })),

  addImage: (uri: string) =>
    set((s) => ({ images: [...s.images, uri].slice(0, 10) })),

  removeImageAt: (index: number) =>
    set((s) => {
      const copy = [...s.images];
      if (index >= 0 && index < copy.length) copy.splice(index, 1);
      return { images: copy };
    }),

  clear: () => set(() => ({ ...initialState })),
});

/** Export: el store tipado */
export const useCreatePostStore = create<CreatePostStore>(createPostSlice);
