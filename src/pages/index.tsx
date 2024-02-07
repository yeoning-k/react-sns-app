import { useNavigate } from 'react-router-dom';
import {
  FiUser,
  FiThumbsUp,
  FiMessageSquare,
  FiMoreHorizontal
} from 'react-icons/fi';

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">피드</h2>
        <button
          className="page-header__btn"
          onClick={() => navigate('/posts/write')}
        >
          글쓰기
        </button>
      </div>
      <div className="tab">
        <div className="tab__menu tab__menu--active">전체</div>
        <div className="tab__menu">팔로잉</div>
        <div className="tab__bar"></div>
      </div>

      {[...Array(10)].map((test, idx) => {
        return (
          <div className="card" key={idx}>
            <div className="card__header">
              <div className="card__profile">
                <div className="card__icon">
                  <FiUser />
                </div>
                <div className="card__user">test@test.com</div>
              </div>
              <button className="card__following">팔로잉</button>
            </div>
            <div className="card__body">
              <div className="card__content">texttexttexttext</div>
              <div className="card__hashtags">
                <span>#test</span>
                <span>#test</span>
                <span>#test</span>
              </div>
            </div>
            <div className="card__footer">
              <div className="card__comments">
                <FiMessageSquare />
                1000
              </div>
              <div className="card__like">
                <FiThumbsUp />
                3000
              </div>
              <div className="card__menu">
                <FiMoreHorizontal />
                <div className="card__button">
                  <div className="card__edit">수정하기</div>
                  <div className="card__delet">삭제하기</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
