import styles from '../styles/style.module.css';
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className={styles.main}>
          <h2>Welcome to SarahAnnie Dapp</h2>
          <p> Get the best experience when it comes to Crypto Vesting</p>
          <p>Get Started</p>
          <div>
            <p>
              Go to &nbsp;
              <Link href='/organization'>
                Organization
              </Link> &nbsp; or &nbsp;
              <Link href='/stakeholder'>
                Stakeholder
              </Link>
            </p>
          </div>
    </main>
  )
}
