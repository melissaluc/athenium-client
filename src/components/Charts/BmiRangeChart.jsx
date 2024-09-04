import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Corrected import for useTheme

function BmiRangeChart({ userValue }) {
  const chartRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom) return;
    const myChart = echarts.init(chartDom, null, {
      // width: 400,
      // height: 100
    });


    // Define chart options
    const option = {
      animation: false, // Disable animation
      tooltip: null, // Disable tooltip
      xAxis: {
        type: 'value',
        name: '',
        min: 0,
        max: 50,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false // Hide x-axis labels
        }
      },
      yAxis: {
        type: 'category',
        data: ['BMI Categories'],
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        }
      },
      series: [
        {
          type: 'line',
          data: [
            [0, 0],
            [18.5, 0],
            [24.9, 0],
            [29.9, 0],
            [34.9, 0],
            [39.9, 0],
            [50, 0]
          ],
          lineStyle: {
            width: 0 // Thickness of the line
          },
          label: {
            show: false // Hide default labels on the line
          },
          symbol: 'none',
          markPoint: {
            data: [
              { coord: [18.5, 0], name: '18.5', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } },
              { coord: [24.9, 0], name: '25', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } },
              { coord: [29.9, 0], name: '30', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } },
              { coord: [34.9, 0], name: '35', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 15] } },
              { coord: [39.9, 0], name: '40=<', symbolSize: 0, label: { show: true, position: 'bottom', offset: [8, 15] } },
              { coord: [userValue, 0], name: `${userValue}`, itemStyle: { color: theme.palette.primary.main }, symbolSize: 10, symbol: 'triangle', symbolRotate: 180, symbolOffset: [0, -20], label: { show: true, position: 'top', offset: [0, 0] } },
            ],
            label: {
              color: '#333',
              formatter: '{b}'
            }
          },
          markArea: {
            data: [
              [
                { xAxis: 0, itemStyle: { color: '#67aed4' } },
                { xAxis: 18.5 }
              ],
              [
                { xAxis: 18.5, itemStyle: { color: '#6ed161' } },
                { xAxis: 25 }
              ],
              [
                { xAxis: 25, itemStyle: { color: '#f3d266' } },
                { xAxis: 30 }
              ],
              [
                { xAxis: 30, itemStyle: { color: '#f17868' } },
                { xAxis: 35 }
              ],
              [
                { xAxis: 35, itemStyle: { color: '#e25050' } },
                { xAxis: 40 }
              ],
              [
                { xAxis: 40, itemStyle: { color: '#9c2929' } },
                { xAxis: 50 }
              ]
            ]
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
    <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
      <div ref={chartRef} style={{ height: '100%', width: '100%' }} />
    </Box>
  );
}

export default BmiRangeChart;
