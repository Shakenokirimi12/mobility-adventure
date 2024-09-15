import * as React from 'react';
import {Box, Avatar, Typography, LinearProgress} from '@mui/material';

const DetailDrawer: React.FC = () => {
  return (
    <Box mt={2}>
      {/* Image */}
      <Box display="flex" justifyContent="center">
        <Avatar
          src="https://upload.wikimedia.org/wikipedia/commons/a/a7/A_chital_stag_1.JPG" // Replace with the path of your image
          alt="シカ美"
          sx={{ width: 250, height: 180, borderRadius: 2 }}
          variant="square"
        />
      </Box>

      {/* Text Information */}
      <Typography variant="h6" gutterBottom mt={2}>
        シカ美（メス、3歳）
      </Typography>
      <Typography variant="body1">性格: 気まぐれ、食いしん坊</Typography>
      <Typography variant="body1" gutterBottom>
        自分との距離: 2m
      </Typography>

      {/* Hunger Level */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
        <Typography variant="body2" fontWeight="bold">満腹度</Typography>
        <Typography variant="body2" color="text.secondary">おなかが減ってるよ😓</Typography>
      </Box>
      <LinearProgress variant="determinate" value={30} sx={{ height: 10, borderRadius: 5, mt: 1, mb: 2 }} color="error" />

      {/* Stamina Level */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight="bold">体力</Typography>
      </Box>
      <LinearProgress variant="determinate" value={70} sx={{ height: 10, borderRadius: 5, mt: 1, mb: 2 }} color="success" />

      {/* Stress Level */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" fontWeight="bold">ストレス度</Typography>
      </Box>
      <LinearProgress variant="determinate" value={60} sx={{ height: 10, borderRadius: 5, mt: 1 }} color="warning" />
    </Box>
  );
};

export default DetailDrawer;
