import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "./Button";
import "dotenv/config";

interface Bill {
  id: number;
  doctype: string;
  firstname: string;
  lastname: string;
  address: string;
  country: string;
  city: string;
  zipcode: number;
  productname: string;
  price: number;
  quantity: number;
  tva: number;
  created_at: string;
}

export default function Bill() {
  const [data, setData] = useState<Bill[]>([]);
  const navigate = useNavigate();

  const { id } = useParams();
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL_API}/bills/bill?id=${id}`)
      .then((response) => response.json())
      .then((data: Bill[]) => setData(data))
      .catch((error) =>
        console.error(`La facture n'a pas été chargé: ${error}.`)
      );
  }, []);

  function modifyBill(id: number) {
    navigate(`/bills/modify/${id}`);
  }

  async function deleteBill(id: number) {
    const response = await fetch(
      `${process.env.PUBLIC_URL_API}/bills/bill?id=${id}`,
      {
        method: "DELETE",
      }
    );
    if (response.ok) {
      navigate("/bills");
    } else {
      console.error("La suppression de la facture a échouer.");
    }
  }

  async function showBill(id: number) {
    try {
      const response = await fetch(
        `${process.env.PUBLIC_URL_API}/bills/bill/pdf?id=${id}`
      );
      const pdf = await response.blob();
      const url = URL.createObjectURL(pdf);
      window.open(url);
    } catch (error) {
      console.error(`L'affichage du PDF a échoué: ${error}`);
    }
  }

  return (
    <div>
      {data.length > 0 && (
        <div>
          <h2>
            Facture de {data[0].firstname} {data[0].lastname}
          </h2>
          <div>
            <div>
              <p>
                {data[0].firstname} {data[0].lastname}
              </p>
            </div>
            <p>{data[0].address}</p>
            <div>
              <p>
                {data[0].zipcode} {data[0].city}
              </p>
            </div>
          </div>

          <div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Nom du Produit</th>
                    <th>Quantité</th>
                    <th>Prix</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{data[0].productname}</td>
                    <td>{data[0].quantity}</td>
                    <td>{data[0].price} €</td>
                    <td>{(data[0].quantity * data[0].price).toFixed(2)} €</td>
                  </tr>
                </tbody>
              </table>
              <div>
                <p>
                  Sous-total {(data[0].quantity * data[0].price).toFixed(2)} €
                </p>
                <p>
                  Tva ({data[0].tva} %){" "}
                  {(
                    data[0].quantity *
                    data[0].price *
                    (data[0].tva / 100)
                  ).toFixed(2)}{" "}
                  €
                </p>

                <p>
                  Montant total{" "}
                  {(
                    data[0].quantity *
                    data[0].price *
                    (1 + data[0].tva / 100)
                  ).toFixed(2)}{" "}
                  €
                </p>
              </div>
              <div className="grid">
                <Button
                  text={"Modifier"}
                  onClick={() => modifyBill(data[0].id)}
                />
                <Button
                  text={"Supprimer"}
                  onClick={() => deleteBill(data[0].id)}
                />
              </div>
              <Button text={"Afficher"} onClick={() => showBill(data[0].id)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
