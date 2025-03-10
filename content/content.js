

TagsArr = []


const searchFunction = () => {
    const fetchTheProduct = async (url, f) => {
        let p = []
        try {
            const response = await fetch(url)

            if (!response.ok) throw error;

            const html = await response.text();

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            let comments = doc.querySelectorAll("[data-appears-component-name='Listzilla_ApiSpecs_Tags_WithImages'] li h3");
            for (let i = 0; i < comments.length; i++) {
                const element = comments[i].innerText;
                let elem = element.trim();
                p.push(elem)
            }
            if (p) {
                return p
            }
            else { return [] }
        } catch (err) {
            console.log("err =>", err.message);
            return []
        }
    };

    const dataArr = [];
    const datafetch = () => {
        let list = document.querySelectorAll("div[data-listing-id]");
        //// console.log(list);
        let promises = []
        list.forEach(async (e, i) => {
            try {
                let url = e?.querySelectorAll("a")[0]?.href
                if (url) {
                    // Push the promise into an array
                    promises.push(fetchTheProduct(url, i))
                }
            } catch (err) {
                console.log(err.message);
            }
        });

        // Use Promise.all to wait for all promises to resolve
        Promise.all(promises).then((v) => {
            //// console.log("All data fetched and stored in dataArr:");
            //// console.log(v);
            if (v) {
                v.forEach(item => {
                    dataArr.push(...item)
                })
            }
            // // console.log(dataArr);
            let uniqDataArr = removeDuplicates(dataArr);
            // // console.log(uniqDataArr);
            let tagObjArr = tagsFrequency(uniqDataArr, dataArr)
            chrome.storage.local.set({ TagsArr: uniqDataArr, tagsFrequencyARR: tagObjArr }, () => {
                chrome.storage.local.get(["TagsArr", "search", "tagsFrequencyARR"], (res) => {
                    // // console.log(res.TagsArr)
                    // // console.log(res.search)
                    // // console.log(res.tagsFrequencyARR);
                    let loadDiv = document.getElementById("ETSY-loadDiv")
                    // // console.log(loadDiv);
                    if (loadDiv) {
                        loadDiv.remove()
                    }
                    ui(res.TagsArr, res.search, res.tagsFrequencyARR)
                })
            })
        })
    };
    datafetch()
}

// searchFunction()

let product = () => {
    //// console.log("product");
    const dataArr = [];
    const comments = document.querySelectorAll("[data-appears-component-name='Listzilla_ApiSpecs_Tags_WithImages'] li h3")
    for (let i = 0; i < comments.length; i++) {
        const element = comments[i].innerText;
        let elem = element.trim();
        dataArr.push(elem);
    }
    let uniqDataArr = removeDuplicates(dataArr);
    let tagObjArr = tagsFrequency(uniqDataArr, dataArr)
    chrome.storage.local.set({ TagsArr: uniqDataArr, tagsFrequencyARR: tagObjArr }, () => {
        chrome.storage.local.get(["TagsArr", "search", "tagsFrequencyARR"], (res) => {
            // // console.log("tags arr", res.TagsArr)
            // // console.log("search", res.search)
            // // console.log("tagsfreq", res.tagsFrequencyARR);
            let loadDiv = document.getElementById("ETSY-loadDiv")
            // // console.log(loadDiv);
            if (loadDiv) {
                loadDiv.remove()
            }
            ui(res.TagsArr, res.search, res.tagsFrequencyARR)
        })
    })
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.msg === "start") {
        tagboxRemoval()
    }
})

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.message === 'productsearch') {
        let tagCheck = tagboxcheck()
        // console.log(tagCheck);
        if (!tagCheck) {
            loader()
            setTimeout(() => {
                product()
            }, 1000)
        }
    }
    else if (message.message === 'menusearch') {
        let tagCheck = tagboxcheck()
        // console.log(tagCheck);
        if (!tagCheck) {
            loader()
            searchFunction()
        }
    }
});





//===>ui design

