import PageHeader from '../../components/PageHeader';
import PostForm from 'components/posts/PostForm';

export default function PostWritePage() {
  return (
    <div className="post">
      <PageHeader title="글쓰기" />
      <PostForm />
    </div>
  );
}
