"use client";

import LangSwitcher from "./LangSwitcher";
import ThemeSwitcher from "./ThemeSwitcher"; 
import Navbar from "./Navbar";

const Header: React.FC = () => {

  return (
    <>
      <header className="bg-white shadow-md dark:bg-gray-900"> 
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <div className="flex items-center space-x-6">
            <span className="ml-3 text-lg font-semibold dark:text-white">MyApp</span> 
            <Navbar />
          </div>

          <div className="flex items-center space-x-4">
            <LangSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
