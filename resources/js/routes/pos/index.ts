import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/pos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::create
* @see app/Http/Controllers/PosController.php:12
* @route '/pos/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:29
* @route '/pos/sale'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pos/sale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:29
* @route '/pos/sale'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:29
* @route '/pos/sale'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:29
* @route '/pos/sale'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:29
* @route '/pos/sale'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PosController::scan
* @see app/Http/Controllers/PosController.php:52
* @route '/pos/scan'
*/
export const scan = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})

scan.definition = {
    methods: ["post"],
    url: '/pos/scan',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PosController::scan
* @see app/Http/Controllers/PosController.php:52
* @route '/pos/scan'
*/
scan.url = (options?: RouteQueryOptions) => {
    return scan.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::scan
* @see app/Http/Controllers/PosController.php:52
* @route '/pos/scan'
*/
scan.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: scan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::scan
* @see app/Http/Controllers/PosController.php:52
* @route '/pos/scan'
*/
const scanForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: scan.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::scan
* @see app/Http/Controllers/PosController.php:52
* @route '/pos/scan'
*/
scanForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: scan.url(options),
    method: 'post',
})

scan.form = scanForm

/**
* @see \App\Http\Controllers\PosController::remove
* @see app/Http/Controllers/PosController.php:92
* @route '/pos/remove'
*/
export const remove = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: remove.url(options),
    method: 'post',
})

remove.definition = {
    methods: ["post"],
    url: '/pos/remove',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PosController::remove
* @see app/Http/Controllers/PosController.php:92
* @route '/pos/remove'
*/
remove.url = (options?: RouteQueryOptions) => {
    return remove.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::remove
* @see app/Http/Controllers/PosController.php:92
* @route '/pos/remove'
*/
remove.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: remove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::remove
* @see app/Http/Controllers/PosController.php:92
* @route '/pos/remove'
*/
const removeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::remove
* @see app/Http/Controllers/PosController.php:92
* @route '/pos/remove'
*/
removeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: remove.url(options),
    method: 'post',
})

remove.form = removeForm

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
export const latest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

latest.definition = {
    methods: ["get","head"],
    url: '/pos/latest-cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
latest.url = (options?: RouteQueryOptions) => {
    return latest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
latest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
latest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: latest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
const latestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
latestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PosController::latest
* @see app/Http/Controllers/PosController.php:178
* @route '/pos/latest-cart'
*/
latestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: latest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

latest.form = latestForm

/**
* @see \App\Http\Controllers\PosController::clear
* @see app/Http/Controllers/PosController.php:188
* @route '/pos/clear'
*/
export const clear = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

clear.definition = {
    methods: ["post"],
    url: '/pos/clear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PosController::clear
* @see app/Http/Controllers/PosController.php:188
* @route '/pos/clear'
*/
clear.url = (options?: RouteQueryOptions) => {
    return clear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::clear
* @see app/Http/Controllers/PosController.php:188
* @route '/pos/clear'
*/
clear.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clear.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::clear
* @see app/Http/Controllers/PosController.php:188
* @route '/pos/clear'
*/
const clearForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::clear
* @see app/Http/Controllers/PosController.php:188
* @route '/pos/clear'
*/
clearForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: clear.url(options),
    method: 'post',
})

clear.form = clearForm

/**
* @see \App\Http\Controllers\PosController::checkout
* @see app/Http/Controllers/PosController.php:199
* @route '/pos/checkout'
*/
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

checkout.definition = {
    methods: ["post"],
    url: '/pos/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PosController::checkout
* @see app/Http/Controllers/PosController.php:199
* @route '/pos/checkout'
*/
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::checkout
* @see app/Http/Controllers/PosController.php:199
* @route '/pos/checkout'
*/
checkout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::checkout
* @see app/Http/Controllers/PosController.php:199
* @route '/pos/checkout'
*/
const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::checkout
* @see app/Http/Controllers/PosController.php:199
* @route '/pos/checkout'
*/
checkoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkout.url(options),
    method: 'post',
})

checkout.form = checkoutForm

const pos = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
    scan: Object.assign(scan, scan),
    remove: Object.assign(remove, remove),
    latest: Object.assign(latest, latest),
    clear: Object.assign(clear, clear),
    checkout: Object.assign(checkout, checkout),
}

export default pos