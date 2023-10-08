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
  return (
    <div>
      <nav className="sidebar">
        <div className="">
          <Image
            alt="logo"
            src="/images/logo.jpg"
            width={100}
            height={100}
            className="w-full h-[140px]"
          />
        </div>
        <li className="list-none flex flex-col ">
          <ul className="sidebar-item active flex items-center gap-[8px] p-[15px]">
            <RiProfileFill className="w-[24px]" />
            Home
          </ul>
          <Link href={"/users"}>
            <ul className="sidebar-item flex items-center gap-[8px] p-[15px]">
              <RiAccountBoxFill className="w-[24px]" />
              Users
            </ul>
          </Link>
          <Link href={"/books"}>
            <ul className="sidebar-item flex items-center gap-[8px] p-[15px]">
              <RiBook2Fill className="w-[24px]" />
              Books
            </ul>
          </Link>
          <Link href={"/categories"}>
            <ul className="sidebar-item flex items-center gap-[8px] p-[15px]">
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
