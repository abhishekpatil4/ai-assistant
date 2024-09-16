import { Link } from "react-router-dom"
const LogoComponent = () => {
    return <Link to="/" className="flex items-center space-x-1 rtl:space-x-reverse">
        <span className="self-center text-3xl font-semibold whitespace-nowrap dark:text-white">AI Assistant</span>
    </Link>
}

export default LogoComponent;