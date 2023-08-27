import axios from "../../api/axios";
import { useContext, useEffect } from "react";
import AuthContext from "../context/AuthProvider";
import { Link } from "react-router-dom";
import "../App.css";
const Header = () => {
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/profile", {
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
    <nav>
      <div id="logo" className="nav-sec">
        <Link to="/">MyBlog</Link>
      </div>

      {username && (
        <>
          <div id="create" className="nav-sec">
            <Link to="/create">Create new post</Link>
          </div>
          <div id="create" className="nav-sec">
            <a onClick={Logout}>Logout ({username})</a>
          </div>
          <div id="create" className="nav-sec">
            <Link to="/contact">Contact</Link>
          </div>
        </>
      )}
      {!username && (
        <>
          <div id="nav-log" className="nav-sec">
            <Link to="/login">Login</Link>
          </div>
          <div id="nav-reg" className="nav-sec">
            <Link to="/register">Register</Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Header;
