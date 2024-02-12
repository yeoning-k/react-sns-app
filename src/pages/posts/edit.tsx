import PostForm from 'components/posts/PostForm';
import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function PostEditPage() {
  const navigate = useNavigate();

  return (
    <div className="post">
      <div className="page-header post__header">
        <div onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </div>
        <h2 className="page-header__title">게시글 수정</h2>
      </div>
      <PostForm />
    </div>
  );
}
