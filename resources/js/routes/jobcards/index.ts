import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/job-cards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::index
* @see app/Http/Controllers/JobCardController.php:13
* @route '/job-cards'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/job-cards/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\JobCardController::create
* @see app/Http/Controllers/JobCardController.php:19
* @route '/job-cards/create'
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
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:33
* @route '/job-cards'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/job-cards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:33
* @route '/job-cards'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:33
* @route '/job-cards'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:33
* @route '/job-cards'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\JobCardController::store
* @see app/Http/Controllers/JobCardController.php:33
* @route '/job-cards'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const jobcards = {
    index: Object.assign(index, index),
    create: Object.assign(create, create),
    store: Object.assign(store, store),
}

export default jobcards