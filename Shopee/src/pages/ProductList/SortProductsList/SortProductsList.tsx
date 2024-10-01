import { sortBy, order as orderConstant } from 'src/constants/product'
import classNames from 'classnames'
import { ProductListConfig } from 'src/types/product.type'
import { createSearchParams, Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { omit } from 'lodash'
import { QueryConfig } from 'src/hooks/useQueryConfig'

interface Props {
  queryConfig: QueryConfig
  pageSize: number
}
export default function SortProductsList({ queryConfig, pageSize }: Props) {
  const page = Number(queryConfig.page)
  const { sort_by = sortBy.createdAt, order } = queryConfig
  const navigate = useNavigate()
  const handleSort = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams(
        omit(
          {
            ...queryConfig,
            sort_by: sortByValue
          },
          ['order']
        )
      ).toString()
    })
  }
  const isActiveSortBy = (sortByValue: Exclude<ProductListConfig['sort_by'], undefined>) => {
    return sort_by === sortByValue
  }
  const handlePriceOrder = (orderValue: Exclude<ProductListConfig['order'], undefined>) => {
    navigate({
      pathname: path.home,
      search: createSearchParams({
        ...queryConfig,
        sort_by: sortBy.price,
        order: orderValue
      }).toString()
    })
  }
  return (
    <div className='bg-gray-300/40 py-4 px-3'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center flex-wrap gap-2'>
          <div>Sắp xếp theo</div>
          <button
            className={classNames('h-8 px-4 capitalize text-sm hover:bg-orange/80 text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.sold),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.sold)
            })}
            onClick={() => handleSort(sortBy.sold)}
          >
            Phổ biến
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm hover:bg-orange/80 text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.view),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.view)
            })}
            onClick={() => handleSort(sortBy.view)}
          >
            Mới nhất
          </button>
          <button
            className={classNames('h-8 px-4 capitalize text-sm hover:bg-orange/80 text-center', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.createdAt),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.createdAt)
            })}
            onClick={() => handleSort(sortBy.createdAt)}
          >
            Bán chạy
          </button>
          <select
            className={classNames('h-8 px-4 capitalize  text-sm text-left outline-none', {
              'bg-orange text-white hover:bg-orange/80': isActiveSortBy(sortBy.price),
              'bg-white text-black hover:bg-slate-100': !isActiveSortBy(sortBy.price)
            })}
            value={order || ''}
            onChange={(event) => handlePriceOrder(event.target.value as Exclude<ProductListConfig['order'], undefined>)}
          >
            <option value='' className='bg-white text-black' disabled>
              Gía
            </option>
            <option className='bg-white text-black' value={orderConstant.asc}>
              Gía: Thấp đến cao
            </option>
            <option className='bg-white text-black' value={orderConstant.desc}>
              Gía: cao đến thấp
            </option>
          </select>
        </div>
        <div className='flex items-center'>
          <div className=''>
            <span className='text-orange'>{page}</span>
            <span>/{pageSize}</span>
          </div>
          <div className='flex justify-center items-center ml-2'>
            {page === 1 ? (
              <span className='flex justify-center items-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page - 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100  shadow'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            )}
            {page === pageSize ? (
              <span className='flex justify-center items-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100 cursor-not-allowed shadow'>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </span>
            ) : (
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    page: (page + 1).toString()
                  }).toString()
                }}
                className='flex justify-center items-center w-9 h-8 rounded-tl-sm rounded-bl-sm bg-white/60 hover:bg-slate-100  shadow'
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className='w-3 h-3'>
                  <path
                    fillRule='evenodd'
                    d='M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z'
                    clipRule='evenodd'
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
