// HANDLING HTML AND STUFF
function generateInputMatrix(){
    let table = document.getElementById("t");
    clearTable(table); //This deletes it so we have to reassign it

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
            text = document.createTextNode("k"+(colI+1).toString());
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
    let  outputDiv = document.getElementById("output");
    //Clear output div
    clearChildren(outputDiv);
    //Output the new solution
    solve(m);
    console.log(m);
    let equations = solvedMatrixToEquations(m);
    equations.forEach(eq => {
        let p = document.createElement("p");
        let tEq = document.createTextNode(eq);
        p.appendChild(tEq);
        outputDiv.appendChild(p);
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
        solve(matrix);
        let timeStop = window.performance.now();
        let deltaTime = timeStop-timeStart;
        newOutput += " "+deltaTime.toString()+"\n";
        output += newOutput;
    }
    document.getElementById("outputFile").textContent = output;


}


// HOW TO HANDLE THE RESULTING MATRIX
function solvedMatrixToEquations(m){
    let sol = [];
    for(let rowI = 0; rowI < m.length; rowI++){
        if(rowIsSolved(rowI, m)){
            sol.push(completeRowToEquation(rowI, m));
        }else{
            sol.push(incompleteRowToEquation(rowI, m));
        }
    }
    return sol;
}
function completeRowToEquation(rowI, m){
    return "x"+(rowI+1).toString()+" = "+(m[rowI][m[0].length-1]).toString();
}
//ADD SPECIAL CASE FOR WHEN ALL OF THE COEFFICIENTS ARE 0
function incompleteRowToEquation(rowI, m){
    let eq;
    if(m[rowI][rowI] == 1){
        eq = "x"+(rowI+1).toString()+" = "+(m[rowI][m[0].length-1]).toString();
        for(let colI = 0; colI < m[rowI].length-1; colI++){
            if(colI == rowI){
            }else if(m[rowI][colI] != 0){
                if(m[rowI][colI] > 0){
                    eq += " - ("+m[rowI][colI].toString()+" * x"+(colI+1).toString()+")";
                }else{
                    eq += " + ("+Math.abs(m[rowI][colI]).toString()+" * x"+(colI+1).toString()+")";
                }
            }
        }
    //Just a shitty row, where the m[rowI][rowI] != 1, and then the equation is just given as the non-zero coefficients times their respective variables equal whatever is on the right side of the equal sign.
    //I AM NOT SURE IF THIS WILL EVERY BE RELEVANT? MAYBE IT WAS ONLY THE LAST ELSE I NEEDED TO ADD? HMMM ILL HAVE TO DETERMINE THAT LATER :)
    }else if(rowIsValid(rowI, m)){
        eq = "";
        for(let colI = 0; colI < m[rowI].length-1; colI++){
            if(m[rowI][colI] != 0){
                if(eq.length > 1){
                    eq += " + ";
                }
                eq += "("+m[rowI][colI].toString()+" * x"+(colI+1).toString()+")";
            }
        }
        eq += " = "+m[rowI][m[rowI].length-1].toString();
    }else{
        eq = "x"+(rowI+1).toString()+" = undeterminable";
    }
    return eq;
}
function rowIsValid(rowI, m){ //Are the coefficient anything byt zero?
    for(let colI = 0; colI < m[rowI].length-1; colI++){
        if(m[rowI][colI] != 0){
            return true;
        }
    }
    return false;
}
function rowIsSolved(rowI, m){
    for(let colI = 0; colI < m[rowI].length-1; colI++){
        if(colI != rowI && m[rowI][colI] == 0){
            //pass
        }else if(colI == rowI && m[rowI][colI] == 1){
            //pass
        }else{
            return false;
        }
    }
    return true;
}
