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
      <p>{moment.unix(orders.created.integerValue).format("MM/DD/YYYY")}</p>
      <p className="order__id">
        <small>{order.id}</small>
      </p>
      {orderBasket.map((item, i) => (
        <div key={i}>
          <OrderProduct item={item} />
        </div>
      ))}
      <CurrencyFormat
        renderText={(value) => (
          <h3 className="order__total">Order Total: {value}</h3>
        )}
        decimalScale={2}
        decimalSeparator="."
        value={orders.amount.integerValue}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
    </div>
  );
};

export default Order;
