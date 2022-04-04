import React, { useEffect, useState } from "react";
import "./Checkout.css";
import CheckoutProduct from "../components/CheckoutProduct";
import { useStateValue } from "../StateProvider";
import Subtotal from "../components/Subtotal";
import MuiAlert from "@mui/material/Alert";
import { Snackbar, Slide } from "@mui/material";

export const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Checkout = () => {
  const [{ basket, user }, dispatch] = useStateValue();
  const [message, setMessage] = useState("");
  const [smallWindow, setSmallWindow] = useState(false)

  const vertical = "bottom";
  const horizontal = "right";

  useEffect(() => {
    window.scrollTo(0, 0);
    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  
  const checkWidth = () => {
    const winWidth = window.innerWidth;

    if(winWidth < 840) setSmallWindow(true);
    else setSmallWindow(false);
  };

  const showMessage = (info) => {
    setMessage(info);
  };

  const trimTitle = (title) => {
    if(smallWindow && title.length > 70) {
      return title.substring(0, 70).concat('...');
    } else return title
  }

  return (
    <div className="checkout">
      <div className="checkout__left">
        <img
          className="checkout__ad"
          src={
            "https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          }
          alt=""
        />

      <div className="checkout__left-sub">
        <Subtotal showMessage={showMessage} />
      </div>

        <div className="checkout__title">
          <h3> Hello, {user ? user.displayName : "Guest"}</h3>
          <h2>Your Shopping Basket</h2>
      </div>
          {/* CheckoutProduct */}
          {basket?.map((item, i) => (
            <div key={i}>
              <CheckoutProduct
                id={item.id}
                title={trimTitle(item.title)}
                image={item.image}
                price={item.price}
                rating={item.rating}
                showMessage={showMessage}
              />
            </div>
          ))}
        </div>

      <div className="checkout__right">
        <Subtotal showMessage={showMessage} />
      </div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={message}
        TransitionComponent={SlideTransition}
        autoHideDuration={1000}
        onClose={() => setMessage("")}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="info"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Checkout;
