import PageHeader from '../../components/PageHeader';
import PostForm from 'components/posts/PostForm';

export default function PostEditPage() {
  return (
    <div className="post">
      <PageHeader title="게시글 수정" />
      <PostForm />
    </div>
  );
}
