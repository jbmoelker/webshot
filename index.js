const pkg = require('./package.json')
const puppeteer = require('puppeteer')
const request = require('request-promise')
const { parse: parseUrl, URL } = require('url')
const { send } = require('micro')

function toInteger (value) {
    const number = parseInt(value, 10)
    return isNaN(number) ? undefined : number
}

function missingParameterError (parameter, type = 'query') {
    return {
        code: 'MISSING_PARAMETER',
        parameter,
        message: `'${parameter}' ${type} parameter is required.`,
        docs: `${pkg.homepage}#parameters`
    }
}

module.exports = async (req, res) => {
    const query = parseUrl(req.url, true).query
    const pageUrl = query.url
    const height = toInteger(query.height || query.h)
    const width = toInteger(query.width || query.w)
    const errors = []

    res.setHeader('Access-Control-Allow-Origin', '*')

    if (!pageUrl) {
        errors.push(missingParameterError('url'))
    }
    if (!width) {
        errors.push(missingParameterError('width'))
    }
    if (errors.length > 0) {
        return send(res, 400, { errors })
    }

    const fullPage = (height === undefined)
    const viewport = height ? { width, height } : { width, height: width }
    let browser
    let image

    try {
        browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        const page = await browser.newPage()
        await page.setViewport(viewport)
        await page.goto(pageUrl)
        image = await page.screenshot({ fullPage })
    } catch (err) {
        return send(res, 500, { errors: [
            { code: 'RENDER_ERROR', message: `Unable to create screenshot of '${pageUrl}'` }
        ] })
    } finally {
        if (browser) {
            await browser.close()
        }
    }

    res.setHeader('Content-Type', 'image/png')
    send(res, 200, image)
}
