import Styles from './LoginOverlay.module.css';
import Logo from './Logo';
import fb from '../images/fb32.png';
import google from '../images/google32.png';
import twitter from '../images/twitter32.png';

function LoginOverlay() {
  return (
    <div className={Styles.mainContainer}>
      <div className={Styles.innerContainer}>
        <Logo size={0.3} />
        <h1>WALLS SIGN IN</h1>
        <button type="button">
          <img src={google} alt="google" width={24} height={24} />
          Sign in with Google
        </button>
        <button type="button">
          <img src={fb} alt="facebook" width={24} height={24} />
          Sign in with Facebook
        </button>
        <button type="button">
          <img src={twitter} alt="twitter" width={24} height={24} />
          Sign in with Twitter
        </button>
        <p>Or</p>
        <input type="email" placeholder="Enter your email" />
        <button type="button">Sign in with your email</button>
      </div>
    </div>
  );
}

export default LoginOverlay;
