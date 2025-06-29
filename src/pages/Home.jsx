import { useState, useEffect, useContext, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import "../assets/scss/components/modal.scss";
import "../assets/scss/pages/home.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useFormState from "../hooks/useFormState";

const Dropdown = lazy(() => import("@nicoludo/nl-dropdown-component"));
const ReactModal = lazy(() => import("react-modal"));
const DatePicker = lazy(() => import("react-datepicker"));

const states = [
  "AL","AK","AZ","AR","CA","CO",
  "CT","DE","FL","GA","HI","ID",
  "IL","IN","IA","KS","KY","LA",
  "ME","MD","MA","MI","MN","MS",
  "MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK",
  "OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV",
  "WI","WY"
];
const departments = ["Sales","Marketing","Engineering","Human Ressources","Legal"];

function Home() {
  const {
    firstName, lastName, street, city, zipCode,
    selectedState, selectedDepartement, startDate, dateOfBirth,
    setFirstName, setLastName, setStreet, setCity, setZipCode,
    setSelectedState, setSelectedDepartement, setStartDate, setDateOfBirth
  } = useFormState(states[0], departments[0]);

  const [showModal, setShowModal] = useState(false);
  const { addEmployee } = useContext(EmployeeContext);

  useEffect(() => {
    import("@nicoludo/nl-dropdown-component/dist/nldropdown.css");
    import("react-datepicker/dist/react-datepicker.css");
    import("react-modal").then(m => m.default.setAppElement("#root"));
  }, []);

  const handleSubmit = () => {
    addEmployee({
      firstName,
      lastName,
      startDate: startDate.toISOString().split("T")[0],
      department: selectedDepartement,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      street,
      city,
      state: selectedState,
      zipCode
    });
    setShowModal(true);
  };

  return (
    <div className="home">
      <h1 className="home__title">HRnet</h1>
      <Link to="/employee-list" className="home__link">View Current Employees</Link>
      <h2 className="home__subtitle">Create Employee</h2>
      <form className="home__form">
        <div className="home__grid">
          <div className="home__field">
            <label className="home__label" htmlFor="firstName">First Name</label>
            <input id="firstName" className="home__input" value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div className="home__field">
            <label className="home__label" htmlFor="lastName">Last Name</label>
            <input id="lastName" className="home__input" value={lastName} onChange={e => setLastName(e.target.value)} />
          </div>
          <div className="home__field">
            <label className="home__label" htmlFor="dateOfBirth">Date of Birth</label>
            <Suspense fallback={<div>Loading...</div>}>
              <DatePicker id="dateOfBirth" selected={dateOfBirth} onChange={setDateOfBirth} dateFormat="dd/MM/yyyy" className="home__input" />
            </Suspense>
          </div>
          <div className="home__field">
            <label className="home__label" htmlFor="startDate">Start Date</label>
            <Suspense fallback={<div>Loading...</div>}>
              <DatePicker id="startDate" selected={startDate} onChange={setStartDate} dateFormat="dd/MM/yyyy" className="home__input" />
            </Suspense>
          </div>
        </div>
        <fieldset className="home__fieldset">
          <legend className="home__legend">Address</legend>
          <div className="home__grid">
            <div className="home__field">
              <label className="home__label" htmlFor="street">Street</label>
              <input id="street" className="home__input" value={street} onChange={e => setStreet(e.target.value)} />
            </div>
            <div className="home__field">
              <label className="home__label" htmlFor="city">City</label>
              <input id="city" className="home__input" value={city} onChange={e => setCity(e.target.value)} />
            </div>
            <div className="home__field">
              <label className="home__label" htmlFor="state">State</label>
              <Suspense fallback={<div>Loading...</div>}>
                <Dropdown id="state" options={states} selected={selectedState} setSelected={setSelectedState} />
              </Suspense>
            </div>
            <div className="home__field">
              <label className="home__label" htmlFor="zipCode">Zip</label>
              <input id="zipCode" className="home__input" value={zipCode} onChange={e => setZipCode(e.target.value)} />
            </div>
          </div>
        </fieldset>
        <label className="home__label" htmlFor="department">Department</label>
        <Suspense fallback={<div>Loading...</div>}>
          <Dropdown id="department" options={departments} selected={selectedDepartement} setSelected={setSelectedDepartement} />
        </Suspense>
        <button type="button" className="home__button" onClick={handleSubmit}>Submit</button>
        <Suspense fallback={<div>Loading...</div>}>
          <ReactModal
            isOpen={showModal}
            onRequestClose={() => setShowModal(false)}
            contentLabel="Employee Created"
            className="modal"
            overlayClassName="overlay"
          >
            <div className="modal__content">
              <h2 className="modal__title">Employee Created</h2>
              <p className="modal__message">The employee has been successfully created.</p>
              <button className="modal__button" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </ReactModal>
        </Suspense>
      </form>
    </div>
  );
}

export default Home;
