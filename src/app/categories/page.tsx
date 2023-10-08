"use client";
import React from "react";
import DefaultLayout from "@/layout/DefaultLayout";
import Link from "next/link";
import { Grid } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import { _ } from "gridjs-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { handleCreateCategory } from "@/api/handleApi";
import { toast } from "sonner";

type Props = {};

const page = (props: Props) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
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
        "text-align": "center",
      },
      th: {
        "white-space": "nowrap",
        "background-color": "var(--cl-primary)",
        color: "white",
      },
    },
    columns: ["ID", "name", "actions"],
    server: {
      url: "http://localhost:8080/categories",
      then: (data: any) =>
        data.map((category: any) => [
          category.id || category.category_id,
          category.category_name,
          _(
            <Link
              href={`/categories/${category.id || category.category_id}`}
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

  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "To Short")
      .max(10, "To Long")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema: SignupSchema,
    validateOnChange: false,
    onSubmit: async (values) => {
      const response = await handleCreateCategory({
        category_id: `CT${Date.now()}`,
        category_name: values.name,
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

  return (
    <DefaultLayout>
      <div className="card card-table">
        <div className="card-table-content" ref={wrapperRef}></div>
        <div className="card-table-action flex justify-end mb-[16px]">
          <button
            className="btn-primary btn-sz-medium"
            onClick={() => setIsMounted(!isMounted)}
          >
            {isMounted === true ? "Hide form" : "Add new category"}
          </button>
        </div>
        {isMounted === true && (
          <form className="card-form block" onSubmit={formik.handleSubmit}>
            <div className="card-form_section col-mp w-1/2">
              <div className="card-form_label">Category's name</div>
              <input
                type="text"
                className="card-form_input"
                id="name"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              ></input>
              <p className="card-form_error">{formik.errors.name}</p>
            </div>
            <button
              type="submit"
              className="btn-primary btn-sz-medium mx-[8px] my-[12px]"
            >
              Create New Category
            </button>
          </form>
        )}
      </div>
    </DefaultLayout>
  );
};

export default page;
