import AuthContext from 'context/AuthContext';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import CommentCard, { CommentProps } from './CommnetCard';

const CommentForm = ({ post }: { post: PostProps | null }) => {
  const [comment, setComment] = useState<string>('');
  const { user } = useContext(AuthContext);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    if (post && user) {
      try {
        const postRef = doc(db, 'posts', post?.id);
        const commentObj = {
          comment: comment,
          uid: user?.uid,
          email: user?.email,
          createdAt: new Date()
        };

        await updateDoc(postRef, {
          comments: arrayUnion(commentObj)
        });

        toast.success('댓글 생성이 완료되었습니다.');
        setComment('');
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value }
    } = e;

    if (name === 'comment') {
      setComment(value);
    }
  };

  return (
    <>
      <form className="post-form" onSubmit={onSubmit}>
        <textarea
          placeholder="내용을 입력해주세요."
          required
          name="comment"
          id="comment"
          className="post-form__textarea"
          onChange={onChange}
          style={{ border: 'none' }}
          value={comment}
        />
        <div className="post-form__bottom">
          <div />
          <button
            type="submit"
            className="post-form__submit"
            disabled={!comment}
          >
            댓글 등록
          </button>
        </div>
      </form>
      {post?.comments && <CommentCard post={post} />}
    </>
  );
};

export default CommentForm;
