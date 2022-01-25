import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { app } from "./firebase";
import { useStateValue } from "./StateProvider";

import { Snackbar, Slide } from "@mui/material";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Login = () => {
  const [state, dispatch] = useStateValue();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const auth = getAuth(app);

  const vertical = "bottom";
  const horizontal = "center";

  const updateUserName = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Updates the user attributes:

        updateProfile(auth.currentUser, {
          // <-- Update Method here
          displayName: userName,
        }).then(
          () => {
            // Profile updated successfully!
            dispatch({
              type: "SET_USER",
              user: user,
            });
          },
          function (error) {
            setError(error.message);
          },
          setError("")
        );
      }
    });
  };

  const singIn = (e) => {
    e.preventDefault();

    //login user
    signInWithEmailAndPassword(auth, email, password)
      .then((a) => {
        if (a) {
          navigate(-1, { replace: true });
        }
      })
      .catch((error) => {
        setError(error.message);
      });

    setError("");
  };

  const register = (e) => {
    e.preventDefault();

    // create user
    createUserWithEmailAndPassword(auth, email, password)
      .then((a) => {
        if (a) {
          updateUserName();
          navigate(-1, { replace: true });
        }
      })
      .catch((error) => {
        setError(error.message);
      });

    setError("");
  };

  return (
    <div className="login">
      <Link to="/">
        <img
          className="login__logo"
          src={
            "data:image/png;base64,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nY+fP+m23gM/XizL7lFt7Yb9hLVmRnWMdmmjpZD6fd2pcTTH/7L/cnTmxJysQZuPru/rDaMb++3FiTVv9I4Ru/t8weIgtF/udErTvwlasd+dvvlfb6Px8vuu27n9bHmVMGifddAO+61YMYd/++Xf2mbnrjP8LJUtr4XlkDla523XjKUJPVXXCP8YZuz2+o0G4R2i/XClEwffVoaOnUMISlM3u7Gu/ie5XwBNa/P9eN0K9GCXBUNvhci3NYeG/u0dZbHXg/bZwN42dlelyjrOn5g+KRoIxMPgTwi0BKN5MWjpBspZLg2GOYw9rT35+QHRPn75NVyFLrMzBb++feLk1arx49SulLOt/+LsTDMErcHZH7cdXDaajw+/rMlt7eIWXCFOKKDVu/m69mMJcBIij3/9r2UHVuZdMfYSuXu+/lojS0f78fR/P2OjU72T87y+LLWcmJkdFOs+P11+LZHVof2fs9Pr55apj1ZO647kxTC71lbktj+8uxo8nT1+EfImaLbbxzffnga9q5be7/d1Btb/d399v364PDteYm75C69D086nTHD+o+17keAXvrBi/B+kuSkhT8XyuQAAAABJRU5ErkJggg=="
          }
          alt="logo"
        />
      </Link>

      <div className="login__container">
        <h1>Sign-in</h1>

        <form>
          <h5>User Name</h5>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <h5>Email</h5>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="login__signInButton"
            onClick={singIn}
          >
            Sign In
          </button>
        </form>

        <p>
          By signing-in you agree to the AMAZON FAKE CLONE Conditions of Use &
          Sale. Please see our Privacy Notice, our Cookies Notice and our
          Interest-Based Ads Notice.
        </p>

        <button onClick={register} className="login__registerButton">
          Create Your Amazon Account
        </button>

        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={error}
          TransitionComponent={SlideTransition}
          autoHideDuration={4000}
          onClose={() => setError("")}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error.replace("Firebase:", "")}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default Login;
