let mat = [[ 0, -1,  1,  2],
       [ 2,  4, -2,  2],
       [ 3,  4,  1,  9]]

//Ligning i række i ombyttes med række j
function ro1(i, j, m){
  let rowI = m[i];
  let rowJ = m[j];
  m[i] = rowJ;
  m[j] = rowI;
}
//Ligning i række i ganges med k
function ro2(i, k, m){
  //For hvert kollonne-index cI
  for(let cI = 0; cI < m[i].length; cI++){
    m[i][cI] *= k;
  }
}
//Til ligning i række j lægges ligning i række i ganget med k
function ro3(i, j, k, m){
  //For hvert kollonne-index cI
  for(let cI = 0; cI < m[j].length; cI++){
    m[j][cI] += m[i][cI]*k;
  }
}

function GaussJordanElimination(m){
  //For hvert række-index
  //1.
  for(let i = 0; i < m[0].length-1 && i < m.length; i++){
    //Hvis koefficient i (rI, rI) er nul
    //2.
    if(m[i][i] == 0){
      //så find en der ikke er på de efterfølgende rækker
      //3.
      for(let j = i+1; j < m.length; j++){
        //4.
        if(m[j][i] != 0){
          //5.
          ro1(i, j, m);
          //6.
          break;
        }
      }
    }
    //Hvis koefficienten i (rI, rI) ikke 0
    //7.
    if(m[i][i] != 0){
      //8.
      let k = 1/m[i][i];
      ro2(i, k, m)
      //Herefter udføres ro3 på alle andre rækker en rækken selv.
      //9.
      for(let j = 0; j < m.length; j++){
        //10.
        if(m[j][i] != 0 && j != i){
          //11.
          let k = -m[j][i];
          ro3(i, j, k, m);
        }
      }
    }
  }
}