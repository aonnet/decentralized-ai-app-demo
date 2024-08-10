console.log(import.meta.env.VITE_APP_API_BASE_URL);
console.log(import.meta.env.VITE_APPID);

var API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE"



import { createClient } from '@supabase/supabase-js'
const supabaseUrl = import.meta.env.VITE_APP_API_BASE_URL
const supabaseKey = API_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

let appData = null

async function login() {
    let { data, error } = await supabase.auth.signInWithPassword({
        email: '',
        password: ''
    })
    console.log("supabase",data,error)
    if (data && data.user && data.user.aud) {
        localStorage.setItem("supabase_aud",data.user.aud)
        localStorage.setItem("supabase_expires_at",data.session.expires_at)
    }
}

async function logout() {
    let { error } = await supabase.auth.signOut()
    console.log("supabase logout",error)
    if (!error) {
        localStorage.setItem("supabase_aud","")
        localStorage.setItem("supabase_expires_at","")
    }
}

// logout()

async function loadDatatest(id) {
    console.log("loadDatatest in",id)
    // let aud = localStorage.getItem("supabase_aud") 
    // let expires_at = localStorage.getItem("supabase_expires_at") 
    // if (!(aud && aud.length) || (aud && aud.length && new Date().getTime() >= expires_at*1000)) {
    //     await login()
    // }
    let {data: app_data,error} = await supabase
    .from('app_data')
    .select('*')
    .eq("app_id",id)
    console.log("loadDatatest",app_data,error)
}

// loadDatatest(1)

async function loadDomain(domain) {
    let {data:app_domain,error} = await supabase
    .from("app_domain")
    .select("*")
    .eq("domain",domain)
    console.log("loadDomain",app_domain,error)
    if (error || !app_domain) {
        throw error
    }
    app_domain = app_domain && app_domain.length && app_domain[0]
    return app_domain && app_domain.app_id
}

export async function loadApp(domain) {
    // let aud = localStorage.getItem("supabase_aud") 
    // let expires_at = localStorage.getItem("supabase_expires_at") 
    // if (!(aud && aud.length) || (aud && aud.length && new Date().getTime() >= expires_at*1000)) {
    //     await login()
    // }
    let app_id = import.meta.env.VITE_APPID
    let flag = domain && domain.length && domain.indexOf('localhost') < 0
    if (flag) {
        app_id = await loadDomain(domain)
    }
    console.log("loadApp app_id",app_id)
    let temp = supabase.from('app')
    .select('*')
    if (flag) {
        temp = temp.eq("id",app_id)
    } else {
        temp = temp.eq("app_id",app_id)
    }
    let {data: app,error} = await temp
    console.log("loadApp",app,error)
    app = app && app.length && app[0]
    console.log("loadApp 111",app,error)
    if (error) {
        return null
    }
    return app
}

export function needLoadData(app) {
    if (!(app && app.template_params)) {
        return null
    }
    if (!app.template_params.ui) {
        return null
    }
    const dataTableSources = findKeysWithDataTableSource(app.template_params.ui);
    console.log(dataTableSources);
    return dataTableSources
}

function findKeysWithDataTableSource(obj) {
    const keys= [];

    function recurse(currentObj, parentKey) {
        if (typeof currentObj === 'object' && currentObj !== null) {
            for (let key in currentObj) {
                if (key === 'source' && currentObj[key] === 'data_table') {
                    keys.push(parentKey);
                } else if (typeof currentObj[key] === 'object') {
                    recurse(currentObj[key], key);
                }
            }
        }
    }

    recurse(obj, null);
    return keys;
}

function findDataTableSources(obj) {
    const result = [];

    function recurse(obj) {
        if (obj && typeof obj === 'object') {
            for (let key in obj) {
                if (key === 'source' && obj[key] === 'data_table') {
                    result.push(obj);
                } else if (typeof obj[key] === 'object') {
                    recurse(obj[key]);
                }
            }
        }
    }

    recurse(obj);
    return result;
}

// const dataTableSources = findDataTableSources(data);
// console.log(dataTableSources);

export async function loadData(app,key) {
    console.log("loadData in",app.id,app,key)
    // let aud = localStorage.getItem("supabase_aud") 
    // let expires_at = localStorage.getItem("supabase_expires_at") 
    // if (!(aud && aud.length) || (aud && aud.length && new Date().getTime() >= expires_at*1000)) {
    //     await login()
    // }
    let {data: app_data,error} = await supabase
    .from('app_data')
    .select('*,data(value,user_id)')
    .eq("app_id",app.id)
    .eq("data.type",key)
    console.log("loadData",app_data,error)
    let returnDatas = []
    for (let i = 0; i < app_data?.length; i++) {
        let data = app_data[i]
        let returnData = {
            id:data.data_id,
            value:data.data.value,
            type:key,
            template_id:data.template_id,
            user_id:data.data.user_id,
            selected:false
        }
        if (i === 0) {
            returnData.selected = true
        }
        returnDatas.push(returnData)
    }
    // app = app && app.length && app[0]
    console.log("loadData 111",returnDatas)
    if (error) {
        return null
    }
    return returnDatas
}

