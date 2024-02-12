import { useState, useEffect } from 'react';

import Router from 'components/Router';
import 'styles/global.css';
import 'styles/index.scss';
import Layout from 'components/Layout';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from 'firebaseApp';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';

function App() {
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <Layout>
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
      <ToastContainer
        autoClose={1000}
        hideProgressBar
        newestOnTop
        style={{ fontSize: '14px' }}
      />
    </Layout>
  );
}

export default App;
