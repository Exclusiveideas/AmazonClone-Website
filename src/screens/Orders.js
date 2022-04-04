import React, { useState, useEffect } from "react";
import Order from "../components/Order";
import "./Orders.css";
import { useStateValue } from "../StateProvider";
import { doc, getDoc } from "firebase/firestore";
import MuiAlert from "@mui/material/Alert";
import { db } from "../firebase.js";
import { Snackbar, Slide, Box, Skeleton, Card } from "@mui/material";

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
  const [severity, setSeverity] = useState("");
  const [small, setSmall] = useState(false);


  const vertical = "bottom";
  const horizontal = "right";

  const showMessage = (info) => {
    setSeverity("info")
    setMessage(info);
  };

  useEffect(() => {
    getOrderData();
  }, []);


  const getOrderData = async () => {
    if (user) {
      try {
        const docRef = doc(db, user.displayName, "orders");
        const docSnap = await getDoc(docRef);
        const data =
          docSnap._document.data.value.mapValue.fields.orders.arrayValue.values;
        const finalData = data.reverse();
        setOrders(finalData);
      } catch (error) {
        setSeverity("error")
        setMessage("error fetching orders");
      }
    } else {
      setSeverity("info")
      showMessage("You need to signin to view your orders");
    }
  };

  return (
    <div>
      <h1>Your Orders</h1>

      {orders ?
        <div>
          {orders.map((order) => <Order key={order.id} order={order} />)}
        </div> : (
          <>
          {Array(4)
            .fill()
            .map((_, i) => (
          <Card className="skeletonCont" key={i} sx={{ m: 2,  p: 5, }}>
          <Box className="skeletonCont__image" >
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>

            <Box sx={{ padding: "5px", width: "90%", display: "flex", flex: 2, flexDirection: 'column',}}>
              <Skeleton />
              <Skeleton width="70%" />
              <Skeleton width="40%" />
            </Box>
          </Card>))}
        </>)}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={message}
        TransitionComponent={SlideTransition}
        autoHideDuration={2000}
        onClose={() => setMessage("")}
      >
        <Alert
          onClose={() => setMessage("")}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Orders;
