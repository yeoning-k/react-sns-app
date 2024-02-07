import PostCard from 'components/posts/PostCard';
import AuthContext from 'context/AuthContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PostProps {
  email: string;
  content: string;
  createAt: string;
  uid: string;
  id: string;
  hashTags: string[];
}

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(postsRef, orderBy('createAt', 'desc'));

      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, []);

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
