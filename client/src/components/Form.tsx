import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "./Input";
import Button from "./Button";
import Select from "./Select";

export default function Form() {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    country: "",
    city: "",
    zipcode: 0,
    productname: "",
    price: 0,
    quantity: 0,
    tva: 0,
  });

  const navigate = useNavigate();

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    let inputCount = 0;
    let correctInput = 0;
    for (const property in formData) {
      inputCount++;
      const value: string | number =
        formData[property as keyof typeof formData];
      if (
        (typeof value === "string" && value !== "") ||
        (typeof value === "number" && value > 0)
      ) {
        correctInput++;
      }
    }
    if (correctInput === inputCount) {
      const data = JSON.stringify(formData);
      fetch(`${import.meta.env.VITE_PUBLIC_URL_API}/bill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(`Succès: ${data.message}`);
          navigate(`bills/bill/${data.id}`);
        })
        .catch((error) => {
          console.error(`Erreur: ${error}`);
        });
    } else {
      throw new Error("Vous n'avez pas rempli tout les champs.");
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [event.target.name]:
        event.target.type == "number"
          ? parseFloat(event.target.value)
          : event.target.value,
    });
  };

  return (
    <form>
      <div>
        <h3>Type de document</h3>
        <Select />
      </div>

      <div>
        <h3>Informations du client</h3>
        <div className={"grid"}>
          <Input
            label={"Prénom"}
            type={"text"}
            id={"firstname"}
            name={"firstname"}
            className={"input-text"}
            onChange={handleInputChange}
          />
          <Input
            label={"Nom"}
            type={"text"}
            id={"lastname"}
            name={"lastname"}
            className={"input-text"}
            onChange={handleInputChange}
          />
        </div>

        <Input
          label={"Adresse"}
          type={"text"}
          id={"address"}
          name={"address"}
          className={"input-text"}
          onChange={handleInputChange}
        />

        <div className={"grid"}>
          <Input
            label={"Pays"}
            type={"text"}
            id={"country"}
            name={"country"}
            className={"input-text"}
            onChange={handleInputChange}
          />
          <Input
            label={"Commune"}
            type={"text"}
            id={"city"}
            name={"city"}
            className={"input-text"}
            onChange={handleInputChange}
          />
          <Input
            label={"Code Postal"}
            type={"number"}
            id={"zipcode"}
            name={"zipcode"}
            className={"input-text"}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <h3>Informations du produit /service</h3>
        <div className={"grid"}>
          <Input
            label={"Nom du produit / service"}
            type={"text"}
            id={"product-name"}
            name={"productname"}
            className={"input-text"}
            onChange={handleInputChange}
          />

          <div className={"grid"}>
            <Input
              label={"Prix"}
              type={"number"}
              id={"price"}
              name={"price"}
              className={"input-number"}
              onChange={handleInputChange}
            />
            <Input
              label={"Quantité"}
              type={"number"}
              id={"quantity"}
              name={"quantity"}
              className={"input-number"}
              onChange={handleInputChange}
            />
            <Input
              label={"Tva"}
              type={"number"}
              id={"tva"}
              name={"tva"}
              className={"input-number"}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <Button text={"Valider"} onClick={handleSubmit} />
    </form>
  );
}
