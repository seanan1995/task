import React,{useState,useEffect} from 'react'
import style from './Task.module.scss'
import useFinish from './useFinish'
import useCurrency from './useCurrency'
let initTask = {
    planingArr:[
        {
            content:'吃麻辣烫',
            price:12,
            currencyType:'RUB'
        },
        {
            content:'看电影',
            price:34,
            currencyType:'RMB'
        },
        {
            content:'去网吧打英雄联盟',
            price:1.3,
            currencyType:'USD'
        }
    ],
    finishedArr:[]
}

function AddPanel({onAdd,exchangeTo,exchangeRate}){
    const [taskContent,setTaskContent] = useState("")
    const [taskPrice,setTaskPrice] = useState("")
    const [taskPriceType,setTaskPriceType] = useState("")
    return (<div className={style.add_panel}>
        <div className={style.edit_panel}>
            <input value={taskContent} onChange={e => setTaskContent( v=>e.target.value)} className={style.task_content} type="text" placeholder="任务"></input>
            <input value={taskPrice} onChange={e => setTaskPrice( v=>e.target.value)} className={style.task_price} type="text" placeholder="价格"></input>
            <select value={taskPriceType} onChange={e => setTaskPriceType( v=>e.target.value)} className={style.task_currency_type_select} >
                <option value="" disabled hidden>货币类型</option>
                <option value="RUB">卢布</option>
                <option value="RMB">人民币</option>
                <option value="USD">美元</option>
            </select>
            <button className={style.add_btn} onClick={()=>{
                if(taskPrice!==0 && !Number(taskPrice)){
                    alert('价钱格式错误')
                }else if(!taskPriceType){
                    alert('必须选择货币类型')
                }else if(!taskContent){
                    alert('必须有任务描述')
                }else{
                    onAdd({
                        content:taskContent,
                        price:Number(taskPrice),
                        currencyType:taskPriceType,
                        finished:false
                    })
                    setTaskContent("")
                    setTaskPrice("")
                    setTaskPriceType("")
                }
            }}>添加</button>
        </div>
        <div className={style.exchange_rate}>
            <span>{exchangeTo(exchangeRate,1,'RMB','RUB')??0} ₽/￥ </span>
            <span>{exchangeTo(exchangeRate,1,'USD','RUB')??0} ₽/$ </span>
            <span>{exchangeTo(exchangeRate,1,'USD','RMB')??0} ￥/$ </span>
        </div>
    </div>)
}

function TaskList({list,title,totalTitle,noDataTitle,createEventProps,exchangeRate,exchangeTo}){
    const renderList = (list)=>{
        if(list.length){
            return list.map((v,i)=>{
                return <TaskItem item={{...v}} exchangeRate={exchangeRate} exchangeTo={exchangeTo} hasTopLine={i} {...createEventProps(i,!v.finished)} key={i}></TaskItem>
            })
        }else{
            return <div className={style.no_data}>{noDataTitle}</div>
        }
    }
    const totalPrice = (toType)=>{
        let total = 0
        list.forEach(item => {
            total += Number(exchangeTo(exchangeRate,item.price,item.currencyType,toType))??0
        });
        return total?total.toFixed(2):0
    }
    return <React.Fragment>
        <h2>{title}</h2>
        <div className={style.task_list}>
        {
            renderList(list)
        }
        </div>
        <div className={style.total}>
            <h2>{totalTitle}</h2>
            <span>₽ {totalPrice('RUB')??0}</span>
            <span>￥ {totalPrice('RMB')??0}</span>
            <span>$ {totalPrice('USD')??0}</span>
        </div>
    </React.Fragment>
}

function TaskItem({item,finishToggle,exchangeTo,exchangeRate,hasTopLine}){
    return (
        <div className={style.task_item +" "+ (hasTopLine?style.top_line:'')}>
            <div className={style.content_wrap}>
                <span onClick={finishToggle} className={style.checkbox + " " + (item.finished?style.checked:'')}></span>
                <span className={style.content +" "+ (item.finished?style.finished:'')}>{item.content}</span>
            </div>
            <span className={style.price}>₽ {exchangeTo(exchangeRate,item.price,item.currencyType,'RUB')??0}</span>
            <span className={style.price}>￥ {exchangeTo(exchangeRate,item.price,item.currencyType,'RMB')??0}</span>
            <span className={style.price}>$ {exchangeTo(exchangeRate,item.price,item.currencyType,'USD')??0}</span>
        </div>
    )
}

export default function TaskCard() {
    const {initList,planingList,finishedList,createEventProps,addItem} = useFinish(initTask)
    useEffect(initList,[])
    const {exchangeRate,exchangeTo} = useCurrency()
    return <div className={style.task}>
            <AddPanel exchangeRate={exchangeRate} exchangeTo={exchangeTo} onAdd={addItem}></AddPanel>
            <TaskList list={planingList} title="计划：" totalTitle="将要花费：" noDataTitle="没有计划任务" exchangeRate={exchangeRate} exchangeTo={exchangeTo} createEventProps={createEventProps}></TaskList>
            <TaskList list={finishedList} title="已完成：" totalTitle="一共花了：" noDataTitle="没有已完成的任务" exchangeRate={exchangeRate} exchangeTo={exchangeTo} createEventProps={createEventProps}></TaskList>
        </div>

}
