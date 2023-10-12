"use client";
import React from "react";
import Image from "next/image";
import {
  RiAccountBoxFill,
  RiBook2Fill,
  RiListIndefinite,
  RiProfileFill,
} from "react-icons/ri";
import Link from "next/link";

type Props = {};

const SideBar = (props: Props) => {
  const handleSidebar = (id: string) => {
    const sidebarItems = document.querySelectorAll("ul");
    sidebarItems.forEach((item) => {
      if (item.id === id) item.classList.add("active");
      else item.classList.remove("active");
    });
  };

  return (
    <div>
      <nav className="sidebar">
        <Link href={"/"}>
          <Image
            alt="logo"
            src="/images/logo.jpg"
            width={100}
            height={100}
            className="w-full h-[140px]"
          />
        </Link>
        <li className="list-none flex flex-col ">
          <Link href={"/"} onClick={() => handleSidebar("home")}>
            <ul
              className="sidebar-item active flex items-center gap-[8px] p-[15px]"
              id="home"
            >
              <RiProfileFill className="w-[24px]" />
              Home
            </ul>
          </Link>
          <Link href={"/users"} onClick={() => handleSidebar("users")}>
            <ul
              className="sidebar-item flex items-center gap-[8px] p-[15px]"
              id="users"
            >
              <RiAccountBoxFill className="w-[24px]" />
              Users
            </ul>
          </Link>
          <Link href={"/books"} onClick={() => handleSidebar("books")}>
            <ul
              className="sidebar-item flex items-center gap-[8px] p-[15px]"
              id="books"
            >
              <RiBook2Fill className="w-[24px]" />
              Books
            </ul>
          </Link>
          <Link
            href={"/categories"}
            onClick={() => handleSidebar("categories")}
          >
            <ul
              className="sidebar-item flex items-center gap-[8px] p-[15px]"
              id="categories"
            >
              <RiListIndefinite className="w-[24px]" />
              Categories
            </ul>
          </Link>
        </li>
      </nav>
    </div>
  );
};

export default SideBar;
