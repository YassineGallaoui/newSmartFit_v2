import React from "react";
import Link from "../../node_modules/next/link";


const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="internalNavbar collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                    <li className="nav-item">
                        <Link href={"/"} className="nav-link">Athletes List</Link>
                    </li>
                    <li className="nav-item">
                        <Link href={"/rules"} className="nav-link">View Rules</Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar;