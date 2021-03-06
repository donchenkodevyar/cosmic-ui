/* eslint-disable react/style-prop-object */
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FormattedNumber } from 'react-intl';

interface CircularProgressWithLabelProps {
  readonly value: number;
}

export const CircularProgressWithLabel: React.FC<CircularProgressProps & CircularProgressWithLabelProps> = props => {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          <FormattedNumber style="percent" value={props.value / 100} />
        </Typography>
      </Box>
    </Box>
  );
};
