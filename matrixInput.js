// HANDLING HTML AND STUFF
function generateInputMatrix(){
    let table = document.getElementById("t");
    clearChildren(table); //This deletes it so we have to reassign it

    let numRows = document.getElementById("numRows").value;
    let numCols = document.getElementById("numCols").value;
    generateTable(table, numRows, numCols);
}
function generateTable(table, rows, cols){
    //HEAD
    let headRow = table.insertRow();
    for(let colI = 0; colI < cols; colI++){
        let th = document.createElement("th");
        let text;
        if(colI < cols-1){
            text = document.createTextNode("x"+(colI+1).toString());
        }else{
            text = document.createTextNode("= ?");
        }
        th.appendChild(text);
        headRow.appendChild(th);
    }

    //BODY (aka. inputs)
    for (let rowI = 0; rowI < rows; rowI++){
        let row = table.insertRow();
        for (let colI = 0; colI < cols; colI++) {
            let cell = row.insertCell();
            let input = document.createElement("input");
            input.setAttribute("type", "number");
            input.setAttribute("id", rowI.toString()+colI.toString());
            //input.setAttribute("value", "ROW:"+rowI.toString()+"COL:"+colI.toString());
            cell.appendChild(input);
        }
    }
}
function clearChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}
function getInputMatrix(){
    let table = document.getElementById("t");
    let numRows = table.rows.length-1;//Minus one as we have a header
    let numCols = table.rows[0].cells.length;
    console.log("NUM ROWS: ", numRows);
    console.log("NUM COLS: ", numCols);
    let mat = [];
    for(let rowI = 0; rowI < numRows; rowI++){
        let r = [];
        for(let colI = 0; colI < numCols; colI++){
            let val = Number(document.getElementById(rowI.toString()+colI.toString()).value);
            r.push(val);
        }
        mat.push(r);
    }
    return mat;
}
function outputSolved(m){
    //Output the new solution
    GaussJordanElimination(m);
    console.log(m);
    //Outputting the solved matrix
    let outputMatrix = document.getElementById("outputMatrix");
    //Clear output div
    clearChildren(outputMatrix);
    let matrixString = "\\begin{bmatrix} ";
    m.forEach(row=>{
        row.forEach(n=>{
            matrixString += n.toString()+" & "
        });
        matrixString = matrixString.slice(0, -2);
        matrixString += "\\\\";
    });
    matrixString = matrixString.slice(0, -2);
    matrixString += "\\end{bmatrix}";
    katex.render(matrixString, outputMatrix, {
            throwOnError: false
    });
    //Output the solved matrix in equation form
    let outputEquations = document.getElementById("outputEquations");
    //Clear output div
    clearChildren(outputEquations);
    let equations = solvedMatrixToEquations(m);

    equations.forEach(eq => {
        let newDiv = document.createElement("div");
        outputEquations.appendChild(newDiv);
        katex.render(eq, newDiv, {
            throwOnError: false
        });
    });
}
function solveInputMatrix(){
    let m = getInputMatrix();
    outputSolved(m);
}
function readFile(){
    let input = document.getElementById("fileIn");
    if(input.files.length > 0){
        let file = input.files[0];
        let reader = new FileReader();
        reader.onload = function(){
            //This is where we get access to the function.
            //document.getElementById("outputFile").textContent = reader.result;
            readMatricesAndTime(reader.result);
        }
        reader.readAsText(file);
    }else{
        alert("No file was selected");
    }
}
function readMatricesAndTime(s){
    //Clear the outputFile field
    document.getElementById("outputFile").textContent = "";
    // COLS,ROWS,TIME
    let times = [];
    //FORMATTING:
    //COLS ROWS
    // .... (matrix)
    //COLS ROWS (once again)
    let lines = s.split("\n");
    lines = lines.map(line => line.split(" ").map(x => Number(x)));
    let output = ""; // This is where the timings will be kept with the following formatting "ROWS COLS TIME\n" will be kept
    let i = 0;
    while(i < lines.length-1){
        let newOutput = "";
        let cols = lines[i][0];
        let rows = lines[i][1];
        newOutput += cols.toString() + " " + rows.toString();
        i += 1;
        let matrix = lines.slice(i, i+rows);
        i += rows;
        //Time the solving
        let timeStart = window.performance.now();
        GaussJordanElimination(matrix);
        let timeStop = window.performance.now();
        let deltaTime = timeStop-timeStart;
        newOutput += " "+deltaTime.toString()+"\n";
        output += newOutput;
    }
    document.getElementById("outputFile").textContent = output;


}
// HOW TO HANDLE THE RESULTING MATRIX
function solvedMatrixToEquations(m){
    console.log(m);
    let rM = rangM(m);
    let rK = rangK(m);
    let solutions = [];
    //Ingen løsning
    if(rK < rM){
        solutions.push("INGEN \\ LOESNING");
    //Én løsning
    }else if(rM == rK && rM == m[0].length-1){
        for(let i = 0; i < m.length; i++){
            if(i < m[0].length-1){
                solutions.push(completeRowToEquation(i, m));
            }
        }
    //Uendeligt mange løsninger
    }else if(rM == rK && rK < m.length){
        for(let i = 0; i < m[0].length-1; i++){
            if(i < m[0].length-1){
                solutions.push(incompleteRowToEquation(i, m));
            }
        }
    }
    return solutions;
}
function completeRowToEquation(rowI, m){
    return "x_"+(rowI+1).toString()+" = "+(m[rowI][m[0].length-1]).toString();
}
function incompleteRowToEquation(rowI, m){
    let eq;
    if(m[rowI][rowI] == 1){
        eq = "x_"+(rowI+1).toString()+" = "+(m[rowI][m[0].length-1]).toString();
        for(let colI = 0; colI < m[rowI].length-1; colI++){
            if(colI == rowI){
            }else if(m[rowI][colI] != 0){
                if(m[rowI][colI] > 0){
                    eq += " - ("+m[rowI][colI].toString()+" \\cdot x_"+(colI+1).toString()+")";
                }else{
                    eq += " + ("+Math.abs(m[rowI][colI]).toString()+" \\cdot x_"+(colI+1).toString()+")";
                }
            }
        }
    //Just a shitty row, where the m[rowI][rowI] != 1, and then the equation is just given as the non-zero coefficients times their respective variables equal whatever is on the right side of the equal sign.
    //I AM NOT SURE IF THIS WILL EVERY BE RELEVANT? MAYBE IT WAS ONLY THE LAST ELSE I NEEDED TO ADD? HMMM ILL HAVE TO DETERMINE THAT LATER :)
    }
    return eq;
}
function rangM(m){
    let r = 0;
    for(let i = 0; i < m.length; i++){
        //let nonZeroInRow = false;
        for(let j = 0; j < m[0].length; j++){
            if(m[i][j] != 0){
                r += 1;
                break;
            }
        }
    }
    return r;
}
function rangK(m){
    let r = 0;
    for(let i = 0; i < m.length; i++){
        //let nonZeroInRow = false;
        for(let j = 0; j < m[0].length-1; j++){
            if(m[i][j] != 0){
                r += 1;
                break;
            }
        }
    }
    return r;
}