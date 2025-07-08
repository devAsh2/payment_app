import { Routes, Route, BrowserRouter } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { Sendmoney } from "./pages/Sendmoney";
// import BuggyCounter from "./components/BuggyCounter";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/buggy-counter" element={<BuggyCounter/>} /> */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<Sendmoney />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
