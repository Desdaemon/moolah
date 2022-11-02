import { IconBaseProps, IconType } from "react-icons/lib"
import { MdCheckBox, MdCheckBoxOutlineBlank, MdIndeterminateCheckBox } from 'react-icons/md'

export interface CheckboxProps extends IconBaseProps {
  checked?: boolean
  checkedIcon?: IconType
  uncheckedIcon?: IconType
  indeterminateIcon?: IconType
}

export default function Checkbox(props: CheckboxProps) {
  const {checkedIcon, uncheckedIcon, ...iconProps} = props
  const Icon = props.checked ? checkedIcon || MdCheckBox :
    props.checked === false ? uncheckedIcon || MdCheckBoxOutlineBlank :
    props.indeterminateIcon || MdIndeterminateCheckBox

  return <Icon {...iconProps} />
}