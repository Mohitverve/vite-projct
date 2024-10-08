import React, { useState, useEffect } from "react";
import { Menu, Layout, Drawer, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; // Ensure this is your Firebase initialization file
import "../styles/header.css";
import { onAuthStateChanged } from "firebase/auth";

const { Header } = Layout;

const AppHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track admin status
  const location = useLocation();
  const navigate = useNavigate();

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    const debouncedResize = debounce(handleResize, 300);
    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
    };
  }, []);

  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleNavigation = (path, hash = '') => {
    if (location.pathname === path && hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path + hash);
    }
  };

  useEffect(() => {
    // Fetch admin status when user is authenticated
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        setIsAdmin(!!idTokenResult.claims.admin); // Check if admin claim is present
      } else {
        setIsAdmin(false); // Not logged in
      }
    });

    return () => unsubscribe();
  }, []);

  const menuItems = [
    { key: "1", label: "Home", link: "/" },
    
    // Admin specific menu items
    ...(isAdmin
      ? [
          { key: "4", label: "Admin", link: "/Admin" },
        ]
      : []),
  ];

  const renderMenuItems = () => (
    <Menu theme="dark" mode={isMobile ? "vertical" : "horizontal"} className="menu-items">
      {menuItems.map((item) => (
        <Menu.Item key={item.key}>
          <Link to={item.link}>{item.label}</Link>
        </Menu.Item>
      ))}
      <Menu.Item key="5">
        <Button type="default" onClick={logout} className="signout-button">
          Sign Out
        </Button>
      </Menu.Item>
    </Menu>
  );

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate('/Login'); // Redirect to the registration page on sign out
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <Header className="app-header" key={location.pathname}>
      <div className="logo">Verve</div>
      {isMobile ? (
        <>
          <MenuOutlined className="menu-icon" onClick={showDrawer} />
          <Drawer
            title="Menu"
            placement="right"
            onClose={onCloseDrawer}
            visible={drawerVisible}
            className="mobile-drawer"
          >
            {renderMenuItems()}
          </Drawer>
        </>
      ) : (
        renderMenuItems()
      )}
    </Header>
  );
};

export default AppHeader;
