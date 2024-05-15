
//TODO change backend URI to the correct one
//const backendURI = 'http://localhost:3000';
const devState = import.meta.env.VITE_DEVSTATE
const backendURI = devState==='PROD' ? '/app' : 'http://localhost:3005';
//const backendURI = '/app';


export async function globalFetch(endpoint, filter, family) {

    console.log(`"globalFetch()" received the following params: endpoint: ${endpoint} / filter ${filter} / family_uuid: ${family}`)
    //console.log(`${backendURI}/api/${endpoint}/find`)
    const response = await fetch(`${backendURI}/api/${endpoint}/find`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: filter // body data type must match "Content-Type" header
    })

    if (response.status !== 200) {
        // setError("incorrect")
        console.log("not successfull: Status ",response.status)
        return
    }
    const res = await response.json();

    console.log(`Response from "${endpoint}" globalFetch is: `, res)
    return res
    }

export async function globalWrite(endpoint, body, family) {

    console.log(`"globalWrite()" received the following params: endpoint: ${endpoint} / filter ${body} / family_uuid: ${family}`)
    //console.log(`${backendURI}/api/${endpoint}/find`)
    const response = await fetch(`${backendURI}/api/${endpoint}/`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: body, // body data type must match "Content-Type" header
    })
    if (response.status !== 200) {
        // setError("incorrect")
        console.log(response.status)
        return
    }
    const res = await response.json();

    console.log(`Response from "${endpoint}" globalFetch is: `, res)
    return res
    //console.log(res)
}


export async function globalDelete(endpoint, uuid, family) {

    console.log(`"globalDelete()" received the following params: endpoint: ${endpoint} / filter ${uuid} / family_uuid: ${family}`)
    //console.log(`${backendURI}/api/${endpoint}/find`)
    const response = await fetch(`${backendURI}/api/${endpoint}/${uuid}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        // // cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "include", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        // redirect: "follow", // manual, *follow, error
        // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        // body: body, // body data type must match "Content-Type" header
    })
    if (response.status !== 200) {
        // setError("incorrect")
        console.log(response.status)
        return
    }
    const res = await response.json();

    console.log(`Response from "${endpoint}" globalDelete is: `, res)
    return res
    //console.log(res)
}