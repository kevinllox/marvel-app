/* eslint-disable react/no-unescaped-entities */
import { useSearchParams } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
import IApiResponse from '../../interfaces/IApiResponse';
import IComics from '../../interfaces/IComics';
import Spinner from '../Spinner/Spinner';
import ComicCard from './ComicCard';
import createURLFetch from '../../helpers/createURLFetch';
import IURLParams from '../../interfaces/IURLParams';
import usePagination from '../../hooks/usePagination';
import Pagination from '../Pagination/Pagination';
import Message from '../Message/Message';

function ComicGrid() {
  const [searchParams] = useSearchParams();
  const comicsFetch: IURLParams = {
    titleParam: searchParams.get('title') || '',
    formatParam: searchParams.get('format') || '',
    page: searchParams.get('page') || '1',
  };
  const { state, data, error } = useFetch<IApiResponse<IComics>>(createURLFetch(comicsFetch, 'comics'));
  const paginationRange = usePagination(
    {
      totalCount: data?.data?.total || 0,
      pageSize: 20,
      currentPage: Number(comicsFetch.page),
    },
  );
  if (state === 'loading') return <Spinner />;
  if (error) return <p>There was an error</p>;
  if (data?.data?.results?.length === 0) return <Message typeMessage="We couldn't find more comics" />;

  return (
    <>
      <div className="characters__grid">
        {data?.data?.results?.map(({ id, title, thumbnail }) => (
          <ComicCard
            key={id}
            title={title}
            thumbnail={thumbnail}
            id={id}
          />
        ))}
      </div>
      <Pagination currentPage={comicsFetch.page} paginationRange={paginationRange} />
    </>
  );
}

export default ComicGrid;
