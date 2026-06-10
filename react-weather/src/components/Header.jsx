import { NavLink } from "react-router-dom";
 
export function Header() {
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Weather", path: "/weather" },
        { name: "App", path: "/app" },  
    ]
    return (
        <header>
            <nav className="bg-[7FC3AE] max-h-25 py-4">
                <ul className="flex justify-center">{navItems.map((item) => (
                    <li key={item.path}>
                        <NavLink to={item.path} className="text-black hover:text-gray-300">
                            {item.name}
                        </NavLink>
                    </li>
                ))}</ul>
            </nav>
        </header>

    )
}