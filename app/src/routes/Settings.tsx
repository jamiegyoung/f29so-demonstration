import fetchApi from '../app/fetchApi';
import { v1 } from '../types';
import Styles from './Settings.module.css';

function Settings() {
  return (
    <div>
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
