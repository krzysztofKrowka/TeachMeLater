import React, { useRef, useState } from 'react';
import './App.css';
import { Input } from './Input';
import { Quiz, Quizes } from './Quizes';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Modal, Typography } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  const [q] = useState(new Quizes())
  const [qnr,setQnr] = useState(0)
  const pText:any = useRef(null)

  const addQuiz = (date:Date,type:string,subject:string,time:number,command:string,createDate:Date) =>{
    q.quizes.push(new Quiz(date,type,subject,time,command,createDate))
    setQnr(qnr+1)
  }

  const deleteQuiz = (date:Date,type:string,subject:string) =>{
    const index = q.quizes.findIndex(quiz => quiz.date.getDate() == date.getDate() && quiz.date.getMonth() == date.getMonth() && quiz.type == type && quiz.subject == subject);
    if (index > -1) {
     q.quizes.splice(index, 1);
     setQnr(qnr-1)
    }
    else{
      alert("Nie ma testu z takimi danymi")
    }
  }

  const [open, setOpen] = React.useState(false);
  const [modalDate, setModalDate] = React.useState("");
  const [modalInfo, setModalInfo] = React.useState("");

  const handleOpen = (date:Date) => {
    var t = new Date();
    var m = t.getMonth();
    var d = t.getDate();
    var y = t.getFullYear();
    const today = new Date(y,m,d)
    const tomorrow =  new Date(y,m,d+1)
    const dATomorrow =  new Date(y,m,d+2);
    
    if (today.getFullYear() == date.getFullYear() && today.getMonth() == date.getMonth() && today.getDate() == date.getDate())
      setModalDate("dziś")
    else if (tomorrow.getFullYear() == date.getFullYear() && tomorrow.getMonth() == date.getMonth() && tomorrow.getDate() == date.getDate())
      setModalDate("jutro")
    else if (dATomorrow.getFullYear() == date.getFullYear() && dATomorrow.getMonth() == date.getMonth() && dATomorrow.getDate() == date.getDate())
      setModalDate("pojutrze")
    else
    setModalDate(date.getDate() +" "+date.toLocaleString('default', { month: 'long' }))
    let info = "";
    q.quizes.forEach(quiz =>{ 
      if(quiz.date >= date){
        const daysForLearning = Date.parse(quiz.date.toDateString()) - Date.parse(quiz.createDate.toDateString());
        const tempDate = new Date(daysForLearning)
        const godziny = Math.round(quiz.time/tempDate.getDate()*100)/100
        const minuty = Math.round((godziny - Math.floor(godziny)) *60)
        info += quiz.type+" z "+quiz.subject+": "+Math.round(godziny)+' godzin(y) i '+minuty+' minut(y)\n';
      }
    })
    setModalInfo(info)
    setOpen(true)
  };
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
    <div className="App">
      <div style={{height:'70px',color:"#cccccc",marginTop:0}}>
      <h3 style={{fontSize:"32px",padding:35  }}>TeachMeLater</h3>
      </div>
      <Input 
        addQuiz={ (date:Date,type:string,subject:string,time:number,command:string,createDate:Date) => addQuiz(date,type,subject,time,command,createDate)} 
        deleteQuiz={(date:Date,type:string,subject:string) =>deleteQuiz(date,type,subject)}
        getTime={(date:Date)=>handleOpen(date)}
        ></Input>
        <p>{"Należy podać informację jakie działanie wykonujemy (Dodaj, Usuń, Plan) i datę, a w przypadku usuwania i dodawania przedmiot, typ sprawdzianu i czas na naukę"}</p>
        {qnr > 0 && 
          q.printTable()
        }
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Plan na {modalDate}
          </Typography>
          <Typography id="modal-modal-description" style={{textAlign:'left'}} sx={{ mt: 2 }}>
            {modalInfo.split("\n").map(info => <div>
              {info}<br />
            </div>)}
          </Typography>
        </Box>
      </Modal>
    </div>
    </ThemeProvider>
  );
}

export default App;
