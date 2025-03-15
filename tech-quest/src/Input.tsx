import { Component } from "react";
import { AiPrompt } from "./Responses";
import { Button, TextField} from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
interface propes{
    addQuiz:any
    deleteQuiz:any
    getTime:any
}
export class Input extends Component<propes>{
    pr = "";
    inputChange = (value:string) => {
        this.pr = value
    }
    requestPrompt = async()=> {
        const aiPrompter = new AiPrompt(this.pr)
        let r:string =  await aiPrompter.run()
        if(!r.includes('1') && !r.includes('2') && !r.includes('3') && !r.includes("Plan")){
            alert("Wpisz poprawne zapytanie - uwzględnij datę, typ działania, przedmiot, czas na naukę i typ sprawdzianu")
            return
        }
        let res =JSON.parse(r)
        console.log(res)
        if(res.Data)
            res.Data = new Date(res.Data.split(" ")[0]+" "+res.Data.split(" ")[1]+", "+res.Data.split(" ")[2]+" 2025 23:59:59")
        var q = new Date();
        var m = q.getMonth();
        var d = q.getDate();
        var y = q.getFullYear();
        var date = new Date(y,m,d);
        if(date>res.Data && res.Data){
            alert("Nie można ustawiać na przeszłe daty")
            return
        }
        if(res.Polecenie == "Zapisz"){
            if(!res.Typ || !res.Przedmiot || !res.Czas){
                alert("Wpisz poprawne zapytanie - uwzględnij datę, typ działania, przedmiot, czas na naukę i typ sprawdzianu")
                return
            }
            this.props.addQuiz(res.Data,res.Typ,res.Przedmiot,res.Czas,res.Polecenie,date)
        }
        else if(res.Polecenie == "Usuń"){
            if(!res.Typ || !res.Przedmiot){
                alert("Wpisz poprawne zapytanie - uwzględnij datę, typ działania, przedmiot, czas na naukę i typ sprawdzianu")
                return
            }
            this.props.deleteQuiz(res.Data,res.Typ,res.Przedmiot)
        }
        else if(res.Polecenie == "Plan"){
            if(res.Data)
                this.props.getTime(res.Data)
            else
                this.props.getTime(date)
        }
    }
    
    render(){
        return <div>
                <MicIcon style={{fontSize:"35px",marginTop:50}} />
                <TextField style={{marginTop:40}} className="input"  variant="outlined" label="Zapytanie"  onChange={e => this.inputChange(e.target.value)}/>
                <Button  style={{marginTop:10,marginBottom:10,marginLeft:30,height:40,backgroundColor:"#143dc4",color:"#cccccc"}} className="input button" variant="contained" onClick={e => this.requestPrompt()}>Wykonaj</Button>
            </div>
    }
}
