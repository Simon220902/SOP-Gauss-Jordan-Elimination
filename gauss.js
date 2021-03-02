let mat = [[ 0, -1,  1,  2],
           [ 2,  4, -2,  2],
           [ 3,  4,  1,  9]]


/*let mat = [[ 1,  2,  3,  4],
           [ 5,  6,  7,  8],
           [ 9, 10, 11, 12]]
*/

//Ligning i række i ombyttes med række j
function roi1(i, j, m){
    let rowI = m[i];
    let rowJ = m[j];
    m[i] = rowJ;
    m[j] = rowI;
    //return m; LIGEGYLDIG IDET AT ET ARRAY ER IMMUTABLE ØØHHH MEN DET ER VEL FINT NOK
}
//Ligning i række i ganges med k
function roi2(i, k, m){
    //For hvert kollonne-index cI
    for(let cI = 0; cI < m[i].length; cI++){
        m[i][cI] *= k;
    }
    //return m; LIGEGYLDIG IDET AT ET ARRAY ER IMMUTABLE ØØHHH MEN DET ER VEL FINT NOK
}
//Til ligning i række j lægges ligning i række i ganget med k
function roi3(i, j, k, m){
    //For hvert kollonne-index cI
    for(let cI = 0; cI < m[j].length; cI++){
        m[j][cI] += m[i][cI]*k;
    }
    //return m; LIGEGYLDIG IDET AT ET ARRAY ER IMMUTABLE ØØHHH MEN DET ER VEL FINT NOK
}
//flowchart eller pseudokode
function solve(m){
    //For hvert række-index
    for(let rI = 0; rI < m.length; rI++){
        //Hvis der er en koefficient i (rI, rI), så lav ROI2, således koefficienten i (rI, rI) er 1.
        if(m[rI][rI] != 0 && m[rI][rI] != 1){
            let k = 1/m[rI][rI];
            roi2(rI, k, m)
        //Hvis der ikke er nogen koefficient i (rI, rI) så find en på en efterfølgende række og byt om ved roi1, hvorefter roi2 anvendes.
        }else if(m[rI][rI] == 0){
            let switched = false;
            for(let switchI = rI+1; switchI < m.length; switchI++){
                if(m[switchI][rI] != 0){
                    roi1(rI, switchI, m);
                    switched = true;

                    let k = 1/m[rI][rI];
                    roi2(rI, k, m);

                    break;
                }
            }
            //HVAD SKAL DER SKE NÅR DEN IKKE KUNNE BYTTE ER DEN SÅ DONE? ELLER SKAL MAN KØRE VIDERE? MAN SKAL IHVERTFALD ETABLERE AT LØSNINGEN NU ER UFULDSTÆNDIG
        }
        //Herefter udføres roi3 på alle andre rækker en rækken selv.
        for(let rII = 0; rII < m.length; rII++){
            if(m[rII][rI] != 0 && rII != rI){
                let k = -m[rII][rI];
                roi3(rI, rII, k, m);
            }
        }
    }
    return m;
}