import AuthContext from 'context/AuthContext';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useContext } from 'react';
import {
  FiUser,
  FiThumbsUp,
  FiMessageSquare,
  FiEdit,
  FiDelete
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostCard = ({ post }: { post: PostProps }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDelete = async () => {
    const confirm = window.confirm('해당 게시글을 삭제 하시겠습니까?');

    if (confirm) {
      await deleteDoc(doc(db, 'posts', post.id));
      navigate('/');
      toast.success('게시글을 삭제했습니다.');
    }
  };

  return (
    <div className="card" key={post?.id}>
      <div className="card__header">
        <div className="card__profile">
          <div className="card__icon">
            <FiUser />
          </div>
          <div className="card__box">
            <div className="card__user">{post?.email}</div>
            <div className="card__date">{post?.createAt}</div>
          </div>
        </div>
        {user?.uid !== post?.uid && (
          <button className="card__following">팔로잉</button>
        )}
      </div>
      <div className="card__body">
        <Link to={`/posts/${post?.id}`}>
          <div className="card__content">{post?.content}</div>
          {post?.hashTags?.length > 0 && (
            <div className="card__hashtags">
              {post.hashTags.map((tag, idx) => (
                <span key={idx}>#{tag}</span>
              ))}
            </div>
          )}
        </Link>
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
        {user?.uid === post?.uid && (
          <>
            <div
              className="card__edit"
              onClick={() => navigate(`/posts/edit/${post?.id}`)}
            >
              <FiEdit />
              수정하기
            </div>
            <div className="card__delete" onClick={handleDelete}>
              <FiDelete />
              삭제하기
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostCard;
