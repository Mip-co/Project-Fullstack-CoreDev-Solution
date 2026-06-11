import React from "react";

// 🔑 Komponen buatan Alam untuk membatasi lebar konten maksimal 1200px
function Container({ children }) {
  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "0 2rem",
      boxSizing: "border-box"
    }}>
      {children}
    </div>
  );
}

export default Container;   