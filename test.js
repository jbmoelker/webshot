const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise')
const requestImageSize = require('request-image-size')

const webshot = require('./')

test.beforeEach(async t => {
    const mockSite = micro(async (req, res) => micro.send(res, 200, 'Mock'))
    const mockSiteUrl = await listen(mockSite)
    const service = micro(webshot)
    const url = await listen(service)
    t.context = { mockSite, mockSiteUrl, service, url }
})

test.afterEach(async t => {
    const { mockSite, service } = t.context
    mockSite.close()
    service.close()
})

test('returns PNG image of given web page', async t => {
    const { url, mockSiteUrl } = t.context
    const response = await request({
        method: 'GET',
        uri: `${url}/?url=${mockSiteUrl}&w=400&h=400`,
        resolveWithFullResponse: true,
    })

    t.deepEqual(response.headers['content-type'], 'image/png')
})

test('returns PNG image with given width', async t => {
    const { url, mockSiteUrl } = t.context
    const { width, height } = await requestImageSize(`${url}/?url=${mockSiteUrl}&w=400`)

    t.deepEqual(width, 400)
    t.deepEqual(height > 0, true)
})

test('returns PNG image with given width and height', async t => {
    const { url, mockSiteUrl } = t.context
    const { width, height } = await requestImageSize(`${url}/?url=${mockSiteUrl}&w=400`)

    t.deepEqual(width, 400)
    t.deepEqual(height, 400)
})

test('returns `400` `MISSING_PARAMETER` if request has no `url` parameter', async t => {
    const { url, mockSiteUrl } = t.context
    const response = await request({
        method: 'GET',
        uri: `${url}/?w=400&h=300`,
        resolveWithFullResponse: true,
        simple: false,
    })
    const { errors } = JSON.parse(response.body)

    t.deepEqual(response.statusCode, 400)
    t.deepEqual(errors[0].code, 'MISSING_PARAMETER')
    t.deepEqual(errors[0].parameter, 'url')
})

test('returns `400` `MISSING_PARAMETER` if request has no `width` parameter', async t => {
    const { url, mockSiteUrl } = t.context
    const response = await request({
        method: 'GET',
        uri: `${url}/?url=${mockSiteUrl}&h=400`,
        resolveWithFullResponse: true,
        simple: false,
    })
    const { errors } = JSON.parse(response.body)

    t.deepEqual(response.statusCode, 400)
    t.deepEqual(errors[0].code, 'MISSING_PARAMETER')
    t.deepEqual(errors[0].parameter, 'width')
})

test('returns `500` `RENDER_ERROR` if web page can\'t be rendered', async t => {
    const { url } = t.context
    const mockSiteUrl = 'fakeurl'
    const response = await request({
        method: 'GET',
        uri: `${url}/?url=${mockSiteUrl}&w=400`,
        resolveWithFullResponse: true,
        simple: false,
    })
    const { errors } = JSON.parse(response.body)

    t.deepEqual(response.statusCode, 500)
    t.deepEqual(errors[0].code, 'RENDER_ERROR')
})
