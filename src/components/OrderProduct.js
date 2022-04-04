import "./OrderProduct.css";
import { Star } from "@material-ui/icons";

const OrderProduct = ({ item }) => {
  const { image, title, price, rating } = item.mapValue.fields;
  const ratingValue = parseInt(rating.integerValue);

  return (
    <div className="orderProduct">
      <img className="orderProduct__image" src={image.stringValue} alt="" />

      <div className="orderProduct__info">
        <p className="orderProduct__title">{title.stringValue}</p>
        <p>
          <small>$</small>
          <strong>{price.doubleValue}</strong>
        </p>
        <div className="orderProduct__rating">
          {Array(ratingValue)
            .fill()
            .map((i) => (
              <p className="me">
                <Star className="orderProduct_rating_star" />
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderProduct;
