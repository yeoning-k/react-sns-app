import Loader from 'components/Loader';
import PostCard from 'components/posts/PostCard';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

export default function PostDetailPage() {
  const params = useParams();
  const navigate = useNavigate();
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
      <div className="post__header">
        <div onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </div>
      </div>
      {post ? <PostCard post={post} /> : <Loader />}
    </div>
  );
}
