import { FiHome, FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import classNames from 'classnames';

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
    </div>
  );
};

export default Navigation;
