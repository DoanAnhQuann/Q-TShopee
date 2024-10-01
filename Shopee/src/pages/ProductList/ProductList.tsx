import { keepPreviousData, useQuery } from '@tanstack/react-query'
import AsideFilter from './AsideFilter'
import Product from './Product/Product'
import productApi from 'src/apis/product.api'
import Paginate from 'src/Components/Pagination'
import { ProductListConfig } from 'src/types/product.type'
import categoryApi from 'src/apis/category.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import SortProductsList from './SortProductsList'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: ProductsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig as ProductListConfig)
    },
    placeholderData: keepPreviousData
  })
  const { data: CategoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => {
      return categoryApi.getCategories()
    }
  })
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        {ProductsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              {' '}
              <AsideFilter queryConfig={queryConfig} categories={CategoriesData?.data.data || []} />
            </div>
            <div className='col-span-9'>
              <SortProductsList queryConfig={queryConfig} pageSize={ProductsData?.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {ProductsData.data.data.products.map((product) => (
                  <div className='col-span-1' key={product._id}>
                    <Product product={product} />
                  </div>
                ))}
              </div>
              <Paginate queryConfig={queryConfig} pageSize={ProductsData?.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
