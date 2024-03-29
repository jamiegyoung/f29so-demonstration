/* eslint-disable jsx-a11y/label-has-associated-control */
import { Formik, Form, FormikHelpers, Field, ErrorMessage } from 'formik';
import fetchApi from '../app/fetchApi';
import Logo from '../components/Logo';
import { registration } from '../types';
import Styles from './Registration.module.css';

interface Values {
  email: string;
  username: string;
}

function Registration() {
  function validateEmail(email: string) {
    if (!email) {
      return 'email required';
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      return 'invalid email address';
    }
    return undefined;
  }

  async function validateUsername(username: string) {
    if (!username) {
      return 'username required';
    }
    if (username.length > 15) {
      return 'username must be 15 characters or less';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'username must be alphanumeric';
    }
    return undefined;
  }

  return (
    <div className={Styles.mainContainer}>
      <div className={Styles.innerContainer}>
        <Logo size={0.3} />
        <h1 className={Styles.formHeader}>REGISTRATION</h1>
        <Formik
          initialValues={{
            username: '',
            email: '',
          }}
          onSubmit={async (
            values: Values,
            { setSubmitting, setErrors }: FormikHelpers<Values>,
          ) => {
            const res = await fetchApi(registration.routes.checkUsername, {
              params: [values.username],
            });
            if (res.status !== 200) {
              setErrors({
                username: await res.text(),
              });
              return;
            }
            const { available } = await res.json();
            if (!available) {
              setErrors({ username: 'username unavailable' });
              return;
            }
            const submissionRes = await fetchApi(registration.routes.submit, {
              body: {
                username: values.username,
                email: values.email,
              },
            });

            if (submissionRes.status !== 200) {
              setErrors({
                email: await submissionRes.text(),
              });
              return;
            }
            window.location.href = '/';
            setSubmitting(false);
          }}
        >
          <Form className={Styles.form}>
            <label htmlFor="username">Username</label>
            <Field
              id="username"
              name="username"
              type="text"
              placeholder="Username"
              validate={async (username: string) => validateUsername(username)}
            />
            <ErrorMessage
              name="username"
              component="p"
              className={Styles.errorMessage}
            />
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              validate={(email: string) => validateEmail(email)}
            />
            <ErrorMessage
              name="email"
              component="p"
              className={Styles.errorMessage}
            />
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default Registration;