export function findKey(obj, keyToFind) {
    let result = null;
  
    function recursiveSearch(obj, keyToFind) {
      if (typeof obj !== 'object' || obj === null) {
        return;
      }
  
      for (let key in obj) {
        if (key === keyToFind) {
          result = obj[key];
          return;
        }
        if (typeof obj[key] === 'object') {
          recursiveSearch(obj[key], keyToFind);
        }
      }
    }
  
    recursiveSearch(obj, keyToFind);
    return result;
  }

  export function findParentKey(obj, keyToFind) {
    let result = null;
  
    function recursiveSearch(obj, keyToFind) {
      if (typeof obj !== 'object' || obj === null) {
        return;
      }
  
      for (let key in obj) {
        if (key === keyToFind) {
          result = obj;
          return;
        }
        if (typeof obj[key] === 'object') {
          recursiveSearch(obj[key], keyToFind);
        }
      }
    }
  
    recursiveSearch(obj, keyToFind);
    return result;
  }


  function findKeyPath(schema, targetKey) {
    let path = [];
    let found = false;

    function traverse(obj, currentPath) {
        if (found) return;

        for (const key in obj) {
            if (key === targetKey) {
                path = [...currentPath, key];
                found = true;
                return;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                traverse(obj[key], [...currentPath, key]);
            }
        }
    }

    traverse(schema, []);
    return found ? path : null;
}

// export function findRefValues(obj: any) {
//     const refValues: any[] = [];

//     function recurse(obj: { [x: string]: any; } | null) {
//         if (typeof obj === 'object' && obj !== null) {
//             for (const key in obj) {
//                 if (key === '$ref') {
//                     refValues.push(obj[key]);
//                 } else {
//                     recurse(obj[key]);
//                 }
//             }
//         }
//     }

//     recurse(obj);
//     return refValues;
// }

export function findRefValues(obj) {
    const refEntries = [];

    function recurse(obj, path) {
        if (typeof obj === 'object' && obj !== null) {
            for (const key in obj) {
                const newPath = path ? `${path}.${key}` : key;
                if (key === '$ref') {
                    refEntries.push({ path: path, ref: obj[key] });
                } else {
                    recurse(obj[key], newPath);
                }
            }
        }
    }

    recurse(obj, '');
    return refEntries;
}


export async function loadAppData(domain) {
    if (!appData) {
        let temp  = await loadApp(domain)
        let keys = needLoadData(temp)
    
        for (let i = 0; i < keys?.length; i++) {
            let data = findParentKey(temp.params_value, keys[i])
            console.log("appData findParentKey", data)
            data[keys[i]] = await loadData(temp, keys[i])
            console.log("appData data[keys[i]]", data)
        }

        appData = temp
    }
    return appData
}

// export function sortObjectByIndex(obj) {
//     // If the object has 'properties', sort the properties
//     if (obj.properties && typeof obj.properties === 'object') {
//         const sortedProperties = {};
        
//         // Get the keys of properties, sort them by index if index exists
//         Object.keys(obj.properties)
//             .sort((a, b) => {
//                 const indexA = obj.properties[a].index !== undefined ? obj.properties[a].index : -1;
//                 const indexB = obj.properties[b].index !== undefined ? obj.properties[b].index : -1;
//                 if (indexA === -1 && indexB === -1) return 0;
//                 if (indexA === -1) return 1;
//                 if (indexB === -1) return -1;
//                 return indexA - indexB;
//             })
//             .forEach(key => {
//                 sortedProperties[key] = sortObjectByIndex(obj.properties[key]);
//             });
        
//         // Create a new object with sorted properties
//         return { ...obj, properties: sortedProperties };
//     }
//     // If the object is an array, sort each element
//     if (Array.isArray(obj)) {
//         return obj.map(item => sortObjectByIndex(item));
//     }
//     // If it's a simple object or other type, return as is
//     return obj;
// }

export function sortObjectByIndex(obj) {
    // If the object has 'properties', sort the properties
    if (obj.properties && typeof obj.properties === 'object') {
        const sortedProperties = {};
        
        // Get the keys of properties and their original order
        const keys = Object.keys(obj.properties);
        const keysWithIndex = keys.map((key, originalIndex) => ({
            key,
            originalIndex,
            index: obj.properties[key].index !== undefined ? obj.properties[key].index : Infinity
        }));
        
        // Sort the keys by index, maintaining original order for those without index
        keysWithIndex.sort((a, b) => {
            if (a.index === b.index) {
                return a.originalIndex - b.originalIndex; // Maintain original order
            }
            return a.index - b.index;
        });
        
        // Build the sorted properties object
        keysWithIndex.forEach(({ key }) => {
            sortedProperties[key] = sortObjectByIndex(obj.properties[key]);
        });
        
        // Create a new object with sorted properties
        return { ...obj, properties: sortedProperties };
    }
    // If the object is an array, sort each element
    if (Array.isArray(obj)) {
        return obj.map(item => sortObjectByIndex(item));
    }
    // If it's a simple object or other type, return as is
    return obj;
}