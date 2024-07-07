import React, { useState, useEffect } from "react";



const SvgBody = ({selectLabel, width, height, data}) => {

  const [selectMeasurement, setSelectMeasurement] = useState({
    Neck: 0,
    Chest: 0,
    Abdomen: 0,
    'L-Bicep': 0,
    'L-Upper Thigh': 0,
    'L-Thigh': 0,
    'L-Calf': 0,
    Shoulder: 0,
    Waist: 0,
    Hip: 0,
    'R-Bicep': 0,
    'R-Upper Thigh': 0,
    'R-Thigh': 0,
    'R-Calf': 0,
  })
  
  const getPathHeight = (d) => {
    // Regular expression to match commands and their arguments
    const commandRegex = /[a-zA-Z][^a-zA-Z]*/g;
    
    // Initialize variables to track min and max y-coordinates
    let minY = Infinity;
    let maxY = -Infinity;
  
    // Extract commands and iterate through each
    const commands = d.match(commandRegex) || []; // Ensure commands array exists
  
    commands.forEach(command => {
      const parts = command.trim().split(/[ ,]/).map(parseFloat); // Split command into parts
      const commandType = parts[0];
  
      switch (commandType) {
        case 'M':
        case 'L':
          for (let i = 1; i < parts.length; i++) {
            const y = parts[i];
            if (!isNaN(y)) { // Check if y is a valid number
              minY = Math.min(minY, y);
              maxY = Math.max(maxY, y);
            }
          }
          break;
        default:
          break;
      }
    });
  
    // Calculate height from min and max y-coordinates
    const height = maxY - minY;
  
    // Handle edge case where height calculation results in Infinity or NaN
    if (!isFinite(height) || isNaN(height)) {
      return 0; // Return 0 if height cannot be determined
    }
  
    return height;
  };
  
  const svgPath = "m97.75 59.44 1.082 3.372.064 4.773s.676 1.4-1.667 3.119c0 0-4.76 2.863-7.434 2.29 0 0-2.672-.17-13.555 3.628 0 0-5.473 1.02-14.573.573-.573-.448-7.764-1.655-12.283-.827 0 0-13.173 1.654-15.655 1.845 0 0-5.028-.552-8.91.827L8.235 80.46l.585 1.845 8.955.63.36 1.53 7.245.045 3.24-1.665 21.285 2.52s6.075.945 9.945.135c0 0 10.215-.135 14.85 1.08s5.85 1.935 8.1 4.275 4.185 2.385 5.535 9.18c0 0 .993 8.892-.003 16.17l-.847 6.191-1.19 8.065c-.637 4.322-1.909 11.328 0 28.383 0 0 2.613 19.22 2.613 24.056s-3.115 16.547 0 33.73 2.097 21.128 2.097 21.128-2.419 7.89-4.2 8.273c-1.782.382 5.6 2.927 9.036.763l.549-7.484s.315-.72.18-4.05-.495-9.63.99-18.135c0 0 2.25-9.99 1.08-19.26 0 0-.81-1.755 1.26-10.8 0 0 .945-4.86.99-10.62 0 0-.36-5.4 1.575-16.47s1.485-12.15 1.485-12.15.315 6.255 2.205 16.785c0 0 1.035 9.27 1.215 13.86s.765 8.325 1.08 10.215 1.125 3.465 1.17 11.925-.765 3.96 1.17 17.325.045 19.035.135 20.475.945 1.665 1.26 8.19c0 0 8.603 2.04 9.558-1.715 0 0-3.819-2.864-4.646-6.937 0 0-.007-8.718 1.145-13.937 1.153-5.218 2.546-24.119 1.464-28.892s-.254-16.8-.19-19.155c.063-2.355 3.181-25.871 3.181-28.146 0-2.274-.509-14.811-1.782-20.03 0 0-5.265-24.378 2.745-35.178 0 0 1.53-5.04 12.87-6.21 0 0 10.35-1.62 16.2 0 0 0 1.98.09 4.68-.99 0 0 .9.27 21.15-2.97l4.77 1.71 6.39-.81 1.89-1.08 8.1-.36.81-.99-.45-.49-14.76-1.94s-7.65-.36-9.99-.54-25.65-2.88-29.07-.9-23.775-2.79-24.3-3.78-6.39-.72-7.65-.9-3.51-1.62-4.14-3.24l.135-6.435 1.125-3.285.63-6.39s1.736-10.053-7.65-11.199c0 0-6.713-.063-7.604 7.7 0 0-.51 1.655.954 9.928z"
  const svgHeight = getPathHeight(svgPath)
  const bodyHeightInCm = 163;
  const scaleFactor = 288.43 / bodyHeightInCm;
  const pi = Math.PI;

  useEffect(() => {
    // Update selectMeasurement state based on data prop
    if (data) {
      const updatedMeasurements = {
        Neck: data.neck_cm|| data.Neck || 11.244,
        Chest: data.chest_cm || data.Chest,
        Abdomen: data.abdomen_cm || data.Abdomen,
        'L-Bicep': data.l_bicep_cm || data['L-Bicep'] || 8.403,
        'L-Upper Thigh': data.l_upper_thigh_cm || data['L-Upper Thigh'] || data['L-Upper Thigh'],
        'L-Thigh': data.l_thigh_cm || data['L-Thigh'] || data['L-Thigh'],
        'L-Calf': data.l_calf_cm || data['L-Calf'] || data['L-Calf'],
        Shoulder: data.shoulder_cm || data.Shoulder,
        Waist: data.waist_cm || data.Waist || 30.259,
        Hip: data.hip_cm || data.Hip,
        'R-Bicep': data.r_bicep_cm || data['R-Bicep'] || 8.403,
        'R-Upper Thigh': data.r_upper_thigh_cm || data['R-Upper Thigh'] || data['R-Upper Thigh'],
        'R-Thigh': data.r_thigh_cm || data['R-Thigh'] || data['R-Thigh'],
        'R-Calf': data.r_calf_cm || data['R-Calf'] || data['R-Calf'],
      };
      setSelectMeasurement(updatedMeasurements);
    }
    console.log('selectMeasurement: ',selectMeasurement)
    console.log('data: ',scaleFactor)
  }, [data]);



  const pomPaths = [
    { id: "Neck", d: "M 98.864133,65.19878 H 110.2651" },
    { id: "R-Bicep", d: "m 68.283213,77.283669 v 8.402942" },
    { id: "L-Bicep", d: "m 136.30775,76.840132 v 9.583427" },
    { id: "Shoulder", d: "M 86.935206,73.619391 121.95,73.259999" },
    { id: "Chest", d: "M 86.935206,95.426031 H 122.17135" },
    { id: "Waist", d: "M 88.664824,112.70892 H 119.1754" },
    { id: "Hip", d: "M 85.287365,143.31035 H 122.63662" },
    // TODO: consider positioning the Abdomen higher than current position
    { id: "Abdomen", d: "M 85.287365,137.69726 H 122.26244" },
    { id: "R-Thigh", d: "M 88.109191,173.41136 H 100.93434" },
    { id: "L-Thigh", d: "m 107.01472,173.27907 h 12.72203" },
    { id: "R-Calf", d: "M 98.954311,205.21752 H 87.463952" },
    { id: "L-Calf", d: "M 119.98931,205.8675 h -10.4489" },
    { id: "R-Upper Thigh", d: "M 103.83969,150.94479 H 85.460416" },
    { id: "L-Upper Thigh", d: "M 122.42133,150.94479 H 104.1554" }
  ];

  // const pomRefLine = [
  //   {id:"midline",  d: "m 103.394, 30  v 250"},
  //   // Relative to user measurements
  //   {id:"rlowerlegline", d:"M88.324 193.198  v50 "},
  //   {id:"llowerlegline", d:"M88.324 193.198 v50 "},
  //   {id:"lupperlegline", d:"M86.141 148.957 v50 "},
  //   {id:"rupperlegline", d:"M86.141 148.957 v50 "},
  //   // Fixed measurements
  //   {id:"shoulderline", d:"M85.37 72.862 h36.607"},
  //   {id:"chestline", d:"M85.567 95.294 h36.765"},
  //   {id:"waistline", d:"M85.483 112.577 h18.335"},
  //   {id:"hipline", d:"M88.352 143.777 h12.632"},
  //   {id:"abdomenline", d:"M87.6 137.565 h11.217"},
  //   {id:"upperthighline", d:"M109.156 137.565 h11.217"},
  //   {id:"innerkneeline", d:"M107.06 195.211 h12.632"},
  //   {id:"outerkneeline", d:"M104.086 182.768 h18.335"},
  //   {id:"calvesline", d:"M104.086 205.217 h18.335"}
  // ]
  // const pomRefPoints = [
  //   {id:"Bicep", d:"M64.161 77.284 h7.607 v8.403 h-7.607z"},
  //   {id:"L-Bicep", d:"M132.504 77.43 h7.607 v8.403 h-7.607z"},
  //   {id:"Neck", d:"M98.86 62.84 h11.244 v8.347 H98.86z"},
  //   {id:"Shoulder", d:"M86.141 73.143 h35.558 v8.105 H86.141z"},
  //   {id:"Chest", d:"M88.324 92.164 h32.459 v8.13 H88.324z"},
  //   {id:"Waist", d:"M88.656 108.635 h30.259 v8.148 H88.656z"},
  //   {id:"Abdomen", d:"M85.37 133.649 h36.607 v8.097 H85.37z"},
  //   {id:"Hip", d:"M85.567 139.729 h36.765 v8.096 H85.567z"},
  //   {id:"R-Upper Thigh", d:"M85.483 148.956 h18.335v5.418 H85.483z"},
  //   {id:"R-Thigh", d:"M88.352 172.307 h12.632v2.209 H88.352z"},
  //   {id:"R-Calf", d:"M87.6 203.104 h11.217v4.226 H87.6z"},
  //   {id:"L-Calf", d:"M109.156 203.754 h11.217v4.226 h-11.217z"},
  //   {id:"L-Thigh", d:"M107.06 172.175 h12.632v2.209 H107.06z"},
  //   {id:"L-Upper Thigh", d:"M104.086 148.765 h18.335 v5.418 h-18.335z"}
  // ]

  // const pomRectangles = [
  //   {id:"Bicep", d:`M64.161 77.284 h7.607 v8.403 h-7.607z`},
  //   {id:"L-Bicep", d:`M132.504 77.43 h7.607 v8.403 h-7.607z`},
  //   {id:"Neck", d:`M98.86 62.84 h11.244 v8.347 H98.86z`},
  //   {id:"Shoulder", d:`M86.141 73.143 h35.558 v8.105 H86.141z`},
  //   {id:"Chest", d:`M88.324 92.164 h32.459 v8.13 H88.324z`},
  //   {id:"Waist", d:`M88.656 108.635 h30.259 v8.148 H88.656z`},
  //   {id:"Abdomen", d:`M85.37 133.649 h36.607 v8.097 H85.37z`},
  //   {id:"Hip", d:`M85.567 139.729 h36.765 v8.096 H85.567z`},
  //   {id:"R-Upper Thigh", d:`M85.483 148.956 h18.335v5.418 H85.483z`},
  //   {id:"R-Thigh", d:`M88.352 172.307 h12.632v2.209 H88.352z`},
  //   {id:"R-Calf", d:`M87.6 203.104 h11.217v4.226 H87.6z`},
  //   {id:"L-Calf", d:`M109.156 203.754 h11.217v4.226 h-11.217z`},
  //   {id:"L-Thigh", d:`M107.06 172.175 h12.632v2.209 H107.06z`},
  //   {id:"L-Upper Thigh", d:`M104.086 148.765 h18.335 v5.418 h-18.335z`}
  // ]
  const pomRectangles = [
    {id:"R-Bicep", d:`M64.161 77.284 h7.607 v${scaleFactor*selectMeasurement['R-Bicep']/pi} h-7.607z`},
    {id:"L-Bicep", d:`M132.504 77.43 h7.607 v${scaleFactor*selectMeasurement['L-Bicep']/pi} h-7.607z`},
    {id:"Neck", d:`M98.86 62.84 h${scaleFactor*selectMeasurement['Neck']/pi} v8.347 H98.86z`},
    {id:"Shoulder", d:`M86.141 73.143 h35.558 v8.105 H86.141z`},
    {id:"Chest", d:`M88.324 92.164 h32.459 v8.13 H88.324z`},
    {id:"Waist", d:`M88.656 108.635 h${scaleFactor*selectMeasurement['Waist']/pi} v8.148 H88.656z`},
    {id:"Abdomen", d:`M85.37 133.649 h36.607 v8.097 H85.37z`},
    {id:"Hip", d:`M85.567 139.729 h36.765 v8.096 H85.567z`},
    {id:"R-Upper Thigh", d:`M85.483 148.956 h18.335v5.418 H85.483z`},
    {id:"R-Thigh", d:`M88.352 172.307 h12.632v2.209 H88.352z`},
    {id:"R-Calf", d:`M87.6 203.104 h11.217v4.226 H87.6z`},
    {id:"L-Calf", d:`M109.156 203.754 h11.217v4.226 h-11.217z`},
    {id:"L-Thigh", d:`M107.06 172.175 h12.632v2.209 H107.06z`},
    {id:"L-Upper Thigh", d:`M104.086 148.765 h18.335 v5.418 h-18.335z`}
  ]

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      // viewBox="0 0 200 250 "
      viewBox="0 0 200 250 "
      width="100%"
      height="100%"
      style={{ width:width, height:height }}
     
    >
    {/* TODO: Check if selected label is correct */}
    {/* <text x="10" y="20">{props.selectLabel}</text> */}
    <g style={{ fill: "none" }}>
        {pomPaths.map((path, index) => (
          <path
            key={index}
            d={path.d}
            style={{
              stroke: selectLabel === path.id ? "#ff0000" : "none",
              strokeWidth: "1px",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeOpacity: 1
            }}
          />
        ))}
      </g>
      <g>
        {pomRectangles.map((rectangle, index) => (
          <g key={rectangle.id}>
          <path
            key={index}
            d={rectangle.d}
            style={{
              stroke:"#0a70ff25",
              fill:"#0a70ff25",
              strokeWidth: "1px",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeOpacity: 1
            }}
          />
          </g>
        ))}
      </g>
      {/* <g>
        {pomRefLine.map((line, index) => (
          <g name={line.id}>
          <path
            key={index}
            d={line.d}
            style={{
              stroke:"#ea00ff",
              strokeWidth: "1px",
              strokeLinecap: "butt",
              strokeLinejoin: "miter",
              strokeOpacity: 1
            }}
          />
          </g>
        ))}
      </g> */}
      <g
        style={{
          display: "inline",
          opacity: 0.259,
        }}
      >
        <path
          d="m97.75 59.44 1.082 3.372.064 4.773s.676 1.4-1.667 3.119c0 0-4.76 2.863-7.434 2.29 0 0-2.672-.17-13.555 3.628 0 0-5.473 1.02-14.573.573-.573-.448-7.764-1.655-12.283-.827 0 0-13.173 1.654-15.655 1.845 0 0-5.028-.552-8.91.827L8.235 80.46l.585 1.845 8.955.63.36 1.53 7.245.045 3.24-1.665 21.285 2.52s6.075.945 9.945.135c0 0 10.215-.135 14.85 1.08s5.85 1.935 8.1 4.275 4.185 2.385 5.535 9.18c0 0 .993 8.892-.003 16.17l-.847 6.191-1.19 8.065c-.637 4.322-1.909 11.328 0 28.383 0 0 2.613 19.22 2.613 24.056s-3.115 16.547 0 33.73 2.097 21.128 2.097 21.128-2.419 7.89-4.2 8.273c-1.782.382 5.6 2.927 9.036.763l.549-7.484s.315-.72.18-4.05-.495-9.63.99-18.135c0 0 2.25-9.99 1.08-19.26 0 0-.81-1.755 1.26-10.8 0 0 .945-4.86.99-10.62 0 0-.36-5.4 1.575-16.47s1.485-12.15 1.485-12.15.315 6.255 2.205 16.785c0 0 1.035 9.27 1.215 13.86s.765 8.325 1.08 10.215 1.125 3.465 1.17 11.925-.765 3.96 1.17 17.325.045 19.035.135 20.475.945 1.665 1.26 8.19c0 0 8.603 2.04 9.558-1.715 0 0-3.819-2.864-4.646-6.937 0 0-.007-8.718 1.145-13.937 1.153-5.218 2.546-24.119 1.464-28.892s-.254-16.8-.19-19.155c.063-2.355 3.181-25.871 3.181-28.146 0-2.274-.509-14.811-1.782-20.03 0 0-5.265-24.378 2.745-35.178 0 0 1.53-5.04 12.87-6.21 0 0 10.35-1.62 16.2 0 0 0 1.98.09 4.68-.99 0 0 .9.27 21.15-2.97l4.77 1.71 6.39-.81 1.89-1.08 8.1-.36.81-.99-.45-.49-14.76-1.94s-7.65-.36-9.99-.54-25.65-2.88-29.07-.9-23.775-2.79-24.3-3.78-6.39-.72-7.65-.9-3.51-1.62-4.14-3.24l.135-6.435 1.125-3.285.63-6.39s1.736-10.053-7.65-11.199c0 0-6.713-.063-7.604 7.7 0 0-.51 1.655.954 9.928z"
          style={{
            fill: "#93a6ac",
            fillOpacity: 1,
            stroke: "#00125a",
            strokeWidth: ".264583px",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1,
          }}
        />
        <path
          d="M101.583 147.825h4.513"
          style={{
            fill: "none",
            stroke: "#0a1d60",
            strokeWidth: ".264583px",
            strokeLinecap: "butt",
            strokeLinejoin: "miter",
            strokeOpacity: 1,
          }}
        />
      </g>


 
  </svg>
      


  )

};
export default SvgBody;
