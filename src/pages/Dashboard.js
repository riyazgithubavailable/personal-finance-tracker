import React,{useEffect, useState} from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { Modal } from "antd";
import AddIncomeModal from "../components/Modals/AddIncome";
import AddExpenseModal from "../components/Modals/AddExpense";
//moment give us the package of global time 
import moment from "moment";
import { addDoc, collection, deleteDoc, getDoc, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionsTable";
import ChartComponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

function Dashboard() {
  
   
   const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false)
   const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false)
   const [transactions,setTransactions] = useState([]);
   const [loading, setLoading] = useState(false);
   const [income, setIncome] = useState(0);
   const [expense, setExpense] = useState(0);
   const [currentBalance, setCurrentBalance] = useState(0);

   const [user] = useAuthState(auth)
   
   const showExpenseModal = () =>{
    setIsExpenseModalVisible(true);
   }
   const showIncomeModal = () =>{
    setIsIncomeModalVisible(true);
   }
   const handleExpenseCancel = () =>{
    setIsExpenseModalVisible(false);
   }
   const handleIncomeCancel = ()=>{
    setIsIncomeModalVisible(false);
   }
    
   function onFinish(values,type) {
     const newTransaction = {
      type:type,
      date:values.date.format("YYYY-MM-DD"),
      amount:parseFloat(values.amount),
      tag:values.tag,
      name:values.name,
     };
    
    addTransaction(newTransaction);
     
   };
   async function addTransaction(transaction,many) {
    //this function add transaction to doc
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      //bcs not show many toast t.e. use beloe expression
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }
  
    useEffect(()=>{
      //Get all docs from a collection
          fetchTransactions()
    },[user])
    async function fetchTransactions() {
      setLoading(true);
      if (user) {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        let transactionsArray = [];
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          transactionsArray.push(doc.data());
        });
        setTransactions(transactionsArray);
        toast.success("Transactions Fetched!");
      }
      setLoading(false);
    }
    useEffect(()=>{
      calculateBalance()
    },[transactions]);
    function calculateBalance() {
       let incomeTotal = 0;
       let expenseTotal = 0;
       transactions.forEach((transaction)=>{
        if(transaction.type==="income"){
          incomeTotal+=transaction.amount;
        }else{
          expenseTotal+=transaction.amount;
        }
       });
       setIncome(incomeTotal);
       setExpense(expenseTotal);
       setCurrentBalance(incomeTotal-expenseTotal);
    }
    let sortedTransactions = transactions.sort((a,b)=>{
      return new Date(a.date)-new Date(b.date);
    });
    const resetBalance = async () => {
      // Delete all transactions from Firestore collection
      try {
        const q = query(collection(db, `users/${user.uid}/transactions`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        // Update state to reflect the changes
        setTransactions([]);
        setIncome(0);
        setExpense(0);
        setCurrentBalance(0);
        toast.success("All transactions are deleted and balance reset.");
      } catch (error) {
        console.error("Error deleting transactions:", error);
        toast.error("Failed to reset balance.");
      }
    };
   return(
    <div className="dashboard">
      <Header />
      {loading ?(<p>Loading...</p>):(<>
        <Cards
        income={income} 
        expense={expense}
        currentBalance={currentBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        resetBalance={resetBalance}
      />
      {transactions && transactions.length!=0?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}
      {/* import from antd */}
      <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
      </>)
      
      }
     </div>
   ) 
}
export default Dashboard;