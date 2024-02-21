import PostCard from 'components/posts/PostCard';
import AuthContext from 'context/AuthContext';
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { db } from 'firebaseApp';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface PostProps {
  email: string;
  content: string;
  createdAt: Timestamp;
  uid: string;
  id: string;
  hashTags?: string[];
  imageUrl?: string;
  likes?: string[];
  likeCount?: number;
  comments?: any;
}

interface UserProps {
  id: string;
}

type tabType = 'all' | 'following';

export default function HomePage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [followingPost, setFollowingPost] = useState<PostProps[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>(['']);
  const [activeTab, setActiveTab] = useState<tabType>('all');
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const getFollowingIds = useCallback(async () => {
    if (user?.uid) {
      const ref = doc(db, 'following', user?.uid);
      onSnapshot(ref, doc => {
        setFollowingIds(['']);
        doc
          ?.data()
          ?.users?.map((user: UserProps) =>
            setFollowingIds(prev => (prev ? [...prev, user?.id] : []))
          );
      });
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(postsRef, orderBy('createdAt', 'desc'));
      let followingQuery = query(
        postsRef,
        where('uid', 'in', followingIds),
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

      onSnapshot(followingQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => {
          return {
            ...doc.data(),
            id: doc?.id
          };
        });
        setFollowingPost(dataObj as PostProps[]);
      });
    }
  }, [followingIds, user]);

  useEffect(() => {
    if (user?.uid) {
      getFollowingIds();
    }
  }, [getFollowingIds, user?.uid]);

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
        <div
          className={`tab__menu ${activeTab === 'all' && 'tab__menu--active'}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </div>
        <div
          className={`tab__menu ${
            activeTab === 'following' && 'tab__menu--active'
          }`}
          onClick={() => setActiveTab('following')}
        >
          팔로잉
        </div>
      </div>
      {activeTab === 'all' &&
        (posts?.length > 0 ? (
          posts.map(post => {
            return <PostCard post={post} key={post.id} />;
          })
        ) : (
          <div className="no-items">게시글이 없습니다 🥲</div>
        ))}
      {activeTab === 'following' &&
        (followingPost?.length > 0 ? (
          followingPost.map(post => {
            return <PostCard post={post} key={post.id} />;
          })
        ) : (
          <div className="no-items">게시글이 없습니다 🥲</div>
        ))}
    </>
  );
}
