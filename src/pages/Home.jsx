import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dropdown from "@nicoludo/nl-dropdown-component";
import "@nicoludo/nl-dropdown-component/dist/nldropdown.css";
import ReactModal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/scss/components/modal.scss";
import "../assets/scss/pages/home.scss";
import { EmployeeContext } from "../context/EmployeeContext";
import useFormState from "../hooks/useFormState";

function Home() {
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
  const departements = ["Sales", "Marketing", "Engineering", "Human Ressources", "Legal"];

  const {
    firstName, lastName, street, city, zipCode,
    selectedState, selectedDepartement, startDate, dateOfBirth,
    setFirstName, setLastName, setStreet, setCity, setZipCode,
    setSelectedState, setSelectedDepartement, setStartDate, setDateOfBirth
  } = useFormState(states[0], departements[0]);

  const [showModal, setShowModal] = useState(false);

  const { addEmployee } = useContext(EmployeeContext);

  const navigate = useNavigate();

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    ReactModal.setAppElement("#root");
  }, []);

  const handleSubmit = () => {
    const newEmployee = {
      firstName,
      lastName,
      startDate: startDate.toISOString().split("T")[0],
      department: selectedDepartement,
      dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      street,
      city,
      state: selectedState,
      zipCode
    };

    addEmployee(newEmployee);
    openModal();
  };

  return (
    <div className="home">
      <h1 className="home__title">HRnet</h1>
      <Link to="/employee-list" className="home__link">View Current Employees</Link>
      
      <h2 className="home__subtitle">Create Employee</h2>
      <form className="home__form">
        <div className="home__grid">
          <div className="home__field">
            <label className="home__label">First Name</label>
            <input type="text" className="home__input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div className="home__field">
            <label className="home__label">Last Name</label>
            <input type="text" className="home__input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div className="home__field">
            <label className="home__label">Date of Birth</label>
            <DatePicker
              selected={dateOfBirth}
              onChange={(date) => setDateOfBirth(date)}
              dateFormat="dd/MM/yyyy"
              className="home__input"
            />
          </div>

          <div className="home__field">
            <label className="home__label">Start Date</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              className="home__input"
            />
          </div>
        </div>

        <fieldset className="home__fieldset">
          <legend className="home__legend">Address</legend>

          <div className="home__grid">
            <div className="home__field">
              <label className="home__label">Street</label>
              <input type="text" className="home__input" value={street} onChange={(e) => setStreet(e.target.value)} />
            </div>

            <div className="home__field">
              <label className="home__label">City</label>
              <input type="text" className="home__input" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>

            <div className="home__field">
              <label className="home__label">State</label>
              <Dropdown
                options={states}
                selected={selectedState}
                setSelected={setSelectedState}
              />
            </div>

            <div className="home__field">
              <label className="home__label">Zip</label>
              <input type="text" className="home__input" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
          </div>
        </fieldset>

        <label className="home__label">Department</label>
        <Dropdown
          options={departements}
          selected={selectedDepartement}
          setSelected={setSelectedDepartement}
        />

        <button type="button" className="home__button" onClick={handleSubmit}>Submit</button>
        <ReactModal
          isOpen={showModal}
          onRequestClose={closeModal}
          contentLabel="Employee Created"
          className="modal"
          overlayClassName="overlay"
        >
          <div className="modal__content">
            <h2 className="modal__title">Employee Created</h2>
            <p className="modal__message">The employee has been successfully created.</p>
            <button className="modal__button" onClick={closeModal}>Close</button>
          </div>
        </ReactModal>
      </form>
    </div>
  );
}

export default Home;
