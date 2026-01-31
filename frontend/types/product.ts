export interface Product {
  _id: string;
  title: string;
  price: number;
 
  category: string;
  image?: string;
  description?: string;
  isTrending?: boolean;
  createdAt?: string;
  images?: string[];
  stock?: number;
  mrp?: number;
  sizes?: string[];   // ["S","M","L","XL"]
  colors?: string[];
}
