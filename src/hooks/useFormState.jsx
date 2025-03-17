import { useState } from "react";

const useFormState = (initialState, initialDepartement) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedState, setSelectedState] = useState(initialState);
  const [selectedDepartement, setSelectedDepartement] = useState(initialDepartement);
  const [startDate, setStartDate] = useState(new Date());
  const [dateOfBirth, setDateOfBirth] = useState(new Date());

  return {
    firstName, lastName, street, city, zipCode,
    selectedState, selectedDepartement, startDate, dateOfBirth,
    setFirstName, setLastName, setStreet, setCity, setZipCode,
    setSelectedState, setSelectedDepartement, setStartDate, setDateOfBirth
  };
};

export default useFormState;
