import { useState, useEffect, useRef } from "react";
import "./Payment.css";
import { useStateValue } from "../StateProvider";
import { Link, useNavigate } from "react-router-dom";
import CheckoutProduct from "../components/CheckoutProduct";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { getBasketTotal } from "../reducer";
import axios from "../axios";
import CurrencyFormat from "react-currency-format";
import { db } from "../firebase.js";
import {
  setDoc,
  doc,
  collection,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { Snackbar } from "@mui/material";
import { Alert, SlideTransition } from "./Checkout";
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

const Payment = () => {
  const [{ basket, user }, dispatch] = useStateValue();

  const [disabled, setDisabled] = useState(true);
  const [processing, setProcessing] = useState("");
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [open, setOpen] = useState(false);
  const [reducedText, setReducedText] = useState(false);

  const vertical = "bottom";
  const horizontal = "right";

  const mountedRef = useRef(true);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const getClientSecret = async () => {
    //generate stripe secret to charge customer
    try {
      const response = await axios({
        method: "post",
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`,
      });

      setClientSecret(response.data.clientSecret);
    } catch (error) {
      // console.log('error i>>',error);
    }
  };
  useEffect(() => {
    getClientSecret();
    setTimeout(handleClickOpen(), 5000);

    if (!mountedRef.current) return;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    checkWidth();
    
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, [])

  const checkWidth = () => {
    const winWidth = window.innerWidth;

    if (winWidth < 470) setReducedText(true);
    else setReducedText(false);
  };

  const trimTitle = (title) => {
    if (reducedText && title.length > 90) {
      return title.substring(0, 90).concat('...');
    } else return title
  }

  const showMessage = () => {
    setMessage("Successfully removed");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };


  const handleClose = () => {
    setOpen(false);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (clientSecret) {
      setProcessing(true);
      try {
        await stripe
          .confirmCardPayment(clientSecret, {
            payment_method: {
              card: elements.getElement(CardElement),
            },
          })
          .then(async ({ paymentIntent }) => {
            const docRef = doc(db, user?.displayName, "orders");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              await updateDoc(docRef, {
                orders: arrayUnion({
                  customer: user?.displayName,
                  basket: basket,
                  created: paymentIntent.created,
                  amount: paymentIntent.amount,
                }),
              });
            } else {
              collection(db, user.displayName);
              await setDoc(doc(db, user.displayName, "orders"), {
                orders: [
                  {
                    customer: user?.displayName,
                    basket: basket,
                    created: paymentIntent.created,
                    amount: paymentIntent.amount,
                  },
                ],
              });
            }
          });
      } catch (error) {
        setSeverity("error")
        setMessage("Error making payment");
        setProcessing(false)
        console.log("error >>", error)
        return
      }

      setSucceeded(true);
      setProcessing(false);

      dispatch({
        type: "EMPTY_BASKET",
      });
      navigate("/orders", { replace: true });
    } else {
      setSeverity("info")
      setMessage("Wait a bit or reload the page");
      return;
    }
  };

  const handleChange = (event) => {
    //listen for changes in the card element and display any errors as the customer types their details
    setDisabled(event.empty);
    //console.log(event.error ? event.error.message : "");
  };

  return (
    <div className="payment">
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
      <div className="payment_container">
        <h1>Checkout {<Link to="/checkout">{basket?.length} items </Link>}</h1>


        {/* Payment Section - Delivery Address  */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Delivery Address </h3>
          </div>
          <div className="payment_address">
            <p>{user?.email}</p>
            <p>123 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        {/* Payment Section - Review Items  */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Review items and delivery </h3>
          </div>
          <div className="payment_items">
            {basket.map((item, i) => (
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
        </div>

        {/* Payment Section - Payment Method  */}
        <div className="payment_section">
          <div className="payment_title">
            <h3>Payment Method </h3>
          </div>
          <div className="payment_details">
            {/* Stripe */}
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange} />

              <div className="payment_priceContainer">
                <CurrencyFormat
                  renderText={(value) => <h3>Order Total: {value} </h3>}
                  decimalScale={2}
                  value={getBasketTotal(basket)}
                  displayType={"text"}
                  thousandSeperator={true}
                  prefix={"$"}
                />
                <button disabled={processing || disabled || succeeded}>
                  <span>{processing ? "Processing" : "Buy Now"}</span>
                </button>
              </div>
            </form>
          </div>
          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={message}
            TransitionComponent={SlideTransition}
            autoHideDuration={1500}
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
      </div>
    </div>
  );
};

export default Payment;


const SimpleDialog = (props) => {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Payment Functionality</DialogTitle>
      <Typography variant="subtitle3" component="div" className="payment__card">
        use 42424242... consecutively tp fill the payment card section
      </Typography>
    </Dialog>
  );
}