let navbar = (searchQuery) => {
    let nav = document.createElement("nav")
    let navspan1 = document.createElement("span")
    let navspan2 = document.createElement("span")
    let navdiv = document.createElement("div")
    let divspan1 = document.createElement("span")
    let divspan2 = document.createElement("span")
    let divspan3 = document.createElement("span")
    let divimg = document.createElement("img")
    let logo = document.createElement("img")

    divimg.src = chrome.runtime.getURL("Close.png")
    divspan3.appendChild(divimg)
    navdiv.appendChild(divspan1)
    navdiv.appendChild(divspan2)
    navdiv.appendChild(divspan3)
    nav.appendChild(navspan1)
    nav.appendChild(navspan2)
    nav.appendChild(navdiv)
    logo.src = chrome.runtime.getURL("etsylogo.png")
    logo.alt = "..."
    navspan1.appendChild(logo)

    divimg.addEventListener("click", () => {
        let tagbox = document.getElementById("ETSY-tagbox")
        let refDiv = document.getElementById("ETSY-refDiv")
        refDiv.style.display = "block"
        tagbox.remove()

    })

    if (searchQuery) {
        if (typeof (searchQuery) === "string") {
            navspan2.innerText = `Search : ${searchQuery}`
        }
        else if (typeof (searchQuery) === "number") {
            navspan2.innerText = `product : ${searchQuery}`
        }
    }
    else {
        navspan2.innerText = "Home Page"
    }

    divspan1.innerText = "Copy"
    divspan2.innerText = "Export"

    nav.setAttribute("id", "ETSY-navbar")
    navspan1.setAttribute("class", "ETSY-navspan");
    navspan2.setAttribute("class", "ETSY-navspan");
    navdiv.setAttribute("id", "ETSY-navdiv")
    divspan1.setAttribute("class", "ETSY-divspan")
    divspan2.setAttribute("class", "ETSY-divspan")
    divspan3.setAttribute("class", "ETSY-ds3")
    divimg.setAttribute("id", "ETSY-closeIcon")

    divspan1.addEventListener("click", () => {
        if (divspan1.innerText === "Copy") {
            let menu = document.querySelectorAll(".ETSY-tagMenu")
            //// console.log(menu);
            if (menu) {
                // // console.log(menu);
                let elementnotFound = menu[0].querySelector("#ETSY-elementnotfound")
                if (elementnotFound) {
                    // console.log(elementnotFound); 
                }
                else {
                    // let text = ""
                    // menu.forEach(e => {
                    //     let menuInput = e.querySelector(".ETSY-input")
                    //     // console.log(menuInput);
                    //     if (menuInput.checked === true) {
                    //         let menucontent = e.querySelectorAll("span")[2]
                    //         text = text + menucontent.innerText + "\n"
                    //     }
                    // })
                    let text = copyCheck(menu)
                    if (text === "") {
                        headmenuinputCheck()
                        menu.forEach(e => {
                            let menuInput = e.querySelectorAll(".ETSY-input")[0]
                            if (menuInput && menuInput.type === "checkbox") {
                                menuInput.checked = true
                            }
                        })
                        text = copyCheck(menu)
                    }
                    copytext(text)
                    divspan1.innerText = "copied !"
                    divspan1.style.padding = "6px 32px"
                    setTimeout(() => {
                        divspan1.innerText = "Copy"
                        divspan1.style.padding = "6px 38px"

                    }, 2000)
                }
            }
        }

    })
    divspan2.addEventListener("click", () => {
        let menu = document.querySelectorAll(".ETSY-tagMenu")
        //// console.log(menu);
        if (menu) {
            // // console.log(menu);
            let elementnotFound = menu[0].querySelector("#ETSY-elementnotfound")
            if (elementnotFound) {
                // console.log(elementnotFound); 
            }
            else {
                // let objA = []
                // menu.forEach(e => {
                //     let menuInput = e.querySelectorAll(".ETSY-input")[0]
                //     if (menuInput) {
                //         if (menuInput.type === "checkbox" && menuInput.checked === true) {
                //             let obj = {}
                //             let menucontent = e.querySelectorAll("span")
                //             if (menucontent) {
                //                 obj.sl = menucontent[1]?.innerText
                //                 obj.tagname = menucontent[2]?.innerText
                //                 obj.frequency = menucontent[3]?.innerText
                //                 obj.view = menucontent[4]?.innerText
                //                 obj.favourites = menucontent[5]?.innerText
                //                 obj.competition = menucontent[6]?.innerText
                //                 obj.sales = menucontent[7]?.innerText
                //                 objA.push(obj)
                //             }
                //         }
                //     }
                // })
                let objA = exportCheck(menu)
                if (objA.length === 0) {
                    //massagebox("Select Some Element first")
                    headmenuinputCheck()
                    menu.forEach(em => {
                        let menuInput = em.querySelectorAll(".ETSY-input")[0]
                        if (menuInput && menuInput.type === "checkbox") {
                            menuInput.checked = true
                        }
                    })
                    objA = exportCheck(menu)
                }
                let csvdata = convertJSONToCSV(objA)
                if (searchQuery) {
                    downloadCSV(csvdata, searchQuery)
                }
                else {
                    downloadCSV(csvdata, "HomePage")
                }
            }
            //// console.log(objA);  
        }
    })
    return nav
}

