import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
}

export default function Bills() {
  const [data, setData] = useState<Bill[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_PUBLIC_URL_API}/bills`)
      .then((response) => response.json())
      .then((data: Bill[]) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  function goToBill(id: number) {
    navigate(`./bill/${id}`);
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Numéro de facture</th>
            <th>Débiteur</th>
            <th>Produit</th>
            <th>Prix de la commande</th>
          </tr>
        </thead>
        <tbody>
          {data.map((dataBill) => (
            <tr key={dataBill.id} onClick={() => goToBill(dataBill.id)}>
              <td>Facturne n° {dataBill.id}</td>
              <td>
                {dataBill.firstname} {dataBill.lastname}
              </td>
              <td>{dataBill.productname}</td>
              <td>{(dataBill.price * dataBill.quantity).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
