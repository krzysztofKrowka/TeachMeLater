import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import React from "react"
export class Quiz{
    date:Date
    type:string
    subject:string
    time:number
    command:string
    createDate:Date
    constructor(date:Date,type:string,subject:string,time:number,command:string,createDate:Date){
        this.date = date
        this.type = type
        this.subject = subject
        this.time = time
        this.command = command
        this.createDate = createDate
    }
    printOut = () => {
        return <div>
                    {this.date.getDate()+" "+this.date.getMonth()} {this.type} {this.subject} {this.time} {this.command}
                </div>
    }
}
export class Quizes{
    quizes:Quiz[]
    constructor(){
        this.quizes = []
    }
    printTable = () =>{
        var q = new Date();
        var m = q.getMonth();
        var d = q.getDate();
        var y = q.getFullYear();
        var date = new Date(y,m,d);
        this.quizes = this.quizes.filter(quiz => date < quiz.date)
        return <TableContainer style={{marginTop:20}}>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Data
                        </TableCell>
                        <TableCell>
                            Typ
                        </TableCell>
                        <TableCell>
                            Przedmiot
                        </TableCell>
                        <TableCell>
                            Czas
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {this.quizes.map((quiz) => {
                        return <TableRow>
                            <TableCell>
                                {quiz.date.getDate()} {quiz.date.toLocaleString('default', { month: 'long' })}
                            </TableCell>
                            <TableCell>
                                {quiz.type}
                            </TableCell>
                            <TableCell>
                                {quiz.subject}
                            </TableCell>
                            <TableCell>
                                {quiz.time} Godzin(y)
                            </TableCell>
                        </TableRow> 
                    })}

                </TableBody>
            </Table>
        </TableContainer> 
    }
}