import fetchApi from '../app/fetchApi';
import { v1 } from '../types';
import Styles from './Settings.module.css';

function Settings() {
  return (
    <div className={Styles.settingsContainer}>
      <button
        type="button"
        className={Styles.button}
        onClick={() => {
          window.location.href = '/auth/logout';
        }}
      >
        Logout
      </button>
      <h1 className={Styles.sectionHeader}>account actions</h1>
      <button
        onClick={async () => {
          const res = await fetchApi(v1.routes.selfDeleteUser);
          if (res.status === 200) {
            window.location.href = '/';
          }
        }}
        className={[Styles.button, Styles.danger].join(' ')}
        type="button"
      >
        Delete Account
      </button>
    </div>
  );
}

export default Settings;
