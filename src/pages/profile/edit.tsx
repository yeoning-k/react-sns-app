import { useContext, useEffect, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { FiImage, FiMinus } from 'react-icons/fi';
import AuthContext from 'context/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import { storage } from 'firebaseApp';
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString
} from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const STORAGE_DOWNLOAD_URL_STRING = 'https://firebasestorage.googleapis.com/';

export default function ProfileEditPage() {
  const [displayName, setDisplayName] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const key = `${user?.uid}/${uuidv4()}`;
    const storageRef = ref(storage, key);
    let newImageUrl;

    try {
      if (
        user?.photoURL &&
        user?.photoURL?.includes(STORAGE_DOWNLOAD_URL_STRING)
      ) {
        const imageRef = ref(storage, user?.photoURL);
        if (imageRef) {
          await deleteObject(imageRef).catch(error =>
            console.log('이미지 삭제 error', error)
          );
        }
      }

      if (imageUrl) {
        const data = await uploadString(storageRef, imageUrl, 'data_url');
        newImageUrl = await getDownloadURL(data?.ref);
      }

      if (user) {
        await updateProfile(user, {
          displayName: displayName || '',
          photoURL: newImageUrl || ''
        })
          .then(() => {
            toast.success('프로필 업데이트가 완료되었습니다.');
            navigate(`/profile`);
          })
          .catch(e => {
            toast.success('프로필 업데이트가 실패되었습니다.', e);
          });
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value }
    } = e;

    setDisplayName(value);
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
      setImageUrl(result);
    });
  };

  useEffect(() => {
    if (user?.photoURL) {
      setImageUrl(user.photoURL);
    }

    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  return (
    <div className="post">
      <PageHeader title="프로필 수정" />
      <form className="post-form" onSubmit={onSubmit}>
        <div className="post-form__profile">
          <input
            type="text"
            className="post-form__input"
            name="displayName"
            id="displayName"
            placeholder="이름"
            onChange={onChange}
            value={displayName}
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
            {imageUrl && (
              <div className="post-form__image">
                <img
                  src={imageUrl}
                  alt="attachment"
                  width="auto"
                  height={100}
                />
                <div
                  className="post-form__image-clear-btn"
                  onClick={() => setImageUrl(null)}
                >
                  <FiMinus />
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="post-form__submit">
            프로필 수정
          </button>
        </div>
      </form>
    </div>
  );
}
