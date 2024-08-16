export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface CategoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}
