import React from "react";
import JSONInput from "react-json-editor-ajrm";
import locale from "react-json-editor-ajrm/locale/en";
import { JsonEditor as Editor } from "jsoneditor-react";
import "jsoneditor-react/es/editor.min.css";
import { useState } from "react";

const Test = () => {
  const sampleObject = {};
  const [jsonData, setJsonData] = useState({
    broadArea: {
      name: "Mechanical Engineering",
      link: "https://www.vlab.co.in/broad-area-mechanical-engineering",
    },
    lab: "Material Response to Micro Structural & Mechanical & Thermal and Biological Stimuli",
    lab_display_name:
      "Material response to micro structural mechanical thermal and biological stimuli",
    deployLab: true,
    phase: 2,
    collegeName: "IITK",
    baseUrl: "mrmsmtbs-iitk.vlabs.ac.in",
    introduction:
      "This Virtual lab is created for understanding the material response (microstructure)when any thermal or mechanical stimuli is provided to it. ",
    experiments: [
      {
        name: "Creep Transient Based on Material Selection (Pt/Mg)",
        "short-name": "material-selection",
        repo: "https://github.com/virtual-labs/exp-material-selection-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Selection of Obstacle Distance (λ, grain boundary or precipitate)",
        "short-name": "obstacle-distance",
        repo: "https://github.com/virtual-labs/exp-obstacle-distance-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Selection of Obstacle Density (ρ,number of grains/precipitate)",
        "short-name": "obstacle-density",
        repo: "https://github.com/virtual-labs/exp-obstacle-density-iitk",
        tag: "v1.0.2",
        deploy: true,
      },
      {
        name: "Hardness & Modulus",
        "short-name": "hardness-modulus",
        repo: "https://github.com/virtual-labs/exp-hardness-modulus-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Indent Depth",
        "short-name": "indent-depth",
        repo: "https://github.com/virtual-labs/exp-indent-depth-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Plastic Work",
        "short-name": "plastic-work",
        repo: "https://github.com/virtual-labs/exp-plastic-work-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Contact Angle Measurement",
        "short-name": "contact-angle-measurement",
        repo: "https://github.com/virtual-labs/exp-contact-angle-measurement-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "To Image the Cytoskeleton of Cells Proliferation On Biomaterial Surface",
        "short-name": "cytoskeleton-cells-proliferation",
        repo: "https://github.com/virtual-labs/exp-cytoskeleton-cells-proliferation-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "To Image the Nucleus of Cells Proliferation On Biomaterial Surface",
        "short-name": "nucleus-cells-proliferation",
        repo: "https://github.com/virtual-labs/exp-nucleus-cells-proliferation-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
      {
        name: "Ionic Conductivity YSZ Electrolyte Material For solid Oxide Fuel Cell",
        "short-name": "solid-oxide-fuel-cell",
        repo: "https://github.com/virtual-labs/exp-solid-oxide-fuel-cell-iitk",
        tag: "v1.0.1",
        deploy: true,
      },
    ],
    targetAudience: {
      UG: ["Students of Material Science and Engineering"],
      PG: ["Students of Material Science and Engineering"],
    },
    objective:
      "The main objective is to observe the surface properties via the wetting behavior of material or extracting the biological response to the surface of biomaterial. In addition ionic conductivity dependence on the composition of material is explained here with.",
    courseAlignment: {
      description:
        "The lab contents are chosen such that it covers the syllabi of Material Response to Micro Structural & Mechanical & Thermal and Biological Stimuli.",
      universities: [
        "B.tech : MSE204A (Introduction to Biomaterials) IIT Kanpur, B.tech: MME250 (Materials Characterization), IIT Kanpur",
      ],
    },
    exp_name:
      "Ionic Conductivity YSZ Electrolyte Material For solid Oxide Fuel Cell",
    exp_short_name: "solid-oxide-fuel-cell",
    version: "v0.5.0",
  });

  const handleChange = (e) => {
    console.log(e);
  };
  return (
    <div>
      {" "}
      <Editor value={jsonData} onChange={(jsonData) => setJsonData(jsonData)} />
      <button onClick={() => console.log(jsonData)}>print json</button>
    </div>
  );
};

export default Test;
