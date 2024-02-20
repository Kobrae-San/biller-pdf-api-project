import { Link } from "react-router-dom";

interface TitleDivProps {
  title: string;
  subtitle: string;
}

export default function TitleDiv({ title, subtitle }: TitleDivProps) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <strong style={{ fontSize: "2.5rem" }}>{title}</strong>
          </li>
        </ul>
        <ul>
          <li>
            <span>
              <Link to={"/"} className="contrast">
                Formulaire
              </Link>
            </span>
          </li>

          <li>
            <span>
              <Link to={"/bills"} className="contrast">
                Factures
              </Link>
            </span>
          </li>
        </ul>
      </nav>

      <h3>{subtitle}</h3>
    </div>
  );
}
