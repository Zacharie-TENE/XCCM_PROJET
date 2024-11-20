import { LoginButton } from "@/components/auth/login-button";
import Footer from "@/components/footer/Footer";
import Navbar from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const App = () => {
  return (
    <>
      <div className="h-full ">
        <Navbar />
        <main className=" flex h-full flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 to-purple-200 ">
          <section className=" mb-56 flex h-full">
            <aside className=" h-full w-3/5 pl-44 ml-32 mt-32 items-stretch justify-start">
              <div className="">
                <p className="  text-6xl text-gray-700  font-bold ">
                  Module de Compositon <br />
                  de Contenus
                </p>
              </div>
              <div className="mt-24">
                <p className=" text-left text-gray-500  text-2xl font-medium">
                  XCCM (eXtended Content Composition Module) is a sophisticated
                  application designed to streamline the compilation of
                  educational materials by integrating segments derived from
                  segmentation processes.
                </p>
              </div>

              <div className=" leading-2 mt-32  items-stretch justify-start">
                <div className="  flex flex-row gap-10">
                  <button className=" capitalize w-40 h-12 bg-violet-900 rounded-sm ">
                    <Link
                      href="auth/register"
                      className="w-full font-medium text-white text-xl"
                    >
                      Sign up
                    </Link>
                  </button>
                </div>
              </div>
            </aside>
            <aside className="h-full w-2/5  ">
              <div className=" mt-32">
                <Image
                  src="/images/img.svg"
                  height={350}
                  width={400}
                  alt="office scheme"
                />
              </div>
            </aside>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