const menuheader = (arr, searchQuery, tagsFrequencyARR) => {
    let headmenu = document.createElement("div")
    let menu = document.createElement("div")

    let span1 = document.createElement("span")
    let span2 = document.createElement("span")
    let span3 = document.createElement("span")
    let span4 = document.createElement("span")
    let span5 = document.createElement("span")
    let span6 = document.createElement("span")
    let span7 = document.createElement("span")
    let span8 = document.createElement("span")
    let span9 = document.createElement("span")
    let frtext = document.createElement("span")
    let frmod1 = document.createElement("span")
    let frmod2 = document.createElement("span")
    let frimg1 = document.createElement("img")
    let frimg2 = document.createElement("img")
    let inputField = document.createElement("input")
    inputField.type = "checkbox"
    frimg1.src = chrome.runtime.getURL("point33.png")
    frimg2.src = chrome.runtime.getURL("point22.png")
    frmod1.appendChild(frimg1)
    frmod2.appendChild(frimg2)
    span1.appendChild(inputField)
    span2.innerText = "#"
    span3.innerText = "Tags"

    frtext.innerText = "Frequency"
    span4.appendChild(frtext)
    span4.appendChild(frmod1)
    span4.appendChild(frmod2)

    span5.innerText = "View"
    span6.innerText = "Favourites"
    span7.innerText = "Competition"
    span8.innerText = "Sales"
    span9.innerText = "Actions"

    menu.appendChild(span1)
    menu.appendChild(span2)
    menu.appendChild(span3)
    menu.appendChild(span4)
    menu.appendChild(span5)
    menu.appendChild(span6)
    menu.appendChild(span7)
    menu.appendChild(span8)
    menu.appendChild(span9)

    headmenu.appendChild(menu)

    headmenu.setAttribute("id", "ETSY-headmenu")

    menu.setAttribute("class", "ETSY-menu")
    inputField.setAttribute("id", "ETSY-headInput")
    span1.setAttribute("class", "ETSY-span1 ETSY-s")
    span2.setAttribute("class", "ETSY-span2 ETSY-s")
    span3.setAttribute("class", "ETSY-span3 ETSY-s ")
    span4.setAttribute("class", "ETSY-span4 ETSY-s")
    span5.setAttribute("class", "ETSY-span5 ETSY-s")
    span6.setAttribute("class", "ETSY-span6 ETSY-s")
    span7.setAttribute("class", "ETSY-span7 ETSY-s")
    span8.setAttribute("class", "ETSY-span8 ETSY-s")
    span9.setAttribute("class", "ETSY-span9 ETSY-s")

    frmod1.setAttribute("class", "ETSY-mod")
    frmod2.setAttribute("class", "ETSY-mod")

    frmod1.addEventListener("click", () => {
        //// console.log("clicked")
        let a = deccenFreq(tagsFrequencyARR)
        // // console.log(a);
        //// console.log(searchQuery);
        frimg1.src = chrome.runtime.getURL("point11.png")
        frimg2.src = chrome.runtime.getURL("point22.png")
        inputField.checked = false
        sortedBody(a, searchQuery, tagsFrequencyARR)
    })
    frmod2.addEventListener("click", () => {
        let b = accenFreq(tagsFrequencyARR)
        frimg2.src = chrome.runtime.getURL("point44.png")
        frimg1.src = chrome.runtime.getURL("point33.png")
        inputField.checked = false
        sortedBody(b, searchQuery, tagsFrequencyARR)
    })
    inputField.addEventListener("change", () => {
        let inp = document.querySelectorAll(".ETSY-input")
        if (inputField.checked === true) {
            inp.forEach(e => {
                e.checked = true
            });
        }
        else {
            inp.forEach(e => {
                e.checked = false
            });
        }
    })
    return headmenu
}

