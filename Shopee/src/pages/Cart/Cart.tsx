import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import purchaseApi from 'src/apis/purchase.api'
import Button from 'src/Components/Buttons'
import QuantityController from 'src/Components/QuantityController'
import path from 'src/constants/path'
import { purchaseStatus } from 'src/constants/purchase'
import { Purchase } from 'src/types/purchase.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/Contexts/app.context'

export default function Cart() {
  //tao ra bien location de nhan dc state thong qua react rounter dom productdetail
  const location = useLocation()
  const ChoosenPurchaseFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId
  //TACH STATE RA APPCONTEXT DE LUU TRANG THAI STATE KHI CHUYEN TRANG MA K F5 VAN GIU NGUYEN STATE
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart })
  })
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => {
      //refresh lai api khi thanh cong de chinh lai tt disabled
      refetch()
    }
  })
  const purchasesInCart = purchasesInCartData?.data.data
  //bien dung de check xem tat ca cac item co dc check k
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')
      console.log(extendedPurchaseObject)
      return (
        purchasesInCart?.map((purchase) => {
          const isChoosenPurchaseFromLocation = ChoosenPurchaseFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChoosenPurchaseFromLocation || Boolean(extendedPurchaseObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, ChoosenPurchaseFromLocation])

  //clear state sau khi f5
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])
  console.log(purchasesInCart)

  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      //su dung thu vien immerde tim index
      produce((draft) => {
        //draft giong previous
        //draft[purchaseIndex] dung de lay ra vi tri idex can thay doi state
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  //tao su kien chon check tat ca\

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => {
        return {
          ...purchase,
          //chi khi tat ca deu check thi isAllCheck moi true con lai la false ngc lai thi tat ca deu true
          checked: !isAllChecked
        }
      })
    )
  }

  const handleQuantity = (purchaseIndex: number, value: number, enable: boolean) => {
    if (enable) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        produce((draft) => {
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({ product_id: purchase.product._id, buy_count: value })
    }
  }

  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  //call api mua san pham
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (data) => {
      refetch()
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  //call api xoa san pham
  const deletePurchasesMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => {
      refetch()
    }
  })

  //ham xoa 1 san pham
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchasesMutation.mutate([purchaseId])
  }

  //tao bien de loc ra cac item da dc checked vao 1 []
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  //dem cac item dc check
  const checkedPurchasesCount = checkedPurchases.length

  //xoa nhieu item
  const handleDeleteManyPurchases = () => {
    const purchasesId = checkedPurchases.map((purchase) => purchase._id)
    deletePurchasesMutation.mutate(purchasesId)
  }

  //tinh tong gia
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  //tinh tien tiet kiem
  const totalCheckedPurchaseSavingPrice = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  //xu li khi click nut mua
  const handleBuyPurchases = () => {
    if (checkedPurchases.length > 0) {
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }
  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6'>
                    <div className='flex items-center '>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h-5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>San Pham</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Don gia</div>
                      <div className='col-span-1'>So luong</div>
                      <div className='col-span-1'>So tien</div>
                      <div className='col-span-1'>Thao tac</div>
                    </div>
                  </div>
                </div>
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases.map((purchase, index) => {
                      return (
                        <div
                          className='mb-5 items-center grid grid-cols-12 rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500'
                          key={purchase._id}
                        >
                          <div className='col-span-6'>
                            <div className='flex'>
                              <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                                <input
                                  type='checkbox'
                                  className='h-5 w-5 accent-orange'
                                  checked={purchase.checked}
                                  onChange={handleChecked(index)}
                                />
                              </div>
                              <div className='flex-grow'>
                                <div className='flex'>
                                  <Link
                                    to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                    className='h-20 w-20 flex-shrink-0 '
                                  >
                                    <img alt={purchase.product.name} src={purchase.product.image} />
                                  </Link>
                                  <div className='flex-grow px-2 pt-1 pb-2'>
                                    <Link
                                      to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
                                      className='line-clamp-2 text-left'
                                    >
                                      {purchase.product.name}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className='col-span-6'>
                            <div className='grid grid-cols-5 items-center'>
                              <div className='col-span-2'>
                                <div className='flex items-center justify-center'>
                                  <span className='text-gray-300 line-through'>
                                    đ{formatCurrency(purchase.product.price_before_discount)}
                                  </span>
                                  <span className='ml-3'>đ{formatCurrency(purchase.price)}</span>
                                </div>
                              </div>
                              <div className='col-span-1 '>
                                <QuantityController
                                  max={purchase.product.quantity}
                                  value={purchase.buy_count}
                                  classNameWrapper='flex items-center'
                                  onIncrease={(value) =>
                                    handleQuantity(index, value, value < purchase.product.quantity)
                                  }
                                  onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                  disabled={purchase.disabled}
                                  onType={handleTypeQuantity(index)}
                                  onFocusOut={(value) =>
                                    handleQuantity(
                                      index,
                                      value,
                                      value >= 1 &&
                                        value <= purchase.product.quantity &&
                                        value !== (purchasesInCart as Purchase[])[index].buy_count
                                    )
                                  }
                                />
                              </div>
                              <div className='col-span-1'>
                                <span className='text-orange'>
                                  đ{formatCurrency(purchase.product.price * purchase.buy_count)}
                                </span>
                              </div>
                              <div className='col-span-1'>
                                <button
                                  onClick={handleDelete(index)}
                                  className='bg-none text-black transition-colors hover:text-orange'
                                >
                                  Xoa
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            <div className='sticky bottom-0 z-10 flex flex-col  sm:flex-row sm:items-center rounded-sm bg-white p-5 shadow border-gray-100 mt-8'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center px-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5 accent-orange'
                    checked={isAllChecked}
                    onChange={handleCheckAll}
                  />
                </div>
                <button onClick={handleCheckAll} className='bg-none mx-3 border-none'>
                  Chon tat ca({extendedPurchases.length})
                </button>
                <button onClick={handleDeleteManyPurchases} className='bg-none mx-3 border-none'>
                  Xoa
                </button>
              </div>

              <div className='sm:ml-auto flex flex-col sm:flex-row items-center mt-5 sm:mt-0'>
                <div className=''>
                  <div className='flex items-center sm:justify-end'>
                    <div className=''>Tong thanh toan ({checkedPurchasesCount} san pham):</div>
                    <div className='ml-2 text-2xl text-orange'>đ{formatCurrency(totalCheckedPurchasePrice)}</div>
                  </div>
                  <div className='flex items-center sm:justify-end text-sm'>
                    <div className='text-gray-500 '>Tiet kiem</div>
                    <div className='ml-6 text-orange'>đ{formatCurrency(totalCheckedPurchaseSavingPrice)}</div>
                  </div>
                </div>
                <Button
                  onClick={handleBuyPurchases}
                  disabled={buyProductsMutation.isPending}
                  className='sm:ml-4 mt-5 sm:mt-0  h-10 w-52 text-white text-center  uppercase bg-red-500 text-sm hover:hg-red-600 flex justify-center items-center'
                >
                  Mua hang
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='text-center'>
            <img src='' alt='anh' className='h-24 w-24 mx-auto' />
            <div className='font-bold text-gray-400 mt-5'>Gio hang cua b con trong</div>
            <div className='text-center mt-5'>
              <Link
                to={path.home}
                className=' bg-orange px-10 hover:bg-orange/80 transition-all py-2 rounded-sm uppercase text-white'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
