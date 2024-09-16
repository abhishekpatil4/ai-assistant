import Avatar from "./Avatar";
import LogoComponent from "./LogoComponent";
const Navbar = ({ user }) => {
    return <nav className="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <LogoComponent />
            <div className="flex gap-5 items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <Avatar user={user} />
            </div>
        </div>
    </nav>

}

export default Navbar;  
