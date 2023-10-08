export interface IUser {
  id?: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: number;
  email: string;
  avatar?: string;
}

export interface IBook {
  book_id?: string;
  title: string;
  price: number;
  rate: number;
  author: string;
  published_date: Date;
  quantity: number;
  image_book?: string;
  description?: string;
  category: string;
}
