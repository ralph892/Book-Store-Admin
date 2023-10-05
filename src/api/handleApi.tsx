import { IUser } from "@/interfaces/customInterface";
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
});

export const handleCreateUser = async (data: IUser) => {
  try {
    const formatData = { ...data };
    const response = await instance.post(`/users`, formatData);
    return response.data;
  } catch (error: any) {
    return { error: error.response.data };
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
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
