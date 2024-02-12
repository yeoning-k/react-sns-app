import { useState } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';

import { Link, useNavigate } from 'react-router-dom';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

type errorType = {
  email: string;
  password: string;
  passwordConfirm: string;
};

const SignupForm = () => {
  const [error, setError] = useState<errorType>({
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
      toast.success('회원가입이 완료되었습니다🎉');
    } catch (error: any) {
      toast.error(`회원가입에 실패하였습니다😰\n${error?.code}`);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value }
    } = e;

    if (name === 'email') {
      setEmail(value);

      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (value?.length > 0 && !value?.match(validRegex)) {
        setError({ ...error, email: '이메일 형식이 올바르지 않습니다.' });
      } else {
        setError({ ...error, email: '' });
      }
    }

    if (name === 'password') {
      setPassword(value);

      if (value?.length <= 0) {
        setError({ ...error, password: '' });
        return;
      }

      if (value?.length < 8) {
        setError({ ...error, password: '비밀번호는 8자리 이상 입력해주세요' });
      } else {
        if (value !== passwordConfirm) {
          setError({
            ...error,
            password: '',
            passwordConfirm: '비밀번호와 비밀번호 확인 값이 다릅니다.'
          });
        } else {
          setError({
            ...error,
            password: '',
            passwordConfirm: ''
          });
        }
      }
    }

    if (name === 'password_confirmation') {
      setPasswordConfirm(value);

      if (value?.length <= 0) {
        setError({
          ...error,
          passwordConfirm: ''
        });

        return;
      }
      if (value !== password) {
        setError({
          ...error,
          passwordConfirm: '비밀번호와 비밀번호 확인 값이 다릅니다.'
        });
      } else {
        setError({
          ...error,
          passwordConfirm: ''
        });
      }
    }
  };

  const onClickSocialLogin = async (e: any) => {
    const {
      target: { name }
    } = e;

    let provider;
    const auth = getAuth(app);
    if (name === 'google') {
      provider = new GoogleAuthProvider();
    }
    if (name === 'github') {
      provider = new GithubAuthProvider();
    }

    await signInWithPopup(
      auth,
      provider as GithubAuthProvider | GoogleAuthProvider
    )
      .then(result => {
        console.log(result);
        toast.success('회원가입이 완료되었습니다🎉');
      })
      .catch(error => {
        console.log(error);
        toast.error(`회원가입에 실패하였습니다😰\n${error?.code}`);
      });
  };

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__title">회원가입</div>
      <div className="form__block">
        <label htmlFor="email">이메일</label>
        <input
          type="text"
          name="email"
          id="email"
          required
          value={email}
          onChange={onChange}
        />
        {error.email.length > 0 && (
          <div className="form__error">{error.email}</div>
        )}
      </div>
      <div className="form__block">
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          value={password}
          onChange={onChange}
        />
        {error.password.length > 0 && (
          <div className="form__error">{error.password}</div>
        )}
      </div>
      <div className="form__block">
        <label htmlFor="password_confirmation">비밀번호 확인</label>
        <input
          type="password"
          name="password_confirmation"
          id="password_confirmation"
          required
          value={passwordConfirm}
          onChange={onChange}
        />
        {error.passwordConfirm.length > 0 && (
          <div className="form__error">{error.passwordConfirm}</div>
        )}
      </div>

      <div className="form__block">
        계정이 있으신가요?
        <Link to="/auth/login" className="form__link">
          로그인하기
        </Link>
      </div>
      <div className="form__block form__btns">
        <button
          type="submit"
          className="form__btn form__btn-submit"
          disabled={Object.values(error).some(name => name.length > 0)}
        >
          회원가입
        </button>
        <button
          type="button"
          name="google"
          className="form__btn form__btn-google"
          onClick={onClickSocialLogin}
        >
          Google으로 회원가입
        </button>
        <button
          type="button"
          name="github"
          className="form__btn form__btn-github"
          onClick={onClickSocialLogin}
        >
          Github으로 회원가입
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
