const puppeteer = require('puppeteer')
const request = require('request-promise')
const { parse: parseUrl, URL } = require('url')
const { send } = require('micro')

function toInteger (value) {
    const number = parseInt(value, 10)
    return isNaN(number) ? undefined : number
}

module.exports = async (req, res) => {
    const query = parseUrl(req.url, true).query
    const pageUrl = query.url
    const height = toInteger(query.height || query.h)
    const width = toInteger(query.width || query.w)

    res.setHeader('Access-Control-Allow-Origin', '*')

    if (!pageUrl) {
        return { error: '`url` query query parameter is required.' }
    }

    if (!width) {
        return { error: '`width` query query parameter is required.' }
    }

    const fullPage = (height === undefined)
    const viewport = height ? { width, height } : { width, height: Math.round(width * 16/9) }
    
    const browser = await puppeteer.launch()
    let image

    try {
        const page = await browser.newPage()
        await page.setViewport(viewport)
        await page.goto(pageUrl)
        image = await page.screenshot({ fullPage })
    } catch (err) {
        return { error: `Unable to create screenshot of '${pageUrl}'` }
    } finally {
        await browser.close()
    }

    res.setHeader('Content-Type', 'image/png')
    send(res, 200, image)
}
