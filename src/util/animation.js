export function animcaller (time,setcounter,number) {
  return new Promise(res=> {
    setTimeout(()=>{res(setcounter(number))},time)
  })
}

export function ClassNameMaker(name,numberofclass) {
  
  const arrayofletters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
  let newarray = [];
  for(let i = 0; i<numberofclass; i++){
    newarray.push(i);
  }
  const finalarray = newarray.map((item,index)=> {
    if(index === 0){
      return `${name}`;
    }
    else {
      return `${name} ${arrayofletters[index-1]}`;
    }   
  })
  return finalarray; 
}

export function startAnim(hooks){
  return new Promise((resolve)=> {
    resolve(hooks(false))
  }) 
}

export function finishAnim(hooks){
  return new Promise((resolve)=> {
    resolve(hooks(true))
  }) 
}
