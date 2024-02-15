import Loader from 'components/Loader';
import PostCard from 'components/posts/PostCard';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import CommentForm from 'components/comments/CommentForm';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(
    async (id: string) => {
      if (id) {
        const docRef = doc(db, 'posts', id);
        onSnapshot(docRef, doc => {
          setPost({ ...(doc.data() as PostProps), id: doc.id });
        });
      }
    },
    [params.id]
  );

  useEffect(() => {
    if (params.id) getPost(params.id);
  }, [getPost, params.id]);

  return (
    <div className="post">
      <PageHeader />
      {post ? (
        <>
          <PostCard post={post} />
          <CommentForm post={post} />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
}
