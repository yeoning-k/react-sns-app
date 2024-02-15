import Loader from 'components/Loader';
import PostCard from 'components/posts/PostCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);

  const getPost = useCallback(
    async (id: string) => {
      if (id) {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
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
      {post ? <PostCard post={post} /> : <Loader />}
    </div>
  );
}