let tagcont = (arr, tagsFrequencyARR) => {
    let contentDiv = document.createElement("div");
    if (!arr.length) {
        let menu = document.createElement("div")
        let h1 = document.createElement("h1")
        h1.innerText = "No Result Found"
        menu.appendChild(h1)
        contentDiv.appendChild(menu)
        h1.setAttribute("id", "ETSY-elementnotfound")
        menu.setAttribute("class", "ETSY-menu ETSY-tagMenu ETSY-Noresult")
        contentDiv.setAttribute("id", "ETSY-contentbox")
    }
    else {
        arr.forEach((e, i) => {
            let menu = document.createElement("div")

            let span1 = document.createElement("span")
            let span2 = document.createElement("span")
            let span3 = document.createElement("span")
            let span4 = document.createElement("span")
            let span5 = document.createElement("span")
            let span6 = document.createElement("span")
            let span7 = document.createElement("span")
            let span8 = document.createElement("span")
            let span9 = document.createElement("span")
            let input = document.createElement("input")
            input.type = "checkbox"

            span2.innerText = `${i + 1}`
            span3.innerText = `${e}`
            tagsFrequencyARR.forEach((el, ind) => {
                if (el.name === e) {
                    span4.innerText = `${el.freq}`
                }
            })
            span5.innerText = " "
            span6.innerText = " "
            span7.innerText = " "
            span8.innerText = " "
            span9.innerText = " "
            span1.appendChild(input)
            menu.appendChild(span1)
            menu.appendChild(span2)
            menu.appendChild(span3)
            menu.appendChild(span4)
            menu.appendChild(span5)
            menu.appendChild(span6)
            menu.appendChild(span7)
            menu.appendChild(span8)
            menu.appendChild(span9)

            contentDiv.appendChild(menu)
            input.setAttribute("class", "ETSY-input")
            menu.setAttribute("class", "ETSY-menu ETSY-tagMenu")

            span1.setAttribute("class", "ETSY-span1 ETSY-s")
            span2.setAttribute("class", "ETSY-span2 ETSY-s")
            span3.setAttribute("class", "ETSY-span3 ETSY-s ETSY-tag")
            span4.setAttribute("class", "ETSY-span4 ETSY-s")
            span5.setAttribute("class", "ETSY-span5 ETSY-s")
            span6.setAttribute("class", "ETSY-span6 ETSY-s")
            span7.setAttribute("class", "ETSY-span7 ETSY-s")
            span8.setAttribute("class", "ETSY-span8 ETSY-s")
            span9.setAttribute("class", "ETSY-span9 ETSY-s")

            contentDiv.setAttribute("id", "ETSY-contentbox")

        })
    }
    return contentDiv
}
const sortedBody = (arr, searchQuery, tagsFrequencyARR) => {
    const newContent = document.getElementById("ETSY-contentbox");
    const tagbox = document.getElementById("ETSY-tagbox");
    if (tagbox) {
        if (newContent) {

            tagbox.removeChild(newContent)
        }
        //// console.log(tagbox, tagsFrequencyARR);


        let content = tagcont(arr, tagsFrequencyARR)
        tagbox.appendChild(content)
    }
}
const ui = (arr, searchQuery, tagsFrequencyARR) => {
    //// console.log("ui start loading");

    let refDiv = document.getElementById("ETSY-refDiv")
    if (refDiv) {
        refDiv.style.display = "none"
    }

    let div = document.createElement("div")
    let nav = navbar(searchQuery)
    let head = menuheader(arr, searchQuery, tagsFrequencyARR)
    let content = tagcont(arr, tagsFrequencyARR)
    div.appendChild(nav)
    div.appendChild(head)
    div.appendChild(content)
    document.body.appendChild(div)
    div.setAttribute("id", "ETSY-tagbox")
}



