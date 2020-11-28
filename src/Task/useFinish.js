import {useState,useEffect} from 'react'
function insertFinishState(list,isFinished){
    let _list = [...list]
    return _list.map(v=>{
        v.finished = isFinished
        return v
    })
}
export default function useFinish({planingArr,finishedArr}){
    const [planingList,setPlaningArr] = useState(planingArr)
    const [finishedList,setFinishedArr] = useState(finishedArr)
    return {
        planingList,
        finishedList,
        initList:()=>{
            setPlaningArr(()=>{
                return insertFinishState(planingList,false)
            })
            setFinishedArr(()=>{
                return insertFinishState(finishedList,true)
            })
        },
        createEventProps:(index,isFinished)=>{
            return {
                finishToggle:()=>{
                    let temp = null
                    if(isFinished){
                        //planing => finished
                        setPlaningArr(list=>{
                            let _list = [...list]
                            temp = _list.splice(index,1)[0]
                            temp.finished = isFinished
                            return _list 
                        })
                        setFinishedArr(list=>{
                            let _list = [...list]
                            _list.unshift(temp)
                            return _list 
                        })
                    }else{
                        //finished => planing
                        setFinishedArr(list=>{
                            let _list = [...list]
                            temp = _list.splice(index,1)[0]
                            temp.finished = isFinished
                            return _list 
                        })
                        setPlaningArr(list=>{
                            let _list = [...list]
                            _list.unshift(temp)
                            return _list 
                        })
                    }
                    
                }
            }
        },
        addItem:(item)=>{
            setPlaningArr(list=>{
                let _list = [...list]
                _list.unshift(item)
                return _list 
            })
        }
    }
}
