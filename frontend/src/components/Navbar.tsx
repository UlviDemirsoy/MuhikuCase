import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuIndicator,
  NavigationMenuViewport
} from "./ui/navigation-menu"; 
import { useTranslations } from 'next-intl';
import { Link } from "../i18n/routing";
import { useTheme } from "next-themes"; 
import { cn } from "@/lib/utils"; 

const Navbar: React.FC = () => {
  const t = useTranslations('Home.navigation');
  const { theme } = useTheme(); 

  return (
    <NavigationMenu className="relative z-50">
      <NavigationMenuList className="flex space-x-8">
        <NavigationMenuItem className="group">
          <Link
            href="/"
            className={cn(
              theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600", 
              "transition-colors duration-200 ease-in-out",
              "relative font-medium py-2"
            )}
          >
            {t('home')} 
            <span
              className={cn(
                "absolute left-0 bottom-0 h-[2px] w-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-in-out",
                theme === "dark" ? "bg-blue-400" : "bg-blue-600" 
              )}
            />
          </Link>
        </NavigationMenuItem>

       
      </NavigationMenuList>

      <NavigationMenuIndicator />
      <NavigationMenuViewport />
    </NavigationMenu>
  );
};

export default Navbar;
