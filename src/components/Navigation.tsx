import {
  FiHome,
  FiSearch,
  FiBell,
  FiUser,
  FiLogIn,
  FiLogOut
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useContext } from 'react';
import AuthContext from 'context/AuthContext';
import { getAuth, signOut } from 'firebase/auth';
import { app } from 'firebaseApp';
import { toast } from 'react-toastify';

const MENUS = [
  {
    name: '홈',
    link: '/',
    icon: <FiHome className="navigation__icon" />
  },
  {
    name: '검색',
    link: '/search',
    icon: <FiSearch className="navigation__icon" />
  },
  {
    name: '알림',
    link: '/notifications',
    icon: <FiBell className="navigation__icon" />
  },
  {
    name: '프로필',
    link: '/profile',
    icon: <FiUser className="navigation__icon" />
  }
];

const Navigation = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="navigation">
      {MENUS.map((menu, idx) => {
        return (
          <div
            key={idx}
            className={classNames('navigation__box', {
              'navigation__box--active': pathname === menu.link
            })}
            onClick={() => navigate(menu.link)}
          >
            {menu.icon}
            <p className="navigation__text">{menu.name}</p>
          </div>
        );
      })}
      {user === null ? (
        <div
          className={classNames('navigation__box', {
            'navigation__box--active': pathname === '/auth/login'
          })}
          onClick={() => navigate('/auth/login')}
        >
          <FiLogIn className="navigation__icon" />
          <p className="navigation__text">로그인</p>
        </div>
      ) : (
        <div
          className="navigation__box"
          onClick={async () => {
            const auth = getAuth(app);
            await signOut(auth);
            toast.success('로그아웃 되었습니다. 또 오세요!');
          }}
        >
          <FiLogOut className="navigation__icon" />
          <p className="navigation__text">로그아웃</p>
        </div>
      )}
    </div>
  );
};

export default Navigation;