const loader = () => {
    let refDiv = document.getElementById("ETSY-refDiv")
    if (refDiv) {
        refDiv.style.display = "none"
    }
    let loadDiv = document.createElement("div")
    let loadernav = document.createElement("div")
    let loaderDiv = document.createElement("div")
    for (let i = 1; i <= 4; i++) {
        let loaderCon = document.createElement("div")

        for (let x = 1; x <= 9; x++) {
            let loadLine = document.createElement("div")
            loadLine.setAttribute("class", "ETSY-loadLine ETSY-load")
            loaderCon.appendChild(loadLine)
        }
        loaderCon.setAttribute("class", "ETSY-loaderCon")
        loaderDiv.appendChild(loaderCon)
    }

    loadernav.setAttribute("id", "ETSY-loadernav")
    loaderDiv.setAttribute("id", "ETSY-loaderDiv")
    loadDiv.setAttribute("id", "ETSY-loadDiv")



    loadDiv.appendChild(loadernav)

    loadDiv.appendChild(loaderDiv)
    document.body.appendChild(loadDiv)


    //// console.log("loader")
}


let Reference = () => {
    let refDiv = document.createElement("div")
    let refimg = document.createElement("img")
    refimg.src = chrome.runtime.getURL("Etsytag.png")
    refDiv.appendChild(refimg)
    refDiv.setAttribute("id", "ETSY-refDiv")
    refimg.setAttribute("id", "ETSY-refimg")
    document.body.appendChild(refDiv)
    refDiv.addEventListener("click", () => {
        chrome.runtime.sendMessage({ mes: "refBtn-clicked" }, () => {
            // // console.log("message send suceess");
        })
    })
}
Reference()

let tagboxRemoval = () => {
    //// console.log("tagbox removal");
    let tagbox = document.getElementById("ETSY-tagbox")
    if (tagbox) {
        tagbox.remove()
    }
    let refDiv = document.getElementById("ETSY-refDiv")
    refDiv.style.display = "block"
}

let tagboxcheck = () => {
    // console.log("tagbox check");
    let tagbox = document.getElementById("ETSY-tagbox")
    if (tagbox) {
        return true
    }
    else {
        return false
    }
}
///// if massage box message box needed then use this function
// const massagebox=(messages)=>{
//     let d=document.createElement("div")
//     let s=document.createElement("span")
//     let tagbox=document.getElementById("ETSY-tagbox")
//     if(tagbox){
//     s.innerText=messages
//     d.appendChild(s)
//     tagbox.appendChild(d)
//     d.setAttribute("id","ETSY-MessageDiv")
//     s.setAttribute("id","ETSY-MessageSpan")
//     }
// }
const exportCheck = (menu) => {
    let objA = []
    menu.forEach(e => {
        let menuInput = e.querySelectorAll(".ETSY-input")[0]
        if (menuInput) {
            if (menuInput.type === "checkbox" && menuInput.checked === true) {
                let obj = {}
                let menucontent = e.querySelectorAll("span")
                if (menucontent) {
                    obj.sl = menucontent[1]?.innerText
                    obj.tagname = menucontent[2]?.innerText
                    obj.frequency = menucontent[3]?.innerText
                    // obj.view = menucontent[4]?.innerText
                    // obj.favourites = menucontent[5]?.innerText
                    // obj.competition = menucontent[6]?.innerText
                    // obj.sales = menucontent[7]?.innerText
                    objA.push(obj)
                }
            }
        }
    })
    return objA
}
const copyCheck = (menu) => {
    let text = ""
    menu.forEach(e => {
        let menuInput = e.querySelector(".ETSY-input")
        // console.log(menuInput);
        if (menuInput.checked === true) {
            let menucontent = e.querySelectorAll("span")[2]
            text = text + menucontent.innerText + "\n"
        }

    })
    return text
}
const headmenuinputCheck = () => {
    let headmenu = document.getElementById("ETSY-headmenu")
    if (headmenu) {
        let inp = headmenu.querySelector("#ETSY-headInput")
        if (inp) {
            if (inp.type === "checkbox" && inp.checked === false) {
                inp.checked = true
            }
        }
    }
}