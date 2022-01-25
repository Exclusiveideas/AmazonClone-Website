import React from "react";
import "./Order.css";
import moment from "moment";
import OrderProduct from "./OrderProduct";
import CurrencyFormat from "react-currency-format";

const Order = ({ order }) => {
  const orders = order.mapValue.fields;
  const orderBasket = orders.basket.arrayValue.values;

  return (
    <div className="order">
      <h2>Order</h2>
      <p>{moment(orders.created).format("DD-MM-YYYY")}</p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      {orderBasket.map((item) => (
        <div>
          <OrderProduct item={item} />
        </div>
      ))}
      <CurrencyFormat
        renderText={(value) => (
          <h3 className="order__total">Order Total: {value}</h3>
        )}
        decimalScale={2}
        value={orders.amount.integerValue}
        displayType={"text"}
        thousandSeperator={true}
        prefix={"$"}
      />
    </div>
  );
};

export default Order;