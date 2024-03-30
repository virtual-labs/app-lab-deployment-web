import React from "react";
import { useState } from "react";
import { validateURL } from "../utils/config_data";
import { useDeployLabList } from "../utils/useLabList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const HostingInfoForm = ({ temLab, setModal }) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const { deployLabList, setDeployLabList } = useDeployLabList();

  const validateForm = () => {
    const newErrors = {};

    // Validate URL
    if (validateURL(url)) {
      newErrors.url = "URL is required";
    }

    // Validate Name
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate Date
    if (!date) {
      newErrors.date = "Date is required";
    }

    // Return true if there are no errors, else false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validButton = document.getElementById("valid-label");
    if (validButton) {
      if (validButton.innerText === "Invalid Decsriptor") {
        alert("Descriptor is not valid");
        return;
      }
    }

    if (validateForm()) {
      const newLab = {
        ...temLab,
        hostingURL: url,
        hostingRequester: name,
        hostingRequestDate: date.toLocaleDateString("en-US", {
          month: "numeric",
          day: "numeric",
          year: "numeric",
        }),
      };
      setDeployLabList([...deployLabList, newLab]);

      setUrl("");
      setName("");
      setDate(new Date());
      setModal(false);
      // Reset form fields
    } else {
      alert("Validation error");
    }
  };

  return (
    <div className="host-req absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 h-full flex items-center justify-center z-50">
      <div className="flex flex-col bg-gray-200 h-auto w-3/5 add-lab-container p-2">
        <div className="flex flex-row">
          <h2 className="flex-1 text-2xl text-gray-600 mt-0">
            Hosting Request Information
          </h2>
          <span
            className="text-2xl cursor-pointer hover:text-red-600 active:text-red-800"
            onClick={() => setModal(false)}
          >
            &times;
          </span>
        </div>
        <form className="flex flex-col mb-4" onSubmit={handleSubmit}>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">
              Hosting Request URL
            </label>
            <input
              type="text"
              id="url"
              name="url"
              className="search-query w-input"
              placeholder="Enter hosting request URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">Requester Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="search-query w-input"
              placeholder="Enter Requester Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex flex-row">
            <label className="flex items-center w-1/2">Request Date</label>
            <DatePicker
              className="search-query w-input"
              selected={date}
              onChange={(newDate) => setDate(newDate)}
            />
          </div>
          <button type="submit" className="submit-button w-button w-32">
            Add to deploy
          </button>
        </form>
        <div className="flex flex-row"></div>
      </div>
    </div>
  );
};

export default HostingInfoForm;
