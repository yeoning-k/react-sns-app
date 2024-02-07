import AuthContext from 'context/AuthContext';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'firebaseApp';
import { PostProps } from 'pages';
import { useContext, useEffect, useState, useCallback } from 'react';
import { FiImage } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const PostForm = () => {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (post) {
        const postRef = doc(db, 'posts', post?.id);
        await updateDoc(postRef, {
          content: content
        });
        navigate(`/posts/${post?.id}`);
        toast.success('게시글을 수정이 완료되었습니다.');
      } else {
        await addDoc(collection(db, 'posts'), {
          content: content,
          createAt: new Date()?.toLocaleDateString('ko', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }),
          uid: user?.uid,
          email: user?.email
        });
        navigate('/');
        toast.success('게시글을 등록이 완료되었습니다.');
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const {
      target: { name, value }
    } = e;

    if (name === 'content') {
      setContent(value);
    }
  };

  const handleFileUpload = () => {};

  const getPost = useCallback(
    async (id: string) => {
      if (id) {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);

        setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
        setContent(docSnap?.data()?.content);
      }
    },
    [params.id]
  );

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  return (
    <form className="post-form" onSubmit={onSubmit}>
      <textarea
        placeholder="내용을 입력해주세요."
        required
        name="content"
        id="content"
        className="post-form__textarea"
        onChange={onChange}
        value={content}
      />
      <div className="post-form__hashtags">
        <div className="post-form__tags">
          <span>#hashtag</span>
        </div>
        <input
          type="text"
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="스페이스 바를 입력하여 해시태그를 등록 할 수 있습니다."
        />
      </div>
      <div className="post-form__bottom">
        <div className="post-form__file">
          <label htmlFor="file-input">
            <FiImage />
          </label>
          <input
            type="file"
            name="file-input"
            id="file-input"
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <button type="submit" className="post-form__submit">
          {post ? '수정' : '등록'}하기
        </button>
      </div>
    </form>
  );
};

export default PostForm;
