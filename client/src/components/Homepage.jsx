import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import "../App.css";

function Homepage() {
  const PROFILE_URl = "/profile";

  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(PROFILE_URl, {
        withCredentials: true,
      })
      .then((response) => {
        const auth = response.data;
        setAuth(auth);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [auth]);
  const Logout = async () => {
    try {
      await axios.post("/logout", null, {
        withCredentials: true,
      });
      setAuth(null);
    } catch (error) {
      console.log(error);
    }
  };

  const username = auth?.username;

  return (
    <div className="card">
      {username && (
        <>
          <div className="card-content">
            <h3 className="card-title">Hello {username}</h3>
            <h4 onClick={Logout}>Logout</h4>
          </div>
        </>
      )}
      {!username && (
        <>
          <div className="card-content">
            <h3 className="card-title">Hello Stranger</h3>
            <h3>
              <a href="/login">Sign In</a>
            </h3>
          </div>
        </>
      )}
    </div>
  );
}

export default Homepage;
