import React from 'react';

function Footer() {
  return (
    <footer className="border-top text-center small text-muted py-3">
      <p className="m-0">
        Copyright &copy; {new Date().getFullYear()} DMP . All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
