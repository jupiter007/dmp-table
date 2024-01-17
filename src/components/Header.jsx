import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header-bar bg-primary mb-3">
      <div className="container d-flex flex-column flex-md-row align-items-center p-4">
        <h4 className="my-0 mr-md-auto font-weight-normal">
          <Link to="/" className="text-white">
            {' '}
            DMP Tool{' '}
          </Link>
        </h4>
      </div>
    </header>
  );
}

export default Header;
