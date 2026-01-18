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
* @see app/Http/Controllers/PosController.php:20
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
* @see app/Http/Controllers/PosController.php:20
* @route '/pos/sale'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:20
* @route '/pos/sale'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:20
* @route '/pos/sale'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PosController::store
* @see app/Http/Controllers/PosController.php:20
* @route '/pos/sale'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const pos = {
    create: Object.assign(create, create),
    store: Object.assign(store, store),
}

export default pos