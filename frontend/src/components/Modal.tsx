import { ReactNode } from 'react';
import { useTheme } from 'next-themes';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  const { theme } = useTheme(); 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`p-6 rounded-lg shadow-lg relative transition-colors duration-200 ease-in-out 
          ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          X
        </button>
      </div>
    </div>
  );
};
