import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import authApi from 'src/apis/auth.api'
import Button from 'src/Components/Buttons'
import Input from 'src/Components/Input'
import { AppContext } from 'src/Contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Schema, schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
type FormData = Pick<Schema, 'email' | 'password'>
const loginSchema = schema.pick(['email', 'password'])
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })
  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })
  const onSubmit = handleSubmit((data) => {
    console.log(data)
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        setProfile(data.data.data.user)
        navigate('/')
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            setError('email', {
              message: formError.email,
              type: 'Server'
            })
          }
          if (formError) {
            setError('password', {
              message: formError.password,
              type: 'Server'
            })
          }
        }
      }
    })
  })
  console.log(errors)
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Nhập</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                //c1 validate
                // rules={rules.email}
                placeholder='Email'
              />
              <Input
                name='password'
                register={register}
                type='password'
                className='mt-3'
                placeholder='Password'
                autoComplete='on'
                errorMessage={errors.password?.message}
                //c1 validate
                // rules={rules.password}
              />
              <div className='mt-3'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-sm hover:hg-red-600 flex justify-center items-center'
                  isLoading={loginMutation.isPending}
                  disabled={loginMutation.isPending}
                >
                  Đăng Nhập
                </Button>
              </div>
              <div className='flex item-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn mới biết đến Shopee?</span>
                <Link className='text-red-400 ml-1' to='/register'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
