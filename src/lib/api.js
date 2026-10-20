let csrfToken = '';
let sessionRequest;
const endpoint = route => {
 const url = new URL('api/index.php', document.baseURI);
 const [path, query = ''] = route.split('?');
 url.search = new URLSearchParams({route: path, ...Object.fromEntries(new URLSearchParams(query))});
 return url;
};
async function decode(response) {
 let data;
 try { data = await response.json(); } catch { throw new Error('The PHP API is unavailable. Start Apache/PHP and check the setup instructions.'); }
 if (!response.ok) {const error = new Error(data.error || 'Request failed.');error.status=response.status;throw error;}
 if (data.csrf) csrfToken=data.csrf;
 return data;
}
export async function session() {
 if (!sessionRequest) sessionRequest=fetch(endpoint('session'),{credentials:'same-origin'}).then(decode).catch(error=>{sessionRequest=null;throw error;});
 return sessionRequest;
}
export async function api(route,options={}) {
 const method=options.method||'GET';
 if (method!=='GET') await session();
 const response=await fetch(endpoint(route),{method,credentials:'same-origin',signal:options.signal,headers:{...(options.body?{'Content-Type':'application/json'}:{}),...(method!=='GET'?{'X-CSRF-Token':csrfToken}:{})},...(options.body?{body:JSON.stringify(options.body)}:{})});
 try {const result=await decode(response);if(result.csrf)sessionRequest=Promise.resolve(result);return result;}
 catch(error){if(error.status===419)sessionRequest=null;throw error;}
}
export function imageUrl(image='assets/home.jpg') {return /^https?:\/\//i.test(image)?image:image.replace(/^\//,'');}
export function priceLabel(p) {if(p.price===null||p.price===undefined)return 'Price on request';return `₦${Number(p.price).toLocaleString('en-NG')}${p.price_period==='year'?' / year':p.price_period==='month'?' / month':''}`;}
