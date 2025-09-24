import type { Berry } from "../types/berry";
import styles from "./BerryCard.module.css";

type Props = { berry: Berry };

export default function BerryCard({ berry }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img
          className={styles.icon}
          alt="berry"
          src="https://logowik.com/content/uploads/images/346_raspberry_pi_logo.jpg"
        />
        <span className={styles.name}>{berry.name}</span>
      </div>
      <div className={styles.right}>
        {berry.flavors.map((f) => (
          <span className={styles.chip} key={f.name}>
            {f.name}
          </span>
        ))}
      </div>
    </div>
  );
}
