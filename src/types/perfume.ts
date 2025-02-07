export interface Perfume {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  description: string;
  notes: string[];
  created_at: string;
  updated_at: string;
}

export type PerfumeFormData = Omit<Perfume, 'id' | 'created_at' | 'updated_at'>;