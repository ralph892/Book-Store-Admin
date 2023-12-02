"use client";
import React from "react";
import DefaultLayout from "@/layout/DefaultLayout";
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import Link from "next/link";
import { _ } from "gridjs-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import moment from "moment";
import {
  handleCreateBook,
  handleGetAllCategories,
  handleUploadFile,
} from "@/api/handleApi";
import { RiIndeterminateCircleLine, RiUploadCloud2Line } from "react-icons/ri";
import Image from "next/image";

type Props = {};

const page = (props: Props) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const uploadImageRef = React.useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File>();
  const [image, setImage] = React.useState<string>();
  const [categories, setCategories] = React.useState<
    {
      category_id: string;
      category_name: string;
    }[]
  >();

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
        "font-family": "var(--font-primary-regular)",
        "text-align": "center",
      },
      th: {
        "white-space": "nowrap",
        "background-color": "var(--cl-primary)",
        color: "var(--txt-primary)",
      },
      td: {
        overflow: "hidden",
        "text-overflow": "ellipsis",
        "max-width": "300px",
        "min-width": "100px",
      },
    },
    columns: [
      "ID",
      "Title",
      "Price",
      "Rate",
      "Author",
      "Published date",
      "Quantity",
      "Description",
      "Category",
      "Actions",
    ],
    server: {
      url: "http://localhost:8080/books",
      then: (data: any) =>
        data.map((book: any) => [
          book.id || book.book_id,
          book.title,
          book.price,
          book.rate,
          book.author,
          moment(book.published_date).format("DD/MM/YYYY"),
          book.quantity,
          book.description,
          book.category_name,
          _(
            <Link
              href={`/books/${book.id || book.book_id}`}
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
    title: Yup.string()
      .min(2, "To Short")
      .max(100, "To Long")
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
    category: Yup.string().required("Required").default("unknown"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      price: "",
      rate: 5,
      author: "",
      published_date: new Date(),
      quantity: "",
      description: "",
      category: "",
      image_book: undefined,
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const data = new FormData();
      if (imageFile) data.append("imageFile", imageFile);
      const uploadResponse = await handleUploadFile("books", data);
      const response = await handleCreateBook({
        book_id: `BK${Date.now()}`,
        title: values.title,
        price: Number(values.price),
        rate: Number(values.rate),
        author: values.author,
        published_date: new Date(values.published_date),
        quantity: Number(values.quantity),
        description: values.description,
        category:
          categories && categories.length > 0
            ? values.category === ""
              ? categories[0].category_id
              : values.category
            : "",
      });
      if (response !== undefined) {
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
      }
    },
  });

  React.useEffect(() => {
    const queryCategories = async () => {
      const response = await handleGetAllCategories();
      if (response !== undefined) {
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
      }
    };
    queryCategories();
  }, []);

  return (
    <DefaultLayout>
      <div className="card card-table">
        <div className="card-table-content" ref={wrapperRef}></div>
        <div className="card-table-action flex justify-end mb-[16px]">
          <button
            className="btn-primary btn-sz-medium"
            onClick={() => setIsMounted(!isMounted)}
          >
            {isMounted === true ? "Hide form" : "Add new book"}
          </button>
        </div>
        {isMounted && (
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
                    alt="image book"
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
            <div className="card-form_section col-mp w-full">
              <div className="card-form_label">Book's title</div>
              <input
                type="text"
                className="card-form_input"
                id="title"
                name="title"
                onChange={formik.handleChange}
                value={formik.values.title}
              ></input>
              <p className="card-form_error">{formik.errors.title}</p>
            </div>
            <div className="w-full flex">
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Price</div>
                <input
                  type="number"
                  className="card-form_input"
                  id="price"
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                ></input>
                <p className="card-form_error">{formik.errors.price}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Quantity</div>
                <input
                  type="number"
                  className="card-form_input"
                  id="quantity"
                  name="quantity"
                  onChange={formik.handleChange}
                  value={formik.values.quantity}
                ></input>
                <p className="card-form_error">{formik.errors.quantity}</p>
              </div>
            </div>
            <div className="w-full flex">
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Author</div>
                <input
                  type="text"
                  className="card-form_input"
                  id="author"
                  name="author"
                  onChange={formik.handleChange}
                  value={formik.values.author}
                ></input>
                <p className="card-form_error">{formik.errors.author}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Published date</div>
                <input
                  type="date"
                  className="card-form_input"
                  id="published_date"
                  name="published_date"
                  onChange={formik.handleChange}
                  value={String(formik.values.published_date)}
                ></input>
                <p className="card-form_error">
                  {formik.errors.published_date &&
                    `${formik.errors.published_date}`}
                </p>
              </div>
            </div>
            <div className="w-full flex">
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Rating</div>
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
                <p className="card-form_error">{formik.errors.rate}</p>
              </div>
              <div className="card-form_section col-mp w-1/2">
                <div className="card-form_label">Category</div>
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
                        <option key={index} value={category.category_id}>
                          {category.category_name}
                        </option>
                      );
                    })}
                </select>
                <p className="card-form_error">{formik.errors.category}</p>
              </div>
            </div>
            <div className="card-form_section col-mp w-full">
              <div className="card-form_label">Description</div>
              <textarea
                className="card-form_input min-h-[100px]"
                name="description"
                id="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn-primary btn-sz-medium mx-[8px] my-[12px]"
            >
              Create New Book
            </button>
          </form>
        )}
      </div>
    </DefaultLayout>
  );
};

export default page;
