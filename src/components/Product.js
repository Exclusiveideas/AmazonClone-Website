import { useState, useEffect } from "react";
import "./Product.css";
import { useStateValue } from "../StateProvider";
import { Star } from "@material-ui/icons";

const Product = ({ id, title, image, price, rating, showMessage }) => {
  const [{ basket }, dispatch] = useStateValue();
  const [reducedText, setReducedText] = useState(false);

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

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, [])

  const checkWidth = () => {
    const winWidth = window.innerWidth;

    if(winWidth < 1140) setReducedText(true);
    else setReducedText(false);
  };

  const trimTitle = (title) => {
    if(reducedText && title.length > 90) {
      return title.substring(0, 90).concat('...');
    } else return title
  }

  return (
    <div className="product">
      <div className="product__info">
        <p className="product__info-title">{trimTitle(title)}</p>
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

      <button onClick={addToBasket}>Add To Cart</button>
    </div>
  );
};

export default Product;
