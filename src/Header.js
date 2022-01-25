import "./Header.css";
import { useState } from "react";
import { useStateValue } from "./StateProvider";
import { Link } from "react-router-dom";
import { ShoppingBasket, Search } from "@material-ui/icons";
import { signOut, getAuth } from "firebase/auth";
import { app } from "./firebase";
import { Alert, SlideTransition } from "./Checkout";
import { Snackbar } from "@mui/material";

const Header = () => {
  const [{ basket, user }, dispatch] = useStateValue();
  const [error, setError] = useState("");
  const auth = getAuth(app);

  const vertical = "bottom";
  const horizontal = "center";

  const handleSigningAuth = () => {
    if (user) {
      // sign out user
      signOut(auth)
        .then(() => {
          // console.log('sign out sucessful')
        })
        .catch((error) => {
          alert("error: ", error);
        });
    }
  };

  return (
    <div className="header">
      <Link to="/">
        <img
          className="header__logo"
          src={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0YC_LDFCHo1Rdgf1sAo3AFJfIY2TG2AC1tA&usqp=CAU"
          }
          alt="amazon-logo"
        />
      </Link>

      <div className="header__search">
        <input className="header__searchInput" type="text" />
        <Search className="header__searchIcon" />
        {/* Logo */}
      </div>

      <div className="header__nav">
        <Link to={!user && "/login"}>
          <div onClick={handleSigningAuth} className="header__options">
            <span className="header__optionLineOne">
              Hello, {!user ? "Guest" : user?.displayName}
            </span>
            <span className="header__optionLineTwo">
              {!user ? "Sign In" : "Sign Out"}
            </span>
          </div>
        </Link>
        <Link to="/orders">
          <div className="header__options">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>
        <div className="header__options">
          <span className="header__optionLineOne">Your</span>
          <span className="header__optionLineTwo">Prime</span>
        </div>

        {/*add the icon to a link to route back to the checkout page */}
        <Link to="/checkout">
          <div className="header__optionBasket">
            <ShoppingBasket />
            <span className="header__optionLineTwo header__basketCount">
              {basket.length}
            </span>
          </div>
        </Link>
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={error}
        TransitionComponent={SlideTransition}
        autoHideDuration={1500}
        onClose={() => setError("")}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Header;
