"use client";
import React from "react";
import { Grid } from "gridjs";
import { _ } from "gridjs-react";
import DefaultLayout from "@/layout/DefaultLayout";
import "gridjs/dist/theme/mermaid.css";
import Link from "next/link";
import Image from "next/image";
import { useFormik } from "formik";
import { handleCreateUser, handleUploadFile } from "@/api/handleApi";
import { IUser } from "@/interfaces/customInterface";
import * as Yup from "yup";
import { toast } from "sonner";
import { RiIndeterminateCircleLine, RiUploadCloud2Line } from "react-icons/ri";

type Props = {};

const page = (props: Props) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const uploadImageRef = React.useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = React.useState<File>();
  const [image, setImage] = React.useState<string>();
  const [isMounted, setIsMounted] = React.useState(false);

  const grid = new Grid({
    search: {
      server: { url: (prev: any, keyword: any) => `${prev}?search=${keyword}` },
    },
    sort: true,
    resizable: true,
    autoWidth: true,
    pagination: {
      limit: 10,
    },
    style: {
      table: {
        "white-space": "nowrap",
      },
      th: {
        "white-space": "nowrap",
        "background-color": "var(--cl-primary)",
        color: "white",
      },
    },
    columns: [
      "ID",
      "Username",
      "Password",
      "First name",
      "Last Name",
      "Address",
      "Phone number",
      "Email",
      "Actions",
    ],
    server: {
      url: "http://localhost:8080/users",
      then: (data: any) =>
        data.map((user: any) => [
          user.id || user.user_id,
          user.username,
          user.password,
          user.firstName,
          user.lastName,
          user.address,
          user.phoneNumber,
          user.email,
          _(
            <Link
              href={`/users/${user.id || user.user_id}`}
              className="my-[8px] border rounded btn-primary btn-sz-medium"
            >
              Edit
            </Link>
          ),
        ]),
    },
  });

  React.useEffect(() => {
    grid.render(wrapperRef.current);
  });

  const handleUploadImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (uploadImageRef.current) uploadImageRef.current.click();
  };

  const handleChangeImage = () => {
    if (uploadImageRef.current && uploadImageRef.current.files !== null) {
      const file = uploadImageRef.current.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "To Short")
      .max(50, "To Long")
      .required("Required"),
    password: Yup.string()
      .min(2, "To Short")
      .max(50, "To Long")
      .required("Required"),
    firstName: Yup.string()
      .min(2, "To Short")
      .max(50, "To Long")
      .required("Required"),
    lastName: Yup.string()
      .min(2, "To Short")
      .max(50, "To Long")
      .required("Required"),
    address: Yup.string()
      .min(2, "To Short")
      .max(50, "To Long")
      .required("Required"),
    phoneNumber: Yup.string()
      .min(9, "To Short")
      .max(15, "To Long")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: 0,
      email: "",
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const data = new FormData();
      if (imageFile) data.append("imageFile", imageFile);
      const uploadResponse = await handleUploadFile("users", data);
      const response = await handleCreateUser(values as IUser);
      if (response !== undefined) {
        if (response.errors) {
          toast.error(response.errors.message[0], {
            action: {
              label: "Cancel",
              onClick: () => {},
            },
            position: "top-right",
            duration: 2000,
          });
        } else window.location.reload();
      }
    },
  });

  const handleMounted = () => setIsMounted(!isMounted);

  return (
    <DefaultLayout>
      <div className="card card-table">
        <div className="card-table-content" ref={wrapperRef}></div>
        <div className="card-table-action flex justify-end mb-[16px]">
          <button className="btn-primary btn-sz-medium" onClick={handleMounted}>
            {isMounted === true ? "hide form" : "Add new user"}
          </button>
        </div>
        {isMounted === true && (
          <form className="card-form block" onSubmit={formik.handleSubmit}>
            <div className="card-form_upload">
              {image === undefined ? (
                <div className="upload_dropzone">
                  <RiUploadCloud2Line />
                  <span className="upload_dropzone_title">
                    Drag & Drop or click to Upload
                  </span>
                  <span className="upload_dropzone_subtitle">
                    320x320 (Max: 120KB)
                  </span>
                  <input
                    type="file"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleChangeImage}
                    id="image_book"
                    name="image_book"
                    ref={uploadImageRef}
                  ></input>
                  <button
                    className="btn-primary btn-sz-medium mt-[8px]"
                    onClick={(e) => handleUploadImage(e)}
                  >
                    Upload cover image
                  </button>
                </div>
              ) : (
                <div className="upload_image_wrapper">
                  <Image
                    src={image || "./images/unknown.jpg"}
                    alt="avatar user"
                    width={100}
                    height={100}
                    className="upload_image"
                  />
                  <div className="upload_overlay">
                    <button
                      onClick={() => {
                        setImage(undefined);
                        setImageFile(undefined);
                      }}
                    >
                      <RiIndeterminateCircleLine />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="w-full flex">
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">Username</label>
                <input
                  type="text"
                  className="card-form_input"
                  id="username"
                  name="username"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                ></input>
                <p className="card-form_error">{formik.errors.username}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">Password</label>
                <input
                  type="password"
                  className="card-form_input"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                ></input>
                <p className="card-form_error">{formik.errors.password}</p>
              </div>
            </div>
            <div className="flex w-full">
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">First name</label>
                <input
                  type="text"
                  className="card-form_input"
                  id="firstName"
                  name="firstName"
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                ></input>
                <p className="card-form_error">{formik.errors.firstName}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">Last name</label>
                <input
                  type="text"
                  className="card-form_input"
                  id="lastName"
                  name="lastName"
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                ></input>
                <p className="card-form_error">{formik.errors.lastName}</p>
              </div>
            </div>
            <div className="w-full flex">
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">Phone number</label>
                <input
                  type="tel"
                  className="card-form_input"
                  id="phoneNumber"
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  value={formik.values.phoneNumber}
                ></input>
                <p className="card-form_error">{formik.errors.phoneNumber}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <label className="card-form_label">Email</label>
                <input
                  type="email"
                  className="card-form_input"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                ></input>
                <p className="card-form_error">{formik.errors.email}</p>
              </div>
            </div>
            <div className="card-form_section col-mp w-1/2">
              <label className="card-form_label">Address</label>
              <input
                type="text"
                className="card-form_input"
                id="address"
                name="address"
                onChange={formik.handleChange}
                value={formik.values.address}
              ></input>
              <p className="card-form_error">{formik.errors.address}</p>
            </div>
            <button
              type="submit"
              className="btn-primary btn-sz-medium mx-[8px] my-[12px]"
            >
              Create New User
            </button>
          </form>
        )}
      </div>
    </DefaultLayout>
  );
};

export default page;
