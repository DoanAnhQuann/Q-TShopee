import { InputHTMLAttributes, useState } from 'react'
import { useController, type UseControllerProps } from 'react-hook-form'

// interface Props {
//   type: React.HTMLInputTypeAttribute
//   errorMessage?: string
//   placeholder?: string
//   className?: string
//   name: string
//   register: UseFormRegister<any>
//   rules?: RegisterOptions
//   autoComplete?: string
// }
export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputV2(props: UseControllerProps<any> & InputNumberProps) {
  const {
    type,
    onChange,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    value = '',
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  //su dung de ngay cho inputnumbwer co the nhap so khi loai bo di onchange va value
  const [localValue, setLocalValue] = useState<string>(field.value)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFormInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFormInput) || valueFormInput === '')
    if (numberCondition || type !== 'number') {
      //thuc thi callback tu ben ngoai truyen tu props vao
      //Cap nhap local valueState
      setLocalValue(valueFormInput)
      //Goi field.onchage de cap nhat va state react hook form
      field.onChange(event)
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} {...field} onChange={handleChange} value={value || localValue} />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}
export default InputV2
