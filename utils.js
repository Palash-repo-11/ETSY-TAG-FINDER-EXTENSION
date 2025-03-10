
function removeDuplicates(arr) {
    return [...new Set(arr)];
}


const tagsFrequency = (uniqArr, mainArr) => {
    let objARRAY = []
    uniqArr.forEach(e => {
        let obj = {}
        let count = 0;
        for (let index = 0; index < mainArr.length; index++) {
            const elem = mainArr[index];
            if (elem === e) {
                count++;
            }
        }
        obj.name = e
        obj.freq = count
        objARRAY.push(obj)
    })
    return objARRAY
}


let accenFreq = (objarr) => {
    let a = objarr
    let arr = []
    for (let i = 0; i < a.length; i++) {
        for (let j = i + 1; j < a.length; j++) {
            let temp;
            if (a[i].freq > a[j].freq) {
                temp = a[i]
                a[i] = a[j]
                a[j] = temp
            }
        }
    }
    a.forEach(item => {
        arr.push(item.name)
    })
    return arr
}


let deccenFreq = (objarr) => {
    let q = accenFreq(objarr)
    let arr2 = []
    for (let i = q.length - 1; i >= 0; i--) {
        arr2.push(q[i])
    }
    return arr2
}

  
  const convertJSONToCSV=(jsonData)=> {
    const separator = ','; // You can change this to a different separator if needed
  
    // Create the header row
    const headers = Object.keys(jsonData[0]);
    const csvHeader = headers.join(separator);
  
    // Create an array to hold CSV rows
    const csvRows = [csvHeader];
  
    // Convert JSON data to CSV format
    jsonData.forEach(item => {
      const values = headers.map(header => item[header]);
      csvRows.push(values.join(separator));
    });
  
    // Join rows with line breaks
    const csvString = csvRows.join('\n');
  
    return csvString;
  }
  
  // Function to download the CSV file
  const downloadCSV=(csvData, filename)=>{
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.textContent = 'Download CSV';
    document.body.appendChild(a);
  
    a.click();
  
    document.body.removeChild(a);
  }

const copytext=(ElementTextValue)=>{
    // console.log("ELEMENT VALUE",ElementTextValue)
    try{
        navigator.clipboard.writeText(ElementTextValue);
    }catch(err){
        console.log("copy to clipboard Error =>",err)
    }
}
