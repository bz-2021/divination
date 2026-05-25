import styles from './Coin.module.css';

interface CoinProps {
  targetAngle: number;
}

export default function Coin({ targetAngle }: CoinProps) {
  return (
    <div className={styles.coinWrap}>
      <div
        className={styles.coin}
        style={{ transform: `rotateY(${targetAngle}deg)` }}
      >
        <div className={styles.face}>
          <img src="img/head.png" alt="" />
        </div>
        <div className={`${styles.face} ${styles.tail}`}>
          <img src="img/tail.png" alt="" />
        </div>
      </div>
    </div>
  );
}
