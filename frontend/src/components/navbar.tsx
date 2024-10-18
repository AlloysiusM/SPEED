import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex justify-center gap-8 p-4 bg-background shadow-md">
      <a
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/submit`}
      >
        Submit
      </a>
      <a
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/articles`}
      >
        Articles List
      </a>
      <a
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/analystqueue`}
      >
        Analyst Queue
      </a>
      <a
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/search`}
      >
        Search
      </a>
    </nav>
  );
};

export default Navbar;