console.log(import.meta.env.VITE_APPID);


import {supabase,getVersion,call_eage_function} from 'aonweb'

let version = getVersion()

console.log("sdk version = ",version)

let appData = null
let visit_count_updated = false

function extractSubdomainOrDomain(url) {
    // 去掉 'https://' 或 'http://'
    const cleanedUrl = url.replace(/^https?:\/\//, '');
  
    // 拆分域名部分
    const domainParts = cleanedUrl.split('.');
    // console.log("extractSubdomainOrDomain domainParts = ",domainParts)
  
    // 确保至少有两部分，即主域名和顶级域名
    if (domainParts.length >= 2) {
        let temp = domainParts[0];
        // console.log("extractSubdomainOrDomain temp = ",temp)
        return temp
    } 
    return '';
  }

export async function loadApp(domain) {

    let app_id = import.meta.env.VITE_APPID
    let flag = domain && domain.length && domain.indexOf('localhost') < 0
    if (flag) {
        let name = extractSubdomainOrDomain(domain)
        app_id = name
    }
    console.log("loadApp app_id",app_id)
    let temp = supabase.from('app')
    .select('*')
    if (flag) {
        temp = temp.eq("name",app_id)
    } else {
        temp = temp.eq("id",app_id)
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

export async function loadData(app,key) {
    console.log("loadData in",app.id,app,key)
    let {data: app_material,error} = await supabase
    .from('app_material')
    .select('*')
    .eq("app_key",app.id)
    .eq("field_name",key)
    console.log("loadData",app_material,error)
    let returnDatas = []
    for (let i = 0; i < app_material?.length; i++) {
        let data = app_material[i]
        let returnData = {
            id:data.id,
            value:data.material_value,
            type:key,
            template_id:data.template_id,
            user_id:data.user_id,
            selected:false
        }
        returnDatas.push(returnData)
    }
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
            let data = findKey(temp.template_params, keys[i])
            // console.log("appData findParentKey", data)
            data.options = await loadData(temp, keys[i])
            // console.log("appData data[keys[i]]", data)
        }
        appData = temp
    }
    if (appData && !visit_count_updated) {
        update_visit_count(appData)
        visit_count_updated = true
    }
    return appData
}

export async function upload(filename,file) {
    const { data, error } = await supabase
    .storage
    .from('prediction_result')
    .upload(filename, file, {
        upsert: false,
    })
    if (error) throw error
    const {data:publicurl,error:getURlError} = await supabase.storage.from('prediction_result').getPublicUrl(filename)
    if (getURlError) throw getURlError;
    return publicurl. publicUrl
}

async function update_visit_count(app) {
    if (app) {
        call_eage_function('update_visit_count',{
            app_key:app.id,
            column:'visit_count'
        })
    }
}

export async function update_run_count() {
    if (appData) {
        call_eage_function('update_visit_count',{
            app_key:appData.id,
            column:'run_count'
        })
    }
}