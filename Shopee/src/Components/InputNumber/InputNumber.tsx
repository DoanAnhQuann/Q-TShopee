/* eslint-disable @typescript-eslint/no-explicit-any */
import { forwardRef, InputHTMLAttributes, useState } from 'react'

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
const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full outline-none border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm',
    classNameError = 'mt-1 text-red-600 min-h-[1.25rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  //su dung de ngay cho inputnumbwer co the nhap so khi loai bo di onchange va value
  const [localValue, setLocalValue] = useState<string>(value as string)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (/^\d+$/.test(value) || value === '') {
      //thuc thi callback tu ben ngoai truyen tu props vao
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      onChange && onChange(event)
      //Cap nhap local valueState
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input className={classNameInput} {...rest} onChange={handleChange} ref={ref} value={value || localValue} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})
export default InputNumber
