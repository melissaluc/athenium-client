import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/system';

function FfmiRangeChart({ userValue, gender }) {
  const chartRef = useRef(null);
  const theme = useTheme();

  // Define FFMI ranges based on gender
  const ffmiRanges = gender === 'male'
    ? {
        'Low': { min: 0, max: 18, color: '#9c2929' },
        'Average': { min: 18, max: 22, color: '#e2bb50'  },
        'Above Average': { min: 22, max: 25, color: '#07df00'},
        'High': { min: 25, max: 30, color: '#00edf5' },
        'Very High': { min: 30, max: 35, color: '#1b1386' },
        'Exceptional': { min: 35, max: 50, color: '#a00078'  }
      }
    : {
        'Low': { min: 0, max: 16, color: '#9c2929' },
        'Average': { min: 16, max: 20, color: '#e2bb50'  },
        'Above Average': { min: 20, max: 23, color: '#07df00'},
        'High': { min: 23, max: 28, color: '#00edf5' },
        'Very High': { min: 28, max: 33, color: '#1b1386' },
        'Exceptional': { min: 33, max: 50, color: '#a00078'  }
      };

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;
    const myChart = echarts.init(chartDom, null, {
      // width: 400,
      // height: 100
    });

    const option = {
      animation: false,
      tooltip: null,
      xAxis: {
        type: 'value',
        name: 'FFMI',
        min: 0,
        max: 50,
        splitLine: { show: false },
        axisLabel: { show: false }
      },
      yAxis: {
        type: 'category',
        data: ['FFMI Categories'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { show: false }
      },
      series: [
        {
          type: 'line',
          data: [
            [0, 0],
            [Object.values(ffmiRanges)[0].max, 0],
            [Object.values(ffmiRanges)[1].max, 0],
            [Object.values(ffmiRanges)[2].max, 0],
            [Object.values(ffmiRanges)[3].max, 0],
            [Object.values(ffmiRanges)[4].max, 0],
            [Object.values(ffmiRanges)[5].max, 0]
          ],
          lineStyle: { width: 0 },
          symbol: 'none',
          markPoint: {
            data: [
              ...Object.entries(ffmiRanges).map(([category, { min, max }]) => [
                { coord: [min, 0], name: min.toString(), itemStyle: { color: '#333' }, symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } },
                { coord: [max, 0], name: max.toString(), itemStyle: { color: '#333' }, symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } }
              ]).flat(),
              { coord: [userValue, 0], name: `${userValue}`, itemStyle: { color: theme.palette.primary.main }, symbolSize: 10, symbol: 'triangle', symbolRotate: 180, symbolOffset: [0, -20], label: { show: true, position: 'top', offset: [0, 0] } }
            ],
            label: { color: '#333', formatter: '{b}' }
          },
          markArea: {
            data: Object.entries(ffmiRanges).map(([category, { min, max, color }]) => [
              { xAxis: min, itemStyle: { color } },
              { xAxis: max }
            ])
          }
        }
      ]
    };

    // Set the chart options
    myChart.setOption(option);

    // Resize chart on window resize
    const handleResize = () => myChart.resize();
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      myChart.dispose();
    };
  }, [userValue]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      width="100%"
    >
      <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
    </Box>

  );
}

export default FfmiRangeChart;
