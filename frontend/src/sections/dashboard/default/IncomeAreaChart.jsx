import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { LineChart } from '@mui/x-charts/LineChart';

// Labels for months and week days
const monthlyLabels = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', 
  '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
];
const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Legend({ items, onToggle }) {
  return (
    <Stack
      direction="row"
      sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}
    >
      {items.map((item) => (
        <Stack
          key={item.label}
          direction="row"
          sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
          onClick={() => onToggle(item.label)}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              bgcolor: item.visible ? item.color : 'grey.500',
              borderRadius: '50%'
            }}
          />
          <Typography variant="body2" color="text.primary">
            {item.label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ view, data }) {
  const theme = useTheme();

  // Toggle visibility of series (if you want multiple datasets)
  const [visibility, setVisibility] = useState({
    'Unique Visitors': true
  });

  // Decide labels based on view
  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;

  // Ensure data length matches labels length by slicing or padding with zeros
  const expectedLength = labels.length;
  const adjustedData =
    data.length === expectedLength
      ? data
      : data.length > expectedLength
      ? data.slice(0, expectedLength)
      : [...data, ...new Array(expectedLength - data.length).fill(0)];

  // Prepare series data using the adjusted data array
  const visibleSeries = [
    {
      data: adjustedData, // adjusted to match labels length
      label: 'Unique Visitors',
      showMark: false,
      area: true,
      id: 'uniqueVisitors',
      color: theme.palette.primary.main || '',
      visible: visibility['Unique Visitors']
    }
  ];

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const toggleVisibility = (label) => {
    setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <>
      <LineChart
        grid={{ horizontal: true }}
        xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFontStyle }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFontStyle }]}
        height={450}
        margin={{ top: 40, bottom: 20, right: 20 }}
        series={visibleSeries
          .filter((series) => series.visible)
          .map((series) => ({
            type: 'line',
            data: series.data,
            label: series.label,
            showMark: series.showMark,
            area: series.area,
            id: series.id,
            color: series.color,
            stroke: series.color,
            strokeWidth: 2
          }))}
        slotProps={{ legend: { hidden: true } }}
        sx={{
          '& .MuiAreaElement-series-uniqueVisitors': { fill: "url('#myGradient1')", strokeWidth: 2, opacity: 0.8 },
          '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: theme.palette.divider }
        }}
      >
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(90)">
            <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
            <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
          </linearGradient>
        </defs>
      </LineChart>

      <Legend items={visibleSeries} onToggle={toggleVisibility} />
    </>
  );
}

Legend.propTypes = {
  items: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired
};

IncomeAreaChart.propTypes = {
  view: PropTypes.oneOf(['monthly', 'weekly']).isRequired,
  data: PropTypes.arrayOf(PropTypes.number).isRequired
};
