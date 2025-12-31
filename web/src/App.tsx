import "./App.css";
import { AddNewPayment } from "./components/AddNewPayment";
import { ExistingLoans } from "./components/ExistingLoans";

function App() {
  return (
    <div>
      <h1>Existing Loans & Payments</h1>
      <ExistingLoans />
      <hr />

      <h1>Add New Payment</h1>
      <AddNewPayment />
    </div>
  );
}

export default App;
