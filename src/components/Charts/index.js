import React from "react";
import { Line, Pie } from '@ant-design/charts';
import "./style.css"
const ChartComponent = ({sortedTransactions}) =>{
    // const data = [
    //     { year: '1991', value: 3 },
    //     { year: '1992', value: 4 },
    //     { year: '1993', value: 3.5 },
    //     { year: '1994', value: 5 },
    //     { year: '1995', value: 4.9 },
    //     { year: '1996', value: 6 },
    //     { year: '1997', value: 7 },
    //     { year: '1998', value: 9 },
    //     { year: '1999', value: 13 },
    //   ];
    const data = sortedTransactions.map((item)=>{
        return {date:item.date,amount:item.amount}
    })
     const spendingData = sortedTransactions.filter((transaction)=>{
        if(transaction.type=="expense"){
            return{tag:transaction.tag,amount:transaction.amount}
        }
     });
       
     let newSpending = [
        {tag:"food",amount:0},
        {tag:"education",amount:0},
        {tag:"office",amount:0},
        {tag:"others",amount:0}
     ];
     spendingData.forEach((item)=>{
        if(item.tag=="food"){
            newSpending[0].amount += item.amount;
        }else if (item.tag == "education"){
            newSpending[1].amount +=item.amount;
        }else if(item.tag=="others") {
            newSpending[2].amount +=item.amount;
        }else{
            newSpending[3].amount +=item.amount;
        }
     });
      const config = {
        data,
        width:500,
        autoFit:true,
        xField: 'date',
        yField: 'amount',
      };
      const spendingConfig = {
        newSpending,
        width:350,
        //how much space is taken 
        angleField:"amount",
        //differentiat the parts that's  why use color
        colorField:"tag",
      };
    return(
        <div className="charts-wrapper">
        <div className="chart-container">
            <h2>Your Analytics</h2>
            <div className="line-chart">
           <Line {...config} />
           </div>
           </div>
           <div className="pie-chart">
            <h2>Your Spendings</h2>
            <div className="pie">
            {newSpending.length == 0 ? (
                    <p>Seems like you haven't spent anything till now...</p>
                  ) : (
                    <Pie {...{ ...spendingConfig, data: newSpending }} />
                  )}
                 </div> 
              </div>
             </div>
    )
}
export default ChartComponent; 