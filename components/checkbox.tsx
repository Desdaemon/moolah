import { IconBaseProps, IconType } from "react-icons/lib"
import { MdCheckBox, MdCheckBoxOutlineBlank, MdIndeterminateCheckBox } from 'react-icons/md'

export interface CheckboxProps extends IconBaseProps {
  checked?: boolean
  checkedIcon?: IconType
  uncheckedIcon?: IconType
  indeterminateIcon?: IconType
}

export default function Checkbox(props: CheckboxProps) {
  function omit<T, K extends keyof T>(props: T, ...keys: K[]) {
    const ret: any = {}
    for (const i in props) {
      if (!keys.includes(i as any)) ret[i] = props[i]
    }
    return ret as Omit<T, K>
  }

  const iconProps = omit(props, 'checkedIcon', 'uncheckedIcon')
  const Icon = props.checked ? props.checkedIcon || MdCheckBox :
    props.checked === false ? props.uncheckedIcon || MdCheckBoxOutlineBlank :
    props.indeterminateIcon || MdIndeterminateCheckBox

  return <Icon {...iconProps} />
}