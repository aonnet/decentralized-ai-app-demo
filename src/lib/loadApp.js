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

  export async function get_session() {
    console.log('get_session in')
    const { data, error } = await supabase.auth.getSession()
    console.log("get_session sss = ",data,error)
    if (error) {
        throw error
    }
    return data && data.session
}

export async function save_session(seesion) {
    console.log('save_session in')
    const { data, error } = await supabase.auth.setSession({
        access_token:seesion.access_token,
        refresh_token:seesion.refresh_token,
    })
    console.log("save_session sss = ",data,error)
    if (error) {
        throw error
    }
    return data && data.session
}

  export async function loadApp(domain,path) {
    console.log('loadApp in = ',domain,path)

    let app_id = import.meta.env.VITE_APPID

    let flag = domain && domain.length && domain.indexOf('localhost') < 0
    if (flag) {
        let name = extractSubdomainOrDomain(domain)
        app_id = name
        console.log("loadApp flag app_id",app_id)
    }
    if (path) {
        const params = new URLSearchParams(path);
        let is_preview = params.get('is_preview')
        let app_key = params.get('app_key')
        console.log('loadApp is_preview = ',params,is_preview,app_key)
        if (is_preview) {
            flag = false
            app_id = app_key
        }
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
    // update_visit_count(app)
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


export async function loadAppData(domain,path) {
    if (!appData) {
        let temp  = await loadApp(domain,path)
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

export async function get_task_group() {
    if (appData) {
        let { data, error } = await supabase
        .from('app_task_group')
        .select('*')
        .is('deleted_at',null)
        .eq('app_key',appData.id)
        console.log('get_task_group = ',data,error)
        if (error) throw error
        return data
    }
    return []
}

export async function update_user_name(username,id) {
    const { data, error } = await supabase
    .from('profiles')
    .update({ username: username })
    .eq('id', id)
    .select()
   if (error) throw error
   return data
}

async function user_assets_total(user_id) {
    let conditions = []
    if (user_id) {
        conditions.push({field:'user_id',value:user_id})
    }
    let data = await countDynamic('user_asset',conditions)
    console.log('user_assets_total = ',data)
    return data
}

export async function user_assets(page,size,user_id) {
    let total = await user_assets_total(user_id)
    if (total <= 0) {
        return []
    }
    page = page ? page : 1
    size = size ? size : 10
    let offset = (page - 1) * size
    size =  offset + size - 1
    let select = supabase
    .from("user_asset")
    .select("*")
    //可以添加其他查询条件
    let {data,error} = await select.range(offset,size)
    console.log('user_assets',data,error)
   if (error) throw error
   return {
    total:total,
    data:data
   }
}

const countDynamic = async (tableName, conditions = []) => {
    const { data, error } = await supabase
      .rpc('count_dynamic', {
        table_name: tableName,
        conditions: conditions
      })
  
    if (error) {
      console.error('Error counting records:', error)
      return
    }
  
    console.log(`Count of records in ${tableName} with conditions ${JSON.stringify(conditions)}:`, data)
    return data
}

async function ledger_total(user_id) {
    let conditions = []
    if (user_id) {
        conditions.push({field:'user_id',value:user_id})
    }
    let data = await countDynamic('ledger',conditions)
    console.log('ledger_total = ',data)
    return data
}

export async function ledger(page,size,filter,user_id) {
    let total = await ledger_total(user_id)
    if (total <= 0) {
        return []
    }
    page = page ? page : 1
    size = size ? size : 10
    let offset = (page - 1) * size
    size =  offset + size - 1
    console.log('ledger = ',page,size,offset)
    let select = supabase
    .from("ledger")
    .select("*,asset(symbol)")
    if (filter && filter.category) {
        select = select.eq('category',filter.category)
    }
    //可以添加其他查询条件
    let {data,error} = await select.range(offset,size)
    console.log('ledger = ',data,error)
    if (error) {
        throw error
    }
    return {
        total:total,
        data:data
    }
}