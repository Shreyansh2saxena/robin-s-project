import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">MyApp</h1>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <ul
          className={`md:flex gap-6 absolute md:static bg-blue-600 w-full md:w-auto left-0 top-16 md:top-0 p-4 md:p-0 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <li className="text-white py-2 md:py-0">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          </li>
          <li className="text-white py-2 md:py-0">
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
          </li>
          <li className="text-white py-2 md:py-0">
            <Link to="/services" onClick={() => setIsOpen(false)}>Services</Link>
          </li>
          <li className="text-white py-2 md:py-0">
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
