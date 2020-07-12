import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => 
    (
        <nav>
            <div className="nav-wrapper cyan darken-2">
                <div className="container">
                    <Link to={'/'} className="brand-logo">Kaiser Deloitte</Link>
                    <ul className="right hide-on-med-and-down">
                        <li><Link to={'/analytics'}>Analytics</Link></li>
                        <li><Link to={'/about'}>About Us</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    )

export default Header;