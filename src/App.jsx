import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import UserMockApiHeader from "./pages/user";
import StoreMockApiHeader from "./pages/store";
import HsnMockApiHeader from "./pages/hsn";
import DrugScheduleMockApiHeader from "./pages/drug_schedule";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<Login />} /> */}
        <Route element={<Layout />}>

          <Route path="/" element={<Dashboard />} />
         
          <Route path="/staff/add" element={< UserMockApiHeader/>} />
          <Route path="/store/add" element={< StoreMockApiHeader/>} />
            <Route path="/hsn/add" element={< HsnMockApiHeader/>} />
            <Route path="/drug/add" element={< DrugScheduleMockApiHeader/>} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
