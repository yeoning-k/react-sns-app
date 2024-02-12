import { useContext, useEffect, useState } from 'react';
import PostCard from 'components/posts/PostCard';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { PostProps } from 'pages';
import { FiSearch } from 'react-icons/fi';
import AuthContext from 'context/AuthContext';
import { db } from 'firebaseApp';

export default function SearchPage() {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [tagQuery, setTagQuery] = useState<string>('');

  const { user } = useContext(AuthContext);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagQuery(e.target.value.trim());
  };

  useEffect(() => {
    if (user) {
      let postsRef = collection(db, 'posts');
      let postsQuery = query(
        postsRef,
        where('hashTags', 'array-contains-any', [tagQuery]),
        orderBy('createAt', 'desc')
      );

      onSnapshot(postsQuery, snapShot => {
        let dataObj = snapShot.docs.map(doc => ({
          ...doc.data(),
          id: doc?.id
        }));
        setPosts(dataObj as PostProps[]);
      });
    }
  }, [tagQuery, user]);

  return (
    <>
      <div className="page-header">
        <h2 className="page-header__title">검색</h2>
      </div>
      <div className="contents">
        <div className="search">
          <FiSearch />
          <input
            type="text"
            placeholder="해시태그를 검색하세요."
            onChange={onChange}
          />
        </div>
      </div>
      {posts?.length > 0 ? (
        posts.map(post => {
          return <PostCard post={post} key={post.id} />;
        })
      ) : (
        <div className="no-items">검색 결과가 없습니다 🥲</div>
      )}
    </>
  );
}
