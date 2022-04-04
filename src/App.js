import "./App.css";
import { useEffect } from "react";
import Checkout from "./screens/Checkout";
import Header from "./components/Header";
import Home from "./screens/Home";
import Payment from "./screens/Payment";
import Orders from "./screens/Orders";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login.js";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const promise = loadStripe(
  "pk_test_51KHIRyKVo14rgkYkfkueK5pUg8E9tMvpCumWiZ04FpapRuH9QL3HkxARCFS7MC9Sm6hpslnueAFYxfQZTFoVdToJ00aFSJ6c6j"
);

function App() {
  const [state, dispatch] = useStateValue();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({
          type: "SET_USER",
          user: user,
        });
      } else {
        dispatch({
          type: "SET_USER",
          user: null,
        });
      }
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/orders"
            element={
              <>
                <Orders />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
              </>
            }
          />

          <Route
            path="/checkout"
            element={
              <>
                <Header />
                <Checkout />
              </>
            }
          />
          <Route
            path="/payment"
            element={
              <>
                <Header />
                <Elements stripe={promise}>
                  <Payment />
                </Elements>
              </>
            }
          />
          <Route
            path="/"
            element={
              <>
                <Header />
                <Home />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
