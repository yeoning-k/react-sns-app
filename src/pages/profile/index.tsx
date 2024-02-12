import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import PostCard from 'components/posts/PostCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">프로필</h2>
      </div>
      <div className="profile">
        <div className="profile__icon">
          <FiUser />
        </div>
        <div className="profile__name">누구님</div>
        <div className="profile__email">test@test.com</div>
        <div className="profile__btn">
          <div
            className="profile__edit"
            onClick={() => navigate('/profile/edit')}
          >
            프로필 수정
          </div>
          <div className="profile__lang">English</div>
        </div>
      </div>
      <div className="tab">
        <div className="tab__menu tab__menu--active">내가 쓴 글</div>
        <div className="tab__menu">좋아요</div>
        <div className="tab__bar"></div>
      </div>
    </>
  );
}
