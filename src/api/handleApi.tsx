import { IBook, IUser } from "@/interfaces/customInterface";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

// users
export const handleCreateUser = async (data: IUser) => {
  try {
    const formatData = { ...data };
    const response = await instance.post(`/users`, formatData);
    return response.data;
  } catch (error: any) {
    return { errors: error.response.data };
  }
};

export const handleGetUserInformation = async (id: string) => {
  try {
    const response = await instance.get(`/users/${id}`);
    return response.data[0];
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteUser = async (id: string) => {
  try {
    const response = await instance.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// categories
export const handleCreateCategory = async (data: {
  category_id: string;
  category_name: string;
}) => {
  try {
    const response = await instance.post("/categories", data);
    return response.data;
  } catch (error: any) {
    return { errors: error.response.data };
  }
};

export const handleGetAllCategories = async () => {
  try {
    const response = await instance.get("/categories");
    return response.data;
  } catch (error: any) {
    return { errors: error.response.data };
  }
};

// books
export const handleCreateBook = async (data: IBook) => {
  try {
    const response = await instance.post("/books", data);
    return response.data;
  } catch (error: any) {
    return { errors: error.response.data };
  }
};

export const handleGetBook = async (id: string) => {
  try {
    const response = await instance.get(`/books/${id}`);
    return response.data[0];
  } catch (error) {
    console.log(error);
  }
};

export const handleDeleteBook = async (id: string) => {
  try {
    const response = await instance.delete(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const handleUpdateBook = async (data: IBook) => {
  try {
    const response = await instance.patch(`/books/${data.book_id}`, data);
    return response.data;
  } catch (error: any) {
    return { errors: error.response.data };
  }
};
