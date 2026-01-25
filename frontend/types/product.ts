export interface Product {
  _id: string;
  title: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  isTrending?: boolean;
  createdAt?: string;
}
