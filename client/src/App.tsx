import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@picocss/pico";
import TitleDiv from "./components/TitleDiv";
import Form from "./components/Form";
import Bill from "./components/Bill";
import Bills from "./components/Bills";
import FormModify from "./components/FormModify";

function App() {
  return (
    <Router>
      <div className="container">
        <TitleDiv
          title={"Facturier"}
          subtitle={"Le générateur de factures et de devis"}
        />
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="bills/bill/:id" element={<Bill />} />
          <Route path="bills" element={<Bills />} />
          <Route path="bills/modify/:id" element={<FormModify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
