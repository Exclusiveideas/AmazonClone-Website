import { useStateValue } from "../StateProvider";
import "./Subtotal.css";
import { getBasketTotal } from "../reducer";
import { useNavigate } from "react-router-dom";
import CurrencyFormat from "react-currency-format";

const Subtotal = ({ showMessage }) => {
  const [{ basket, user }, dispatch] = useStateValue();

  const navigate = useNavigate();

  const handleClick = () => {
    if (basket.length < 1) {
      showMessage("Your Basket is empty");
      return;
    }

    if (user) {
      navigate("/payment");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="subtotal">
      <CurrencyFormat
        renderText={(value) => (
          <>
            <p>
              Subtotal ({basket.length} items):{" "}
              <strong>{getBasketTotal(basket)}</strong>
            </p>
            <small className="subtotal__gift">
              <input type={"checkbox"} /> This order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal(basket)}
        displayType={"text"}
        thousandSeperator={true}
        prefix={"$"}
      />
      <h3>Total amount is this</h3>
      <button onClick={handleClick}>Proceed to checkout</button>
    </div>
  );
};

export default Subtotal;
