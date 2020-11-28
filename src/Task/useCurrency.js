import {useState,useEffect} from 'react'
import axios from 'axios'
export default function useCurrency(){
    const [exchangeRate,setExchangeRate] = useState({
        
    })
    useEffect(async () => {
        let {data} = await axios.get('https://api.globus.furniture/forex')
        
        setExchangeRate(()=>data)
    },[])
    const exchangeTo = (exchangeRate,price,fromType,toType)=>{
        if(JSON.stringify(exchangeRate) === "{}") return 
        if(fromType === toType) return price.toFixed(2)
        if(fromType === 'RMB'){
            return (price * exchangeRate[toType].value).toFixed(2)
        }else{
            let rmb = price / exchangeRate[fromType].value
            if(toType === 'RMB') return rmb.toFixed(2)
            return (rmb * exchangeRate[toType].value).toFixed(2)
        }
    }
    return {
        exchangeRate,
        exchangeTo
    }
}
