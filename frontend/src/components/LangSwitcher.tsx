"use client";

import Image from "next/image";
import * as React from "react";
import { CheckIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes"; 
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandInput,
} from "@/components/ui/command"; 
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import gbFlag from "../assets/img/bg_flag.png";
import geFlag from "../assets/img/german_flag.png";
import esFlag from "../assets/img/spain_flag.png";
import svFlag from "../assets/img/swedish_flag.png";
import nlFlag from "../assets/img/neth_flag.png";
import { StaticImageData } from "next/image";

const LangSwitcher: React.FC = () => {
  interface Option {
    country: string;
    code: string;
    flag: StaticImageData;
  }

  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme(); 

  const options: Option[] = [
    { country: "EN", code: "en", flag: gbFlag as StaticImageData },
    { country: "DE", code: "de", flag: geFlag as StaticImageData },
    { country: "ES", code: "es", flag: esFlag as StaticImageData },
    { country: "SV", code: "sv", flag: svFlag as StaticImageData },
    { country: "NL", code: "nl", flag: nlFlag as StaticImageData },
  ];

  const initialOption = options.find((option) => pathname.includes(option.code)) || options[0];
  const [selectedOption, setSelectedOption] = React.useState<Option>(initialOption);
  const [open, setOpen] = React.useState(false);

  const setOption = (option: Option) => {
    setSelectedOption(option);
    setOpen(false);
    router.replace(`/${option.code}`); 
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={`flex items-center justify-between h-10 px-3 py-2 border rounded-md text-sm font-medium focus:ring-4 focus:outline-none ${
            theme === "dark"
              ? "border-gray-500 text-white bg-gray-800 hover:bg-gray-700 focus:ring-gray-500"
              : "border-gray-300 text-black bg-white hover:bg-gray-200 focus:ring-gray-300"
          }`}
        >
          <span className="flex items-center">
            <Image
              src={selectedOption.flag}
              width={16}  
              height={16} 
              alt="flag"
            />
            <span className="ml-2">{selectedOption.country}</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className={`w-32 p-0 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <Command>
          <CommandInput
            placeholder="Search..."
            className={`h-8 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
          />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.code}
                  onSelect={() => setOption(option)}
                  className={`hover:bg-gray-200 dark:hover:bg-gray-600`}
                >
                  <Image
                    src={option.flag}
                    width={16} 
                    height={16} 
                    alt="flag"
                  />
                  <span className="ml-2">{option.country}</span>
                  {pathname === `/${option.code}` && (
                    <CheckIcon className="ml-auto h-4 w-4 opacity-100" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default LangSwitcher;
