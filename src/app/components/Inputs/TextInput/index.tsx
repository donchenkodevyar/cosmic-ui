import React from 'react';
import { DEBOUNCE_TIME } from 'lib/constants/general';
import useDebounce from 'lib/hooks/useDebounce';
import { Input, InputWrapper, TextArea, TextInputWrapper } from './styles';
import { InputLabel } from '../styles/Label';
import { Required } from '../FormTextInput/styles';
import { ErrorMessage } from 'app/components/Basic/ErrorMessage/ErrorMessage';
import IconWrapper from 'app/components/Buttons/IconWrapper';
import { eyeHideIcon, eyeIcon } from 'app/components/SVGIcons/eyeIcon';

interface IProps {
  id?: string;
  name: string;
  type?: 'text' | 'password' | 'email' | 'textarea';
  value: string | null;
  label?: JSX.Element | string;
  onChange?: (value: string | null) => void;
  onBlurChange?: (value: string | null) => void;
  disabled?: boolean;
  readOnly?: boolean;
  readOnlyField?: boolean;
  styles?: Object;
  placeholder?: string;
  required?: boolean;
  inputStyles?: Object;
  labelStyles?: Object;
  error?: string;
  hideEmptyInvalid?: boolean;
}

const TextInput: React.FC<IProps> = (props: IProps) => {
  const [type, setType] = React.useState<string>(props.type || 'text');
  const [textValue, setTextValue] = React.useState<string>(props.value || '');
  const [isTyping, setIsTyping] = React.useState(false);
  const [touched, setTouched] = React.useState(false);
  const debouncedSearchTerm = useDebounce(textValue, DEBOUNCE_TIME);
  React.useEffect(() => {
    if ((debouncedSearchTerm || debouncedSearchTerm === '' || debouncedSearchTerm === null) && isTyping) {
      setIsTyping(false);
      if (props.onChange) {
        const value = textValue || null;
        props.onChange(value);
      }
    }
  }, [debouncedSearchTerm]);

  React.useEffect(() => {
    if (props.value !== textValue) {
      setTextValue(props.value);
    }
  }, [props.value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsTyping(true);
    const { value } = e.target;
    setTextValue(value);
    if (!touched) {
      setTouched(true);
    }
  };

  const onBlur = () => {
    setTouched(true);
    if (!props.onBlurChange) return;
    const value = textValue || null;
    props.onBlurChange(value);
  };

  const onChangeType = () => {
    if (type === 'password') {
      setType('text');
      return;
    }
    setType(props.type || 'password');
  };
  return (
    <TextInputWrapper style={props.styles}>
      {props.label && (
        <InputLabel style={props.labelStyles} htmlFor={props.id} disabled={props.disabled || props.readOnly}>
          {props.label}
          {props.required && <Required>*</Required>}
        </InputLabel>
      )}
      {type !== 'textarea' ? (
        <InputWrapper>
          <Input
            required={props.required}
            id={props.id}
            name={props.name}
            type={type || 'text'}
            value={textValue}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={props.readOnly || props.readOnlyField}
            disabled={props.disabled}
            placeholder={props.placeholder}
            style={props.inputStyles}
            autoComplete="new-password"
            className={touched && !textValue && !props.hideEmptyInvalid ? 'invalid' : null}
          />
          {props.type === 'password' && (
            <IconWrapper onClick={onChangeType} styles={{ zIndex: 1, position: 'absolute', top: 'calc(50% - 8px)', right: '16px' }} icon={type === 'password' ? eyeIcon : eyeHideIcon} />
          )}
        </InputWrapper>
      ) : (
        <TextArea
          required={props.required}
          id={props.id}
          name={props.name}
          value={textValue}
          onBlur={onBlur}
          onChange={onChange}
          readOnly={props.readOnly}
          disabled={props.disabled}
          placeholder={props.placeholder}
          style={props.inputStyles}
        />
      )}
      {touched && props.error && (
        <ErrorMessage textAlign="left" margin="6px 0 0 0">
          {props.error}
        </ErrorMessage>
      )}
    </TextInputWrapper>
  );
};

export default React.memo(TextInput);
