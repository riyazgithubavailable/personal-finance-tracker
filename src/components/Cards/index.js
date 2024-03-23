import React from "react";
import "./style.css";
import {  Card, Row } from "antd";
import Button from "../Button";
const Cards = ({income, expense, currentBalance, showExpenseModal,showIncomeModal,resetBalance}) =>{

    return(
        <div>
         <Row className="row">

         <Card bordered={true} className="my-card">
        <h2>Current Balance</h2>
        <p className='amount'>₹{currentBalance}</p>
        <Button text=" Reset Balance" blue={true} onClick={resetBalance}/> 
           </Card>

        <Card bordered={true} className="my-card">
        <h2>Total Income</h2>
        <p className='amount'>₹{income}</p>
        <Button text="Add Income" blue={true} onClick={showIncomeModal}/> 
        </Card>

        <Card bordered={true} className="my-card">
        <h2>Total Expenses</h2>
        <p className='amount'>₹{expense}</p>
        <Button text= "Add Expense" blue={true} onClick={showExpenseModal}/>
        </Card>

        </Row>
        </div>
    )
}
export default Cards;