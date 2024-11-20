import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full flex-col flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-100 to-purple-200">
        <Image
          className="pt-16 pb-16 "
          src="/images/logo.png"
          height={2}
          width={150}
          alt="logo"
        />
        {children}
      </div>
    </>
  );
};

export default AuthLayout;
