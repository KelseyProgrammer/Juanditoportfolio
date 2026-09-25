export type Photo = {
  id: string;
  src: string;        // put files in /public/photos and reference "/photos/xxx.jpg"
  alt: string;
  caption: string;    // the postcard label, e.g. "Valletta, Malta"
  note?: string;      // handwritten note on the back of the postcard
  rotate: number;     // resting tilt in degrees
};

// Placeholder set — replace src with real exports from Juandito's archive.
export const photos: Photo[] = [
  { id: "malta-street", src: "/photos/placeholder-1.jpg", alt: "Balconied street in Valletta", caption: "Valletta, Malta", note: "Sun came out for exactly eleven minutes. Made it count.", rotate: -1.5 },
  { id: "field", src: "/photos/placeholder-2.jpg", alt: "Model in a red coat in tall grass", caption: "Coastal Trail", note: "Wind did the styling.", rotate: 1.5 },
  { id: "bus", src: "/photos/placeholder-3.jpg", alt: "Vintage bus, black and white", caption: "Valletta — 1962 Bus", note: "Still running. Barely.", rotate: -1 },
  { id: "tenerife", src: "/photos/placeholder-4.jpg", alt: "Painted wave mural", caption: "Santa Cruz de Tenerife", note: "Found this wall by getting lost.", rotate: 1 },
  { id: "studio", src: "/photos/placeholder-5.jpg", alt: "Studio portrait, fur and pearls", caption: "Studio — Fur & Pearls", note: "One light. One coat. Done by 4.", rotate: -2 },
  { id: "nantucket", src: "/photos/placeholder-6.jpg", alt: "Grey coastline, Nantucket", caption: "Nantucket", note: "Fog rolled in. Better than the plan.", rotate: 1.5 }
];
