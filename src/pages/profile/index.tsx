import { useNavigate } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import PostCard from 'components/posts/PostCard';
import { useContext, useEffect, useState } from 'react';
import { PostProps } from 'pages';
import AuthContext from 'context/AuthContext';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from 'firebaseApp';

export default function ProfilePage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostProps[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'like'>('my');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(
        postsRef,
        activeTab === 'like'
          ? where('likes', 'array-contains', user.uid)
          : where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc?.id
          };
        });
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [user, activeTab]);

  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">프로필</h2>
      </div>
      <div className="profile">
        <div className="profile__icon">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="user profile" />
          ) : (
            <FiUser />
          )}
        </div>
        <div className="profile__name">{user?.displayName ?? '사용자님'}</div>
        <div className="profile__email">{user?.email}</div>
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
        <div
          className={`tab__menu ${activeTab === 'my' && 'tab__menu--active'}`}
          onClick={() => setActiveTab('my')}
        >
          내가 쓴 글
        </div>
        <div
          className={`tab__menu ${activeTab === 'like' && 'tab__menu--active'}`}
          onClick={() => setActiveTab('like')}
        >
          좋아요
        </div>
      </div>
      {posts?.length > 0 ? (
        posts.map(post => {
          return <PostCard post={post} key={post.id} />;
        })
      ) : (
        <div className="no-items">게시글이 없습니다 🥲</div>
      )}
    </>
  );
}
