"use client";
import React from "react";
import Image from "next/image";
import * as Yup from "yup";
import { useFormik } from "formik";
import DefaultLayout from "@/layout/DefaultLayout";
import { IBook } from "@/interfaces/customInterface";
import {
  handleGetBook,
  handleDeleteBook,
  handleGetAllCategories,
  handleUpdateBook,
} from "@/api/handleApi";
import { toast } from "sonner";
import moment from "moment";

type Props = {
  params: {
    id: string;
  };
};

const page = (props: Props) => {
  const [book, setBook] = React.useState<IBook>();
  const [categories, setCategories] = React.useState<
    {
      id: string;
      name: string;
    }[]
  >();
  const [isEdit, setIsEdit] = React.useState(false);

  React.useEffect(() => {
    const requestApi = async () => {
      const response = await handleGetBook(props.params.id);
      if (response) setBook(response);
    };
    requestApi();
  }, []);

  const handleClickDeleteButton = () => {
    const requestApi = async () => {
      const response = await handleDeleteBook(props.params.id);
      if (response) window.location.assign("/books");
    };
    requestApi();
  };

  const SignupSchema = Yup.object().shape({
    title: Yup.string()
      .min(2, "To Short")
      .max(10, "To Long")
      .required("Required"),
    price: Yup.number()
      .required("Required")
      .positive("The price must larger than 0")
      .min(1),
    rate: Yup.number().positive().max(5).default(5),
    author: Yup.string()
      .required("Required")
      .min(2, "To Short")
      .max(50, "To Long"),
    published_date: Yup.date()
      .default(() => new Date())
      .max(new Date(), "The Book can not publish in the future"),
    quantity: Yup.number()
      .positive("The quantity must larger than or equal 0")
      .integer()
      .default(0),
    description: Yup.string().default(""),
    category: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      title: book ? book.title : "",
      price: book ? book.price : "",
      rate: book ? book.rate : "",
      author: book ? book.author : "",
      published_date: book ? book.published_date : new Date(),
      quantity: book ? book.quantity : "",
      description: book ? book.description : "",
      category:
        book && categories
          ? categories.find((category) => category.name === book.category)?.id
          : "",
    },
    enableReinitialize: true,
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const response = await handleUpdateBook({
        book_id: book ? book.book_id : `BK${Date.now()}`,
        title: values.title,
        price: Number(values.price),
        rate: Number(values.rate),
        author: values.author,
        published_date: new Date(values.published_date),
        quantity: Number(values.quantity),
        description: values.description,
        category: values.category || "",
      });
      if (response.errors) {
        toast.error(response.errors.message, {
          action: {
            label: "Cancel",
            onClick: () => {},
          },
          position: "top-right",
          duration: 2000,
        });
      } else window.location.reload();
    },
  });

  React.useEffect(() => {
    if (Object.keys(formik.errors).length > 0) {
      for (let error in formik.errors) {
        toast.error(`${error}: ${formik.errors[error]}`, {
          action: {
            label: "Cancel",
            onClick: () => {},
          },
          position: "top-right",
          duration: 5000,
        });
      }
    }
  }, [formik.errors]);

  React.useEffect(() => {
    const queryCategories = async () => {
      const response = await handleGetAllCategories();
      if (response.errors) {
        toast.error(response.errors.message, {
          action: {
            label: "Cancel",
            onClick: () => {},
          },
          position: "top-right",
          duration: 2000,
        });
      } else {
        setCategories(response);
      }
    };
    queryCategories();
  }, []);

  const handleEditButton = () => setIsEdit(!isEdit);
  return (
    <DefaultLayout>
      <div className="card gap-[8px]">
        <div className="w-1/4">
          <Image
            alt="avatar"
            src={book?.image_book || "/images/unknown.jpg"}
            width={100}
            height={100}
            className="w-full"
          />
        </div>
        <form
          className={`card-content ${isEdit && "card-form"}`}
          onSubmit={formik.handleSubmit}
        >
          <div className="card-content_header">
            {isEdit ? (
              <div className="flex items-center gap-[8px]">
                <label className="w-[100px]">Title</label>
                <input
                  type="text"
                  className="card-form_input w-[calc(100% - 100px)]"
                  id="title"
                  name="title"
                  onChange={formik.handleChange}
                  value={formik.values.title}
                ></input>
              </div>
            ) : (
              `${book?.title}`
            )}
          </div>
          <div className="card-content_body">
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Price</label>
                  <input
                    type="number"
                    className="card-form_input"
                    id="price"
                    name="price"
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  ></input>
                </div>
              ) : (
                `Price: ${book?.price} $`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Quantity</label>
                  <input
                    type="number"
                    className="card-form_input"
                    id="quantity"
                    name="quantity"
                    onChange={formik.handleChange}
                    value={formik.values.quantity}
                  ></input>
                </div>
              ) : (
                `Quantity: ${book?.quantity}`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Author</label>
                  <input
                    type="text"
                    className="card-form_input"
                    id="author"
                    name="author"
                    onChange={formik.handleChange}
                    value={formik.values.author}
                  ></input>
                </div>
              ) : (
                `Author: ${book?.author}`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Published date</label>
                  <input
                    type="date"
                    className="card-form_input"
                    id="published_date"
                    name="published_date"
                    onChange={formik.handleChange}
                    value={String(formik.values.published_date)}
                  ></input>
                </div>
              ) : (
                `Published date: ${moment(book?.published_date).format(
                  "DD/MM/YYYY"
                )}`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Rate</label>
                  <select
                    className="card-form_input"
                    id="rate"
                    name="rate"
                    onChange={formik.handleChange}
                    value={formik.values.rate}
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                </div>
              ) : (
                `Rate: ${book?.rate}`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Category</label>
                  <select
                    className="card-form_input"
                    id="category"
                    name="category"
                    onChange={formik.handleChange}
                    value={formik.values.category}
                  >
                    {categories &&
                      categories.map((category, index) => {
                        return (
                          <option key={index} value={category.id}>
                            {category.name}
                          </option>
                        );
                      })}
                  </select>
                </div>
              ) : (
                `Category: ${book?.category}`
              )}
            </p>
            <p>
              {isEdit ? (
                <div className="flex items-center gap-[8px] ">
                  <label className="w-[100px]">Description</label>
                  <textarea
                    className="card-form_input min-h-[100px]"
                    name="description"
                    id="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                  ></textarea>
                </div>
              ) : (
                `Description: ${book?.description}`
              )}
            </p>
          </div>
          {isEdit === true && (
            <button
              type="submit"
              className="btn-primary btn-sz-medium mx-[8px] my-[12px]"
            >
              Update Book's Information
            </button>
          )}
        </form>
        <div className="card-action flex flex-col gap-[8px]">
          <button
            className="btn btn-primary btn-sz-medium"
            type="button"
            onClick={handleEditButton}
          >
            {isEdit ? "Cancel" : "Edit"}
          </button>
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
