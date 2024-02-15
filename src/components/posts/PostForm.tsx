import AuthContext from 'context/AuthContext';
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString
} from 'firebase/storage';
import { db, storage } from 'firebaseApp';
import { PostProps } from 'pages';
import { useContext, useEffect, useState, useCallback } from 'react';
import { FiImage, FiMinus } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const PostForm = () => {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [content, setContent] = useState<string>('');
  const [hashTag, setHashTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    setIsSubmitting(true);

    e.preventDefault();

    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    const imageRef = ref(storage, post?.imageUrl);

    if (post && post?.imageUrl) {
      await deleteObject(imageRef).catch(error => console.log(error));
    }

    let imageUrl = '';
    if (imageFile) {
      const data = await uploadString(storageRef, imageFile, 'data_url');
      imageUrl = await getDownloadURL(data?.ref);
    }

    try {
      if (post) {
        const postRef = doc(db, 'posts', post?.id);
        await updateDoc(postRef, {
          content: content,
          hashTags: tags,
          imageUrl: imageUrl
        });
        navigate(`/posts/${post?.id}`);
        toast.success('게시글을 수정이 완료되었습니다.');
      } else {
        await addDoc(collection(db, 'posts'), {
          content: content,
          createdAt: new Date(),
          uid: user?.uid,
          email: user?.email,
          hashTags: tags,
          imageUrl: imageUrl
        });
        navigate('/');
        toast.success('게시글을 등록이 완료되었습니다.');
      }
      setIsSubmitting(false);
    } catch (e) {
      console.log('error', e);
    }
  };

  const onChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const {
      target: { name, value }
    } = e;

    if (name === 'content') {
      setContent(value);
    }

    if (name === 'hashtag') {
      setHashTag(e.target.value.trim());
    }
  };

  const getPost = useCallback(
    async (id: string) => {
      if (id) {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        setPost({ ...(docSnap.data() as PostProps), id: docSnap.id });
        setContent(docSnap?.data()?.content);
        setTags(docSnap?.data()?.hashTags);
        setImageFile(docSnap?.data()?.imageUrl);
      }
    },
    [params.id]
  );

  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  const handleKeyUp = (e: any) => {
    if (e.keyCode === 32 && e.target.value.trim() !== '') {
      if (tags.includes(e.target.value.trim())) {
        toast.error('같은 태그가 있습니다.');
      } else {
        setTags(prev => (prev?.length > 0 ? [...prev, hashTag] : [hashTag]));
        setHashTag('');
      }
    }
  };

  const handleFileUpload = (e: any) => {
    const {
      target: { files }
    } = e;

    const file = files?.[0];
    const fileReader = new FileReader();
    fileReader?.readAsDataURL(file);

    fileReader.addEventListener('loadend', async (e: any) => {
      const {
        currentTarget: { result }
      } = e;
      setImageFile(result);
    });
  };

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
        {tags?.length > 0 && (
          <div className="post-form__tags">
            {tags?.map((tag, idx) => (
              <span
                key={idx}
                onClick={() => {
                  setTags(tags?.filter(val => val !== tag));
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        <input
          type="text"
          className="post-form__input"
          name="hashtag"
          id="hashtag"
          placeholder="스페이스 바를 입력하여 해시태그를 등록 할 수 있습니다."
          onChange={onChange}
          onKeyUp={handleKeyUp}
          value={hashTag}
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
            value=""
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          {imageFile && (
            <div className="post-form__image">
              <img src={imageFile} alt="attachment" width="auto" height={100} />
              <div
                className="post-form__image-clear-btn"
                onClick={() => setImageFile(null)}
              >
                <FiMinus />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="post-form__submit"
          disabled={isSubmitting}
        >
          {post ? '수정' : '등록'}하기
        </button>
      </div>
    </form>
  );
};

export default PostForm;
