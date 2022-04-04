import React, { useState, useEffect } from "react";
import "./Home.css";
import Product from "../components/Product";
import MuiAlert from "@mui/material/Alert";
import { Snackbar, Slide } from "@mui/material";
import { homeProducts} from "../constants";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
 
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const Home = () => {
  const [message, setMessage] = useState("");

  const vertical = "bottom";
  const horizontal = "left";


  const showMessage = () => {
    setMessage("Successfully added");
  };

  return (
    <div className="home">
      <div className="home__container">
        <img
          className="home__image"
          src="https://sglentertainment.files.wordpress.com/2019/12/amazon-prime.jpg"
          alt="Prime-Banner"
        />

        <div className="home__row">
          {homeProducts.map((product) => (
            <Product {...product} key={product.id} showMessage={showMessage} />
          ))}
        </div>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={message}
          TransitionComponent={SlideTransition}
          autoHideDuration={1000}
          onClose={() => setMessage("")}
        >
          <Alert
            onClose={() => setMessage("")}
            severity="info"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Home;
