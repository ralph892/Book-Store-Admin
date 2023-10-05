"use client";
import React from "react";
import Image from "next/image";
import DefaultLayout from "@/layout/DefaultLayout";
import { IUser } from "@/interfaces/customInterface";
import { handleGetUserInformation, handleDeleteUser } from "@/api/handleApi";

type Props = {
  params: {
    id: string;
  };
};

const page = (props: Props) => {
  const [user, setUser] = React.useState<IUser>();

  React.useEffect(() => {
    const requestApi = async () => {
      const response = await handleGetUserInformation(props.params.id);
      if (response) setUser(response);
    };
    requestApi();
  }, []);

  const handleClickDeleteButton = () => {
    const requestApi = async () => {
      const response = await handleDeleteUser(props.params.id);
      if (response) window.location.assign("/users");
    };
    requestApi();
  };

  return (
    <DefaultLayout>
      <div className="card">
        <div className="w-1/4">
          <Image
            alt="avatar"
            src={user?.avatar || "/images/unknown.jpg"}
            width={100}
            height={100}
            className="w-full"
          />
        </div>
        <div className="card-content">
          <div className="card-content_header">{`${user?.firstName} ${user?.lastName}`}</div>
          <div className="card-content_body">
            <p>Username: {user?.username}</p>
            <p>Password: {user?.password}</p>
            <p>Address: {user?.address}</p>
            <p>Phone number: {user?.phoneNumber}</p>
            <p>Email: {user?.email}</p>
          </div>
        </div>
        <div className="card-action">
          <button
            className="btn btn-primary btn-sz-medium"
            onClick={handleClickDeleteButton}
          >
            Delete
          </button>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default page;
