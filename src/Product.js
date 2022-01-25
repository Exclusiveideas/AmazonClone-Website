import { useState } from "react";
import "./Product.css";
import { useStateValue } from "./StateProvider";
import { Star } from "@material-ui/icons";

const Product = ({ id, title, image, price, rating, showMessage }) => {
  const [{ basket }, dispatch] = useStateValue();

  const addToBasket = () => {
    //dispatch an item  into data layer
    dispatch({
      type: "ADD_TO_BASKET",
      item: {
        id,
        title,
        image,
        price,
        rating,
      },
    });

    showMessage();
  };

  return (
    <div className="product">
      <div className="product__info">
        <p>{title}</p>
        <p className="product__price">
          <small>$</small>
          <strong>{price}</strong>
        </p>
        <div className="product__rating">
          {Array(rating)
            .fill()
            .map((_, i) => (
              <p key={i}>
                <Star className="product_rating_star" />
              </p>
            ))}
        </div>
      </div>
      <img src={image} alt="" />

      <button onClick={addToBasket}>Add To Basket</button>
    </div>
  );
};

export default Product;
