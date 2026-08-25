export type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type UserResponse = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
};

export type NamedResource = {
  id?: string;
  name: string;
};

export type ProductResponse = {
  id: string;
  name: string;
  description: string;
  price: number;
  in_stock: boolean;
  is_rental: boolean;
  brand?: NamedResource;
  category?: NamedResource;
};

export type PaginatedProductsResponse = {
  current_page: number;
  data: ProductResponse[];
  total: number;
  last_page?: number;
  per_page?: number;
};
