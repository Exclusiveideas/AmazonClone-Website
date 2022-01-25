import React, { useState, useEffect } from "react";
import Order from "./Order";
import "./Order.css";
import { useStateValue } from "./StateProvider";
import { doc, getDoc } from "firebase/firestore";
import MuiAlert from "@mui/material/Alert";
import { db } from "./firebase.js";
import { Snackbar, Slide } from "@mui/material";

export const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Orders = () => {
  const [{ user }, dispatch] = useStateValue();
  const [orders, setOrders] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const vertical = "bottom";
  const horizontal = "right";

  const showMessage = (info) => {
    setMessage(info);
  };

  useEffect(() => {
    const getOrderData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "muftau", "orders");
          const docSnap = await getDoc(docRef);
          const data =
            docSnap._document.data.value.mapValue.fields.orders.arrayValue.values;
          const finalData = data.reverse();
          setOrders(finalData);
        } catch (error) {
          setError(error);
        }
      } else {
        showMessage("You need to signin to view your orders");
      }
    };
    getOrderData();
  }, []);

  return (
    <div>
      <h1>Your Orders</h1>

      <div>{orders && orders.map((order) => <Order order={order} />)}</div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={message}
        TransitionComponent={SlideTransition}
        autoHideDuration={1500}
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
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={message}
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

export default Orders;
