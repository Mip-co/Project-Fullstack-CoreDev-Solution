import React from "react";
import Navbar from "../components/Navbar/Navbar"; 
import Footer from "../components/Footer/Footer"; 
import Container from "../components/Container/Container"; 

// 🔑 FIX LOGIN STATUS: Tambahkan currentUser ke dalam parameter props Layout
function Layout({ children, cartCount, currentUser, isWide = false }) {
  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "space-between" 
    }}>

      {/* 🔑 FIX AVATAR: Meneruskan data currentUser ke Navbar agar berubah jadi profil setelah login */}
      <Navbar cartCount={cartCount} currentUser={currentUser} />
      
      <main style={{ flex: 1, paddingTop: "2rem", paddingBottom: "2rem" }}>
        {isWide ? (
          <div style={{ maxWidth: "1350px", margin: "0 auto", padding: "0 2rem", boxSizing: "border-box" }}>
            {children}
          </div>
        ) : (
          <Container>
            {children}
          </Container>
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default Layout;