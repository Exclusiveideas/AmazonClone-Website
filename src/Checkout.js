import React, { useEffect, useState } from "react";
import "./Checkout.css";
import CheckoutProduct from "./CheckoutProduct";
import { useStateValue } from "./StateProvider";
import Subtotal from "./Subtotal";
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

  const vertical = "bottom";
  const horizontal = "right";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const showMessage = (info) => {
    setMessage(info);
  };

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

        <div>
          <h3> Hello, {user ? user.displayName : "Guest"}</h3>
          <h2 className="checkout__title">Your Shopping Basket</h2>

          {/* CheckoutProduct */}
          {basket?.map((item, i) => (
            <div key={i}>
              <CheckoutProduct
                id={item.id}
                title={item.title}
                image={item.image}
                price={item.price}
                rating={item.rating}
                showMessage={showMessage}
              />
            </div>
          ))}
        </div>
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
