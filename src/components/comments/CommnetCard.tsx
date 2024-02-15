import AuthContext from 'context/AuthContext';
import { Timestamp, arrayRemove, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useContext } from 'react';
import { FiDelete, FiEdit, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

export interface CommentProps {
  comment: string;
  uid: string;
  email: string;
  createdAt: Timestamp;
}

const CommentCard = ({ post }: { post: PostProps }) => {
  const { user } = useContext(AuthContext);
  return post?.comments
    .slice(0)
    ?.reverse()
    ?.map((comment: CommentProps, idx: number) => {
      const date = new Date(
        comment.createdAt.seconds * 1000 +
          comment.createdAt.nanoseconds / 1000000
      );

      const handleDelete = async () => {
        if (post) {
          try {
            const postRef = doc(db, 'posts', post?.id);
            await updateDoc(postRef, {
              comments: arrayRemove(comment)
            });
            toast.success('댓글이 삭제되었습니다.');
          } catch (error) {
            console.log(error);
          }
        }
      };

      return (
        <div className="comment" key={idx}>
          <div className="comment__profile">
            <div className="comment__icon">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="profile" />
              ) : (
                <FiUser />
              )}
            </div>
          </div>
          <div className="comment__box">
            <div className="comment__user">{comment?.email}</div>
            <div className="comment__content">{comment?.comment}</div>

            <div className="comment__footer">
              <div className="comment__date">{date.toLocaleString('ko')}</div>
              {user?.uid === comment?.uid && (
                <div className="comment__delete" onClick={handleDelete}>
                  삭제하기
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
};

export default CommentCard;
