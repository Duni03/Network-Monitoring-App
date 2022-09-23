import {
  LineChart,
  Line,
} from "recharts";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

import React, { useState, useEffect } from "react";

const Chart = (props) => {

  const [data1, setdata1] = useState(props.dat);

  useEffect(() => {
    setdata1(props.dat);
  }, [props.dat]);


  return (
    <>
    <ResponsiveContainer width={'99%'} height={300} >
        <BarChart
          width={500}
          height={300}
          data={data1}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="p" stackId="a" fill="#ebb105" >
            <LabelList dataKey="p" position="top" />
          </Bar>

        </BarChart>
      </ResponsiveContainer>
      </>
  );
};

export default Chart;
