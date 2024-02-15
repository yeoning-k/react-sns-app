import { FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({ title }: { title?: string }) => {
  const navigate = useNavigate();

  return (
    <div className="page-header post__header">
      <div onClick={() => navigate(-1)}>
        <FiArrowLeft />
      </div>
      {title && <h2 className="page-header__title">{title}</h2>}
    </div>
  );
};

export default PageHeader;
