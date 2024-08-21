import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/system';


function BmiRangeChart ({userValue}) {
  const chartRef = useRef(null);
  const theme = useTheme()
  useEffect(() => {
    const chartDom = chartRef.current;
    const myChart = echarts.init(chartDom, null, {
        width: 400,
        height: 100
      });

    const option = {
        height:'20%',
        width:'80%',
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
              { coord: [18.5, 0], name: '18.5', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 10] } },
              { coord: [24.9, 0], name: '25', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 10] } },
              { coord: [29.9, 0], name: '30', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 10] } },
              { coord: [34.9, 0], name: '35', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0,10] } },
              { coord: [39.9, 0], name: '40=<', symbolSize: 0, label: { show: true, position: 'bottom', offset: [0, 10] } },
              { coord: [userValue, 0], name: `${userValue}`, itemStyle: { color: theme.palette.primary.main }, symbolSize: 10, symbol:'triangle',symbolRotate: 180,symbolRotate: 180,symbolOffset: [0, -20], label: { show: true, position: 'top', offset: [0, 0] } },
            ],
            label: {
              color: '#333',
              formatter: '{b}'
            }
          },
          markArea: {
            data: [
              [
                {
                //   name: 'Underweight',
                  xAxis: 0,
                  itemStyle: {
                    color: '#67aed4' // Color for Underweight
                  }
                },
                {
                  xAxis: 18.5
                }
              ],
              [
                {
                //   name: 'Normal Weight',
                  xAxis: 18.5,
                  itemStyle: {
                    color: '#6ed161' // Color for Normal Weight
                  }
                },
                {
                  xAxis: 25
                }
              ],
              [
                {
                //   name: 'Overweight',
                  xAxis: 25,
                  itemStyle: {
                    color: '#f3d266' // Color for Overweight
                  }
                },
                {
                  xAxis: 30
                }
              ],
              [
                {
                //   name: 'Obesity Class I',
                  xAxis: 30,
                  itemStyle: {
                    color: '#f17868' // Color for Obesity Class I
                  }
                },
                {
                  xAxis: 35
                }
              ],
              [
                {
                //   name: 'Obesity Class II',
                  xAxis: 35,
                  itemStyle: {
                    color: '#e25050' // Color for Obesity Class II
                  }
                },
                {
                  xAxis: 40
                }
              ],
              [
                {
                //   name: 'Obesity Class III',
                  xAxis: 40,
                  itemStyle: {
                    color: '#9c2929' // Color for Obesity Class III
                  }
                },
                {
                  xAxis: 50
                }
              ]
            ]
          }
        }
      ]
    };

    myChart.setOption(option);
  }, []);

  return (    
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    height="100%" 
    width="100%"
  >
    <div ref={chartRef} style={{ height: '150px', width: '100%' }} />
  </Box>)
};

export default BmiRangeChart;
