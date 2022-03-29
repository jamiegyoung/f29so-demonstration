import Styles from './SignupLoginOverlay.module.css';
import Logo from './Logo';
import fb from '../images/fb32.png';
import google from '../images/google32.png';

function SignupLoginOverlay() {
  return (
    <div className={Styles.mainContainer}>
      <div className={Styles.innerContainer}>
        <Logo size={0.3} />
        <h1>WALLS</h1>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/auth/login/google';
          }}
        >
          <img src={google} alt="google" width={24} height={24} />
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = '/auth/login/facebook';
          }}
        >
          <img src={fb} alt="facebook" width={24} height={24} />
          <p>Continue with Facebook</p>
        </button>
        {/* <p>Or</p> */}
        {/* <input type="email" placeholder="Enter your email" />
        <button type="button">Continue with your email</button> */}
      </div>
    </div>
  );
}

export default SignupLoginOverlay;
