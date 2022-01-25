import "./CheckoutProduct.css";
import { useStateValue } from "./StateProvider";
import { Star } from "@material-ui/icons";

const CheckoutProduct = ({
  key,
  image,
  title,
  price,
  rating,
  showMessage,
  hideButton,
}) => {
  const [state, dispatch] = useStateValue();

  const removeFromBasket = () => {
    dispatch({
      type: "REMOVE_FROM_BASKET",
      key: key,
    });
    if (showMessage) {
      showMessage("Successfully removed");
    }
  };

  return (
    <div className="checkoutProduct">
      <img className="checkoutProduct__image" src={image} alt="" />

      <div className="checkoutProduct__info">
        <p className="checkoutProduct__title">{title}</p>
        <p>
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="checkoutProduct__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={i}>
                <Star className="checkoutProduct_rating_star" />
              </p>
            ))}
        </div>
        {!hideButton && (
          <button onClick={removeFromBasket}>Remove from Basket</button>
        )}
      </div>
    </div>
  );
};

export default CheckoutProduct;
