import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";

// import Navbar from "./components/Navbar";

const App = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
