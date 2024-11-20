import React from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200 to-purple-200 ">
      <div className="pt-2 ml-32 pl-16 flex">
        <Image
          className=" "
          src="/images/logo.png"
          height={2}
          width={150}
          alt="logo"
        />
        <ul className=" pt-2 flex font-medium text-gray-600 pl-44 ml-32">
          <li className=" pl-16 ">
            <a href="" className="text-xl pl-16 ">
              {" "}
              Welcome{" "}
            </a>
          </li>
          <li>
            <a href="#Footer" className="text-xl pl-16 ">
              {" "}
              About{" "}
            </a>
          </li>
          <li>
            <a href="#Footer" className="text-xl pl-16 ">
              {" "}
              Help{" "}
            </a>
          </li>
          <li>
            <a href="#Footer" className="text-xl pl-16 ">
              {" "}
              Contact{" "}
            </a>
          </li>
        </ul>

        <nav className=" pl-16 ">
          <button className=" capitalize w-40 h-10 bg-white rounded-md ">
            <Link
              href="auth/register"
              className=" font-medium text-violet-900 text-xl"
            >
              Sign up
            </Link>
          </button>
        </nav>
        <nav className=" pl-8  ">
          <button className=" capitalize w-40 h-10 bg-violet-900 rounded-md ">
            <Link
              href="auth/login"
              className="font-medium w-full text-white text-xl"
            >
              Log in
            </Link>
          </button>
        </nav>
      </div>
    </nav>
  );
};

export default Navbar;
