import React from 'react';
import { HexColorPicker } from 'react-colorful';
import { Required } from '../FormTextInput/styles';
import { InputLabel } from '../styles/Label';
import { TextInputWrapper } from '../TextInput/styles';
import ColorSchema from './ColorSchema';
import { PoperStyles } from './PoperStyles';
import { Popover } from '@mui/material';
import { Paper, PreviewColor, PreviewWrapper } from './styles';
import { useDebounce } from 'use-debounce';
import { DEBOUNCE_TIME } from 'lib/constants/general';
interface Props {
  id: string;
  label?: string;
  color: string;
  colorSchema?: string[][];
  styles?: Object;
  previewColorStyles?: Object;
  required?: boolean;
  labelStyles?: Object;
  onChange: (v: string) => void;
}

const ColorPiker: React.FC<Props> = (props: Props) => {
  const [color, setColor] = React.useState<string>(props.color || '');
  const [isOpen, setOpenPopup] = React.useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [debounceColorValue] = useDebounce(color, DEBOUNCE_TIME);
  const previewRef = React.useRef<HTMLDivElement>(null);
  const poperStyles = PoperStyles();
  React.useEffect(() => {
    if (debounceColorValue) {
      if (props.onChange) {
        props.onChange(color);
      }
    }
  }, [debounceColorValue]);

  React.useEffect(() => {
    if (props.color !== color) {
      setColor(color);
    }
  }, [props.color]);

  const onChange = (v: string) => {
    previewRef.current.style.background = v;
    setColor(v);
  };

  const onQuickSelect = (v: string) => {
    onClose();
    setColor(v);
  };

  const onOpenPopup = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
    setOpenPopup(true);
  };

  const onClose = () => {
    setAnchorEl(null);
    setOpenPopup(false);
  };

  return (
    <TextInputWrapper style={props.styles}>
      {props.label && (
        <InputLabel style={props.labelStyles} htmlFor={props.id}>
          {props.label}
          {props.required && <Required>*</Required>}
        </InputLabel>
      )}
      <PreviewWrapper style={props.previewColorStyles} onClick={e => onOpenPopup(e)}>
        <PreviewColor ref={previewRef} style={{ background: debounceColorValue }} />
      </PreviewWrapper>
      <Popover
        id="color-piker"
        open={isOpen}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ root: poperStyles.root, paper: poperStyles.paper }}
      >
        <Paper>
          <HexColorPicker color={debounceColorValue} onChange={onChange} />
          {props.colorSchema && props.colorSchema.length ? <ColorSchema id={props.id} schema={props.colorSchema} onClick={onQuickSelect} /> : null}
        </Paper>
      </Popover>
    </TextInputWrapper>
  );
};

export default React.memo(ColorPiker);
