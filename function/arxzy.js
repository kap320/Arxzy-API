const jsobfus = require('javascript-obfuscator')
const axios = require('axios')
const cheerio = require('cheerio')
const cookie = require('cookie')
const fetch = require('node-fetch')
const FormData = require('form-data')
        
        function obfus(query) {
            return new Promise((resolve, reject) => {
                try {
                    const obfuscationResult = jsobfus.obfuscate(query, {
                        compact: false,
                        controlFlowFlattening: true,
                        controlFlowFlatteningThreshold: 1,
                        numbersToExpressions: true,
                        simplify: true,
                        stringArrayShuffle: true,
                        splitStrings: true,
                        stringArrayThreshold: 1
                    });
                    const result = {
                        status: 200,
                        author: `ArxzyDev`,
                        result: obfuscationResult.getObfuscatedCode()
                    }
                    resolve(result)
                } catch (e) {
                    reject(e)
                }
            })
        }
        function cerpen(category) {
            return new Promise((resolve, reject) => {
                let title = category.toLowerCase().replace(/[()*]/g, "")
                let judul = title.replace(/\s/g, "-")
                let page = Math.floor(Math.random() * 5)
                axios.get('http://cerpenmu.com/category/cerpen-' + judul + '/page/' + page)
                    .then((get) => {
                        let $ = cheerio.load(get.data)
                        let link = []
                        $('article.post').each(function(a, b) {
                            link.push($(b).find('a').attr('href'))
                        })
                        let random = link[Math.floor(Math.random() * link.length)]
                        axios.get(random)
                            .then((res) => {
                                let $$ = cheerio.load(res.data)
                                let hasil = {
                                    title: $$('#content > article > h1').text(),
                                    author: $$('#content > article').text().split('Cerpen Karangan: ')[1].split('Kategori: ')[0],
                                    kategori: $$('#content > article').text().split('Kategori: ')[1].split('\n')[0],
                                    lolos: $$('#content > article').text().split('Lolos moderasi pada: ')[1].split('\n')[0],
                                    cerita: $$('#content > article > p').text()
                                }
                                resolve(hasil)
                            })
                    })
            })
        }
        function hentaivid() {
            return new Promise((resolve, reject) => {
                const page = Math.floor(Math.random() * 1153)
                axios.get('https://sfmcompile.club/page/'+page)
                .then((data) => {
                    const $ = cheerio.load(data.data)
                    const hasil = []
                    $('#primary > div > div > ul > li > article').each(function (a, b) {
                        hasil.push({
                            title: $(b).find('header > h2').text(),
                            link: $(b).find('header > h2 > a').attr('href'),
                            category: $(b).find('header > div.entry-before-title > span > span').text().replace('in ', ''),
                            share_count: $(b).find('header > div.entry-after-title > p > span.entry-shares').text(),
                            views_count: $(b).find('header > div.entry-after-title > p > span.entry-views').text(),
                            type: $(b).find('source').attr('type') || 'image/jpeg',
                            video_1: $(b).find('source').attr('src') || $(b).find('img').attr('data-src'),
                            video_2: $(b).find('video > a').attr('href') || ''
                        })
                    })
                    resolve(hasil)
                })
            })
        }
        function pinterest(query) {
            return new Promise((resolve, reject) => {
                axios.get('https://id.pinterest.com/search/pins/?autologin=true&q=' + query, {
                    headers: {
                        "cookie": "_auth=1; _b=\"AVna7S1p7l1C5I9u0+nR3YzijpvXOPc6d09SyCzO+DcwpersQH36SmGiYfymBKhZcGg=\"; _pinterest_sess=TWc9PSZHamJOZ0JobUFiSEpSN3Z4a2NsMk9wZ3gxL1NSc2k2NkFLaUw5bVY5cXR5alZHR0gxY2h2MVZDZlNQalNpUUJFRVR5L3NlYy9JZkthekp3bHo5bXFuaFZzVHJFMnkrR3lTbm56U3YvQXBBTW96VUgzVUhuK1Z4VURGKzczUi9hNHdDeTJ5Y2pBTmxhc2owZ2hkSGlDemtUSnYvVXh5dDNkaDN3TjZCTk8ycTdHRHVsOFg2b2NQWCtpOWxqeDNjNkk3cS85MkhhSklSb0hwTnZvZVFyZmJEUllwbG9UVnpCYVNTRzZxOXNJcmduOVc4aURtM3NtRFo3STlmWjJvSjlWTU5ITzg0VUg1NGhOTEZzME9SNFNhVWJRWjRJK3pGMFA4Q3UvcHBnWHdaYXZpa2FUNkx6Z3RNQjEzTFJEOHZoaHRvazc1c1UrYlRuUmdKcDg3ZEY4cjNtZlBLRTRBZjNYK0lPTXZJTzQ5dU8ybDdVS015bWJKT0tjTWYyRlBzclpiamdsNmtpeUZnRjlwVGJXUmdOMXdTUkFHRWloVjBMR0JlTE5YcmhxVHdoNzFHbDZ0YmFHZ1VLQXU1QnpkM1FqUTNMTnhYb3VKeDVGbnhNSkdkNXFSMXQybjRGL3pyZXRLR0ZTc0xHZ0JvbTJCNnAzQzE0cW1WTndIK0trY05HV1gxS09NRktadnFCSDR2YzBoWmRiUGZiWXFQNjcwWmZhaDZQRm1UbzNxc21pV1p5WDlabm1UWGQzanc1SGlrZXB1bDVDWXQvUis3elN2SVFDbm1DSVE5Z0d4YW1sa2hsSkZJb1h0MTFpck5BdDR0d0lZOW1Pa2RDVzNySWpXWmUwOUFhQmFSVUpaOFQ3WlhOQldNMkExeDIvMjZHeXdnNjdMYWdiQUhUSEFBUlhUVTdBMThRRmh1ekJMYWZ2YTJkNlg0cmFCdnU2WEpwcXlPOVZYcGNhNkZDd051S3lGZmo0eHV0ZE42NW8xRm5aRWpoQnNKNnNlSGFad1MzOHNkdWtER0xQTFN5Z3lmRERsZnZWWE5CZEJneVRlMDd2VmNPMjloK0g5eCswZUVJTS9CRkFweHc5RUh6K1JocGN6clc1JmZtL3JhRE1sc0NMTFlpMVErRGtPcllvTGdldz0=; _ir=0"
                    }
                }).then(({
                    data
                }) => {
                    const $ = cheerio.load(data)
                    const result = [];
                    const hasil = [];
                    $('div > a').get().map(b => {
                        const link = $(b).find('img').attr('src')
                        result.push(link)
                    });
                    result.forEach(v => {
                        if (v == undefined) return
                        hasil.push(v.replace(/236/g, '736'))
                    })
                    hasil.shift();
                    resolve(hasil)
                })
            })
        }
        function apkDl(url) {
            let res = fetch("https://apk.support/gapi/index.php", {
                method: "post",
                body: new URLSearchParams(
                    Object.entries({
                        x: "downapk",
                        t: 1,
                        google_id: url,
                        device_id: "",
                        language: "en-US",
                        dpi: 480,
                        gl: "SUQ=",
                        model: "",
                        hl: "en",
                        de_av: "",
                        aav: "",
                        android_ver: 5.1,
                        tbi: "arm64-v8a",
                        country: 0,
                        gc: undefined,
                    })
                ),
            });
            let $ = cheerio.load(res.text());
            let fileName = $("div.browser > div.dvContents > ul > li > a")
            .text()
            .trim()
            .split(" ")[0];
            let download = $("div.browser > div.dvContents > ul > li > a").attr("href");
            if (!download) throw "Can't download the apk!";
            let mimetype = fetch(download, { method: "head" }).headers.get(
                "content-type"
            );
            return { fileName, mimetype, download };
        }
        function stickersearch(text) {
            return new Promise((resolve, reject) => {
                axios.get(`https://getstickerpack.com/stickers?query=${text}`)
                .then(({data}) => {
                    const $ = cheerio.load(data)
                    const source = []
                    const link = [];
                    var ya = $('#stickerPacks > div > div:nth-child(3) > div > a').text()
                    if (!ya ) return resolve()
                    $('#stickerPacks > div > div:nth-child(3) > div > a').each(function(a, b) {
                        source.push($(b).attr('href'))
                    })
                    axios.get(source[Math.floor(Math.random() * source.length)])
                    .then(({
                        data
                    }) => {
                        const $$ = cheerio.load(data)
                        $$('#stickerPack > div > div.row > div > img').each(function(c, d) {
                            link.push($$(d).attr('src').replace(/&d=200x200/g,''))
                        })
                        result = {
                            title: $$('#intro > div > div > h1').text(),
                            sticker_url: link
                        }
                        resolve(result)
                    })
                }).catch(reject)
            })
        }
        function capcut() {
            var $ = cheerio.load((axios(arguments[0])).data);
            return {
                nama: $("img").attr("alt"),
                used: $("b").text().replace($("img").attr("alt"), ""),
                thumbnail: $("img").attr("src"),
                video: $("video").attr("src"),
            };
        }
        function mediafireDl(url) {
            const res = axios.get(url) 
            const $ = cheerio.load(res.data)
            const hasil = []
            const link = $('a#downloadButton').attr('href')
            const size = $('a#downloadButton').text().replace('Download', '').replace('(', '').replace(')', '').replace('\n', '').replace('\n', '').replace('', '')
            const seplit = link.split('/')
            const nama = seplit[5]
            mime = nama.split('.')
            mime = mime[1]
            hasil.push({ nama, mime, size, link })
            return hasil
        }
        
        function xnxxsearch(query) {
	        return new Promise((resolve, reject) => {
		        const baseurl = 'https://www.xnxx.com'
		        fetch(`${baseurl}/search/${query}/${Math.floor(Math.random() * 3) + 1}`, {method: 'get'})
		        .then(res => res.text())
		        .then(res => {
			        let $ = cheerio.load(res, {
				        xmlMode: false
			        });
			        let title = [];
			        let url = [];
			        let desc = [];
			        let results = [];
			        $('div.mozaique').each(function(a, b) {
				        $(b).find('div.thumb').each(function(c, d) {
					        url.push(baseurl+$(d).find('a').attr('href').replace("/THUMBNUM/", "/"))
				        })
			        })
			        $('div.mozaique').each(function(a, b) {
				        $(b).find('div.thumb-under').each(function(c, d) {
					        desc.push($(d).find('p.metadata').text())
					        $(d).find('a').each(function(e,f) {
					            title.push($(f).attr('title'))
					        })
				        })
			        })
			        for (let i = 0; i < title.length; i++) {
				        results.push({
					        title: title[i],
					        info: desc[i],
					        link: url[i]
				        })
			        }
			        resolve({
				        code: 200,
				        status: true,
				        result: results
			        })
		        })
		        .catch(err => reject({code: 503, status: false, result: err }))
	        })
        }
        function tiktokdl(url) {
            return new Promise((resolve, reject) => {
                axios.get('https://ttdownloader.com/', {
                        headers: {
                            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                            "cookie": "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061"
                        }
                    })
                    .then(({
                        data
                    }) => {
                        const $ = cheerio.load(data)
                        let token = $('#token').attr('value')
                        let config = {
                            'url': url,
                            'format': '',
                            'token': token
                        }
                        axios('https://ttdownloader.com/req/', {
                                method: 'POST',
                                data: new URLSearchParams(Object.entries(config)),
                                headers: {
                                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
                                    "cookie": "PHPSESSID=9ut8phujrprrmll6oc3bist01t; popCookie=1; _ga=GA1.2.1068750365.1625213061; _gid=GA1.2.842420949.1625213061"
                                }
                            })
                            .then(({
                                data
                            }) => {
                                const $ = cheerio.load(data)
                                resolve({
                                    message: 'ArxzyDev',
                                    nowm: $('div:nth-child(2) > div.download > a').attr('href'),
                                    wm: $('div:nth-child(3) > div.download > a').attr('href'),
                                    audio: $('div:nth-child(4) > div.download > a').attr('href')
                                })
                            })
                    })
                    .catch(reject)
            })
        }
        
        function xnxxdl(URL) {
	        return new Promise((resolve, reject) => {
		        fetch(`${URL}`, {method: 'get'})
		        .then(res => res.text())
		        .then(res => {
			        let $ = cheerio.load(res, {
				        xmlMode: false
			        });
			        const title = $('meta[property="og:title"]').attr('content');
			        const duration = $('meta[property="og:duration"]').attr('content');
			        const image = $('meta[property="og:image"]').attr('content');
			        const videoType = $('meta[property="og:video:type"]').attr('content');
			        const videoWidth = $('meta[property="og:video:width"]').attr('content');
			        const videoHeight = $('meta[property="og:video:height"]').attr('content');
			        const info = $('span.metadata').text();
			        const videoScript = $('#video-player-bg > script:nth-child(6)').html();
			        const files = {
				        low: (videoScript.match('html5player.setVideoUrlLow\\(\'(.*?)\'\\);') || [])[1],
				        high: videoScript.match('html5player.setVideoUrlHigh\\(\'(.*?)\'\\);' || [])[1],
				        HLS: videoScript.match('html5player.setVideoHLS\\(\'(.*?)\'\\);' || [])[1],
				        thumb: videoScript.match('html5player.setThumbUrl\\(\'(.*?)\'\\);' || [])[1],
				        thumb69: videoScript.match('html5player.setThumbUrl169\\(\'(.*?)\'\\);' || [])[1],
				        thumbSlide: videoScript.match('html5player.setThumbSlide\\(\'(.*?)\'\\);' || [])[1],
				        thumbSlideBig: videoScript.match('html5player.setThumbSlideBig\\(\'(.*?)\'\\);' || [])[1],
			        };
			        resolve({
				        status: 200,
				        result: {
					        title,
					        URL,
					        duration,
					        image,
					        videoType,
					        videoWidth,
					        videoHeight,
					        info,
					        files
				        }
			        })
		        })
		        .catch(err => reject({code: 503, status: false, result: err }))
	        })
        }
        function quote(text, name, avatar) {
            const json = {
                "type": "quote",
                "format": "png",
                "backgroundColor": "#FFFFFF",
                "width": 512,
                "height": 768,
                "scale": 2,
                "messages": [
                    {
                        "entities": [],
                        "avatar": true,
                        "from": {
                            "id": 1,
                            "name": name,
                            "photo": {
                                "url": avatar,
                            }
                        },
                        "text": text,
                        "replyMessage": {}
                    }
                ]
            };
            const res = axios.post('https://bot.lyo.su/quote/generate', json, {
                headers: {'Content-Type': 'application/json'}
            })
            const buffer = Buffer.from(res.data.result.image, 'base64')
            return { 
                status: "200", 
                creator: "ArxzyDev",
                result: buffer
            }
        }
        function post(url, formdata = {}, cookies) {
            let encode = encodeURIComponent;
            let body = Object.keys(formdata)
            .map((key) => {
                let vals = formdata[key];
                let isArray = Array.isArray(vals);
                let keys = encode(key + (isArray ? "[]" : ""));
                if (!isArray) vals = [vals];
                let out = [];
                for (let valq of vals) out.push(keys + "=" + encode(valq));
                return out.join("&");
            })
            .join("&");
            return fetch(`${url}?${body}`, {
                method: "GET",
                headers: {
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "GoogleBot",
                    Cookie: cookies,
                },
            });
        }
        function textpro(url, text) {
            if (!/^https:\/\/textpro\.me\/.+\.html$/.test(url))
            throw new Error("Url Salah!!");
            const geturl = fetch(url, {
                method: "GET",
                headers: {
                    "User-Agent": "GoogleBot",
                },
            });
            const caritoken = geturl.text();
            let hasilcookie = geturl.headers
            .get("set-cookie")
            .split(",")
            .map((v) => cookie.parse(v))
            .reduce((a, c) => {
                return { ...a, ...c };
            }, {});
            hasilcookie = {
                __cfduid: hasilcookie.__cfduid,
                PHPSESSID: hasilcookie.PHPSESSID,
            };
            hasilcookie = Object.entries(hasilcookie)
            .map(([name, value]) => cookie.serialize(name, value))
            .join("; ");
            const $ = cheerio.load(caritoken);
            const token = $('input[name="token"]').attr("value");
            const form = new FormData();
            if (typeof text === "string") text = [text];
            for (let texts of text) form.append("text[]", texts);
            form.append("submit", "Go");
            form.append("token", token);
            form.append("build_server", "https://textpro.me");
            form.append("build_server_id", 1);
            const geturl2 = fetch(url, {
                method: "POST",
                headers: {
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "User-Agent": "GoogleBot",
                    Cookie: hasilcookie,
                    ...form.getHeaders(),
                },
                body: form.getBuffer(),
            });
            const caritoken2 = geturl2.text();
            const token2 = /<div.*?id="form_value".+>(.*?)<\/div>/.exec(caritoken2);
            if (!token2) throw new Error("Token Tidak Ditemukan!!");
            const prosesimage = post(
                "https://textpro.me/effect/create-image",
                JSON.parse(token2[1]),
                hasilcookie
            );
            const hasil = prosesimage.json();
            return `https://textpro.me${hasil.fullsize_image}`;
        }
        function ephoto(url, texk) {
            let form = new FormData
            let gT = axios.get(url, {
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
                }
            })
            let $ = cheerio.load(gT.data)
            let text = texk
            let token = $("input[name=token]").val()
            let build_server = $("input[name=build_server]").val()
            let build_server_id = $("input[name=build_server_id]").val()
            form.append("text[]", text)
            form.append("token", token)
            form.append("build_server", build_server)
            form.append("build_server_id", build_server_id)
            let res = axios({
                url: url,
                method: "POST",
                data: form,
                headers: {
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                    cookie: gT.headers["set-cookie"]?.join("; "),
                    ...form.getHeaders()
                }
            })
            let $$ = cheerio.load(res.data)
            let json = JSON.parse($$("input[name=form_value_input]").val())
            json["text[]"] = json.text
            delete json.text
            let {
                data
            } = axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json), {
                headers: {
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
                    cookie: gT.headers["set-cookie"].join("; ")
                }
            })
            return build_server + data.image
        }
        function fbdl(url) {
            let res = fetch('https://fdownloader.net/')
            let $ = cheerio.load(res.text())
            let token = $('input[name="__RequestVerificationToken"]').attr('value')
            let json = (fetch('https://fdownloader.net/api/ajaxSearch', {
                method: 'post',
                headers: {
                    cookie: res.headers.get('set-cookie'),
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    referer: 'https://fdownloader.net/'
            },
            body: new URLSearchParams(Object.entries({ __RequestVerificationToken: token, q: url }))
            })) .json()
            let $$ = cheerio.load(json.data)
            let result = {}
            $$('.button.is-success.is-small.download-link-fb').each(function () {
                let quality = $$(this).attr('title').split(' ')[1]
                let link = $$(this).attr('href')
                if (link) result[quality] = link
            })
            return result
        }
module.exports = {
obfus,
cerpen,
hentaivid,
pinterest,
apkDl,
stickersearch,
capcut,
mediafireDl,
tiktokdl,
xnxxdl,
fbdl,
xnxxsearch,
quote,
textpro,
ephoto
}
