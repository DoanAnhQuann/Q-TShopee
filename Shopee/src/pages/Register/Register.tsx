import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Input from 'src/Components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { getRules, schema, Schema } from 'src/utils/rule'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { omit } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/Contexts/app.context'
import Button from 'src/Components/Buttons'

//c1 validate
// interface FormData {
//   email: string
//   password: string
//   confirm_password: string
// }
//c2
type FormData = Pick<Schema, 'email' | 'password' | 'confirm_password'>
const registerSchema = schema.pick(['email', 'password', 'confirm_password'])
export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema)
  })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.registerAccount(body)
  })
  //c1 validate
  // const rules = getRules(getValues)

  const onSubmit = handleSubmit(
    (data) => {
      console.log(data)
      const body = omit(data, ['confirm_password'])
      registerAccountMutation.mutate(body, {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          setProfile(data.data.data.user)
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
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
    },
    (data) => {
      const password = getValues('password')
      console.log('password', password)
      console.log('data', data)
    }
  )
  console.log(errors)
  return (
    <div className='bg-orange'>
      <div className='container'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng Kí</div>
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
                className='mt-2'
                placeholder='Password'
                autoComplete='on'
                errorMessage={errors.password?.message}
                //c1 validate
                // rules={rules.password}
              />
              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                autoComplete='on'
                placeholder='Confirm Password'
                errorMessage={errors.confirm_password?.message}
                //c1 validate
                // rules={rules.confirm_password}
              />
              <div className='mt-2'>
                <Button
                  className='w-full text-center py-4 px-2 uppercase bg-red-500 text-sm hover:hg-red-600 flex justify-center items-center'
                  isLoading={registerAccountMutation.isPending}
                  disabled={registerAccountMutation.isPending}
                >
                  Đăng Ki
                </Button>
              </div>

              <div className='flex item-center justify-center mt-8'>
                <span className='text-gray-400'>Bạn đã có tài khoản?</span>
                <Link className='text-red-400 ml-1' to='/login'>
                  Đăng Nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